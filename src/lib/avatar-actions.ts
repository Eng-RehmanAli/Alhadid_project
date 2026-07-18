"use server";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-actions";
import { connectMongo } from "@/lib/db";
import { User } from "@/models/User";

export type AvatarState = {
  error?: string;
  success?: string;
};

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function uploadsDir() {
  return path.join(process.cwd(), "public", "uploads", "avatars");
}

function isLocalAvatar(url: string | null | undefined) {
  return Boolean(url && url.startsWith("/uploads/avatars/"));
}

async function removeLocalFile(url: string | null | undefined) {
  if (!isLocalAvatar(url)) return;
  const filePath = path.join(process.cwd(), "public", url!);
  try {
    await unlink(filePath);
  } catch {
    // Missing file is fine — DB is source of truth.
  }
}

export async function uploadAvatarAction(
  _prev: AvatarState,
  formData: FormData,
): Promise<AvatarState> {
  const user = await requireUser();
  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image must be 2 MB or smaller." };
  }

  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return { error: "Use a JPG, PNG, WebP, or GIF image." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });

  const filename = `${user.id}-${Date.now()}.${ext}`;
  const publicUrl = `/uploads/avatars/${filename}`;
  await writeFile(path.join(dir, filename), buffer);

  await connectMongo();
  const existing = await User.findById(user.id).select("avatarUrl").lean();
  await User.findByIdAndUpdate(user.id, { avatarUrl: publicUrl });
  await removeLocalFile(existing?.avatarUrl ?? null);

  revalidatePath("/dashboard");
  revalidatePath("/account");
  return { success: "Profile photo updated." };
}

export async function removeAvatarAction(
  _prev: AvatarState = {},
  _formData?: FormData,
): Promise<AvatarState> {
  const user = await requireUser();
  await connectMongo();
  const existing = await User.findById(user.id).select("avatarUrl").lean();
  await User.findByIdAndUpdate(user.id, { avatarUrl: null });
  await removeLocalFile(existing?.avatarUrl ?? null);

  revalidatePath("/dashboard");
  revalidatePath("/account");
  return { success: "Profile photo removed." };
}
