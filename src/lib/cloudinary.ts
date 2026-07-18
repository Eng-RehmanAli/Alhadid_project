import "server-only";

import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_LESSON_FOLDER = "alhadid/lessons";

function readEnv(name: string) {
  const raw = process.env[name];
  if (raw == null) return "";
  let value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

function getCloudinaryConfig() {
  const cloudName = readEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = readEnv("CLOUDINARY_API_KEY");
  const apiSecret = readEnv("CLOUDINARY_API_SECRET");

  const missing = [
    !cloudName ? "CLOUDINARY_CLOUD_NAME" : null,
    !apiKey ? "CLOUDINARY_API_KEY" : null,
    !apiSecret ? "CLOUDINARY_API_SECRET" : null,
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Cloudinary is not configured. Add ${missing.join(", ")} to .env, then restart the server.`,
    );
  }

  // Cloud names are account IDs from Cloudinary (e.g. "demo", "dxyz123"), not a custom title.
  if (
    !/^[a-z0-9_-]+$/i.test(cloudName) ||
    /for[_-]?the[_-]?alhadid/i.test(cloudName)
  ) {
    throw new Error(
      'CLOUDINARY_CLOUD_NAME is wrong. Open https://console.cloudinary.com → Dashboard → Account Details and copy the real Cloud name (short ID). Do not invent names like For_the_alhadid.',
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return { cloudName, apiKey, apiSecret };
}

export function createLessonVideoUploadSignature() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    folder: CLOUDINARY_LESSON_FOLDER,
    timestamp,
  };

  return {
    apiKey,
    cloudName,
    folder: CLOUDINARY_LESSON_FOLDER,
    timestamp,
    signature: cloudinary.utils.api_sign_request(paramsToSign, apiSecret),
  };
}

export async function deleteLessonVideo(publicId: string) {
  if (!publicId.startsWith(`${CLOUDINARY_LESSON_FOLDER}/`)) return;

  getCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
    invalidate: true,
  });
}

/**
 * Build an audio-only MP3 delivery URL for a lesson video. Speech is all Gemini
 * needs, so sending audio instead of full video keeps the transfer small, fast,
 * and cheap. The full-quality video keeps streaming to students unchanged.
 *
 * Note: do not use `ar_` here — on video resources Cloudinary treats `ar` as
 * aspect ratio, not audio sample rate, and it breaks the URL.
 */
export function getLessonAudioUrl(publicId: string) {
  if (!publicId.startsWith(`${CLOUDINARY_LESSON_FOLDER}/`)) {
    throw new Error("Invalid lesson video public id.");
  }

  const { cloudName } = getCloudinaryConfig();
  return `https://res.cloudinary.com/${cloudName}/video/upload/f_mp3,ac_1,q_auto/${publicId}`;
}

/** Original Cloudinary video URL — fallback when audio extraction fails. */
export function getLessonVideoUrl(publicId: string) {
  if (!publicId.startsWith(`${CLOUDINARY_LESSON_FOLDER}/`)) {
    throw new Error("Invalid lesson video public id.");
  }

  const { cloudName } = getCloudinaryConfig();
  return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}`;
}
