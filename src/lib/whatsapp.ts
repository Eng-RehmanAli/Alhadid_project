import { founder } from "@/data/founder";

export function whatsappEnrollUrl(courseTitle: string) {
  const text = encodeURIComponent(
    `Assalamualaikum. I want to enroll in: ${courseTitle}`,
  );
  return `${founder.whatsapp}?text=${text}`;
}

export function whatsappGeneralUrl(message?: string) {
  if (!message) return founder.whatsapp;
  return `${founder.whatsapp}?text=${encodeURIComponent(message)}`;
}
