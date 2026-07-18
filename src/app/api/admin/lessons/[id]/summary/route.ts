import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { connectMongo } from "@/lib/db";
import { getLessonAudioUrl, getLessonVideoUrl } from "@/lib/cloudinary";
import { summarizeLessonAudio } from "@/lib/gemini";
import { Lesson } from "@/models/Lesson";

export const runtime = "nodejs";
// Give Gemini enough time to transcribe. Vercel caps this per plan
// (Hobby ~60s, Pro up to 300s); Hostinger has no such limit.
export const maxDuration = 300;

function friendlyFetchError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/terminated|UND_ERR_SOCKET|other side closed|ECONNRESET|ETIMEDOUT/i.test(message)) {
    return "Download from Cloudinary was interrupted (network closed early). Try again, or use a shorter / smaller video.";
  }
  return message;
}

async function fetchBytes(
  url: string,
  attempts = 3,
): Promise<{ bytes: ArrayBuffer; mimeType: string } | null> {
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, {
        // Avoid hanging forever on a stalled CDN connection.
        signal: AbortSignal.timeout(120_000),
      });
      if (!response.ok) return null;

      const bytes = await response.arrayBuffer();
      const contentType =
        response.headers.get("content-type") ?? "application/octet-stream";
      return {
        bytes,
        mimeType: contentType.split(";")[0]?.trim() || "application/octet-stream",
      };
    } catch (error) {
      lastError = error;
      // Brief pause then retry — Cloudinary sometimes drops mid-stream.
      await new Promise((resolve) => setTimeout(resolve, 800 * (i + 1)));
    }
  }

  if (lastError) throw lastError;
  return null;
}

async function fetchLessonMedia(
  publicId: string,
  contentUrl: string,
): Promise<{ bytes: ArrayBuffer; mimeType: string }> {
  // 1) Prefer compact mono MP3 (fastest for Gemini).
  const audio = await fetchBytes(getLessonAudioUrl(publicId));
  if (audio) {
    return { bytes: audio.bytes, mimeType: "audio/mpeg" };
  }

  // 2) Smaller compressed video — less likely to get socket-terminated.
  const compactVideoUrl = getLessonVideoUrl(publicId).replace(
    "/upload/",
    "/upload/q_auto:eco,vc_auto/",
  );
  const compact = await fetchBytes(compactVideoUrl);
  if (compact) {
    return {
      bytes: compact.bytes,
      mimeType: compact.mimeType.startsWith("video/")
        ? compact.mimeType
        : "video/mp4",
    };
  }

  // 3) Original saved URL / full video.
  const videoUrl = contentUrl.startsWith("https://res.cloudinary.com/")
    ? contentUrl
    : getLessonVideoUrl(publicId);
  const original = await fetchBytes(videoUrl);
  if (original) {
    return {
      bytes: original.bytes,
      mimeType: original.mimeType.startsWith("video/")
        ? original.mimeType
        : "video/mp4",
    };
  }

  throw new Error(
    "Could not fetch the lesson media from Cloudinary. Check the video still exists and Cloudinary credentials are correct.",
  );
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const { id } = await context.params;

  await connectMongo();
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }
  if (lesson.type !== "video" || !lesson.cloudinaryPublicId) {
    return NextResponse.json(
      {
        error:
          "This lesson has no Cloudinary video. Re-upload the video with “Choose File” (YouTube-only or old links cannot be summarized).",
      },
      { status: 400 },
    );
  }
  if (lesson.summaryStatus === "processing") {
    return NextResponse.json({ status: "processing" });
  }

  lesson.summaryStatus = "processing";
  lesson.summaryError = undefined;
  await lesson.save();

  try {
    const { bytes, mimeType } = await fetchLessonMedia(
      lesson.cloudinaryPublicId,
      lesson.content,
    );

    const { transcript, summary } = await summarizeLessonAudio(bytes, mimeType);

    lesson.transcript = transcript;
    lesson.summary = summary;
    lesson.summaryStatus = "ready";
    lesson.summaryError = undefined;
    lesson.summaryGeneratedAt = new Date();
    await lesson.save();

    revalidatePath("/admin");
    revalidatePath(`/learn/${lesson.courseSlug}/${lesson.slug}`);

    return NextResponse.json({
      status: "ready",
      summary,
      generatedAt: lesson.summaryGeneratedAt.toISOString(),
    });
  } catch (error) {
    const message = friendlyFetchError(error);
    console.error("Lesson summary generation failed:", error);

    lesson.summaryStatus = "failed";
    lesson.summaryError = message;
    await lesson.save();

    return NextResponse.json({ status: "failed", error: message }, { status: 500 });
  }
}
