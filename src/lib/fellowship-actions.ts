"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  isValidEmail,
  normalizeEmail,
  sanitizeName,
} from "@/lib/auth-validation";
import { connectMongo } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { WaitlistEntry } from "@/models/WaitlistEntry";

export type FellowshipWaitlistState = {
  error?: string;
  success?: string;
};

const FIELD_MAX = 120;
const WHATSAPP_MAX = 24;

async function clientKey(prefix: string) {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  return `${prefix}:${ip}`;
}

function cleanText(raw: FormDataEntryValue | null, max = FIELD_MAX) {
  return String(raw ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

function normalizeWhatsApp(raw: string) {
  return raw.replace(/[^\d+]/g, "").slice(0, WHATSAPP_MAX);
}

export async function joinFellowshipWaitlistAction(
  _prev: FellowshipWaitlistState,
  formData: FormData,
): Promise<FellowshipWaitlistState> {
  const limit = rateLimit(await clientKey("fellowship-waitlist"), 5, 15 * 60_000);
  if (!limit.ok) {
    return {
      error: `Too many attempts. Please try again in ${limit.retryAfterSec}s.`,
    };
  }

  const name = sanitizeName(String(formData.get("name") ?? ""));
  const ageRaw = cleanText(formData.get("age"), 3);
  const city = cleanText(formData.get("city"));
  const profession = cleanText(formData.get("profession"));
  const whatsapp = normalizeWhatsApp(cleanText(formData.get("whatsapp"), WHATSAPP_MAX));
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const university = cleanText(formData.get("university"));

  if (!name) return { error: "Please enter your full name." };
  if (!ageRaw) return { error: "Please enter your age." };
  const age = Number.parseInt(ageRaw, 10);
  if (!Number.isFinite(age) || age < 14 || age > 100) {
    return { error: "Please enter a valid age." };
  }
  if (!city) return { error: "Please enter your city." };
  if (!profession) {
    return { error: "Please enter your profession or field of study." };
  }
  if (whatsapp.length < 10) {
    return { error: "Please enter a valid WhatsApp number." };
  }
  if (!isValidEmail(email)) {
    return { error: "Please enter a valid Gmail / email address." };
  }
  if (!university) {
    return { error: "Please enter your university or college name." };
  }

  await connectMongo();

  const existing = await WaitlistEntry.findOne({
    $or: [{ email }, { whatsapp }],
    source: "fellowship",
  })
    .select("_id")
    .lean();

  if (existing) {
    return {
      success:
        "You're already in the Fellowship. We'll be in touch with updates.",
    };
  }

  await WaitlistEntry.create({
    name,
    age,
    city,
    profession,
    whatsapp,
    email,
    university,
    source: "fellowship",
  });

  revalidatePath("/admin");
  return {
    success:
      "You're in the Fellowship. We'll be in touch with early access and launch updates.",
  };
}
