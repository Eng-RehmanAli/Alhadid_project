"use client";

import { useActionState, useState } from "react";
import {
  deleteLessonAction,
  getVideoUploadSignatureAction,
  upsertLessonAction,
  type AdminActionState,
} from "@/lib/admin-actions";
import { LessonSummaryButton } from "@/components/LessonSummaryButton";
import type { SummaryStatus } from "@/models/Lesson";

const initial: AdminActionState = {};

export function LessonAdminForm({
  courses,
  lessons,
}: {
  courses: { slug: string; title: string }[];
  lessons: {
    id: string;
    courseSlug: string;
    slug: string;
    title: string;
    moduleTitle: string;
    moduleIndex: number;
    order: number;
    type: string;
    content: string;
    durationMinutes?: number | null;
    summaryStatus?: SummaryStatus;
    summaryGeneratedAt?: string | null;
  }[];
}) {
  const [state, action, pending] = useActionState(upsertLessonAction, initial);
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteLessonAction,
    initial,
  );
  const [content, setContent] = useState("");
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const field =
    "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-teal";

  async function uploadVideo(file: File) {
    setUploadError("");

    if (!file.type.startsWith("video/")) {
      setUploadError("Choose a video file.");
      return;
    }

    const maxBytes = 500 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError("Video must be 500 MB or smaller.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await getVideoUploadSignatureAction();
      if (result.error || !result.upload) {
        throw new Error(result.error ?? "Could not prepare the upload.");
      }

      const { apiKey, cloudName, folder, signature, timestamp } = result.upload;
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", apiKey);
      uploadData.append("timestamp", String(timestamp));
      uploadData.append("signature", signature);
      uploadData.append("folder", folder);

      const response = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/video/upload`,
        );
        request.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        request.onerror = () => reject(new Error("The video upload failed."));
        request.onload = () => {
          let body: {
            secure_url?: string;
            public_id?: string;
            error?: { message?: string };
          };
          try {
            body = JSON.parse(request.responseText) as typeof body;
          } catch {
            reject(new Error("Cloudinary returned an invalid response."));
            return;
          }

          if (
            request.status < 200 ||
            request.status >= 300 ||
            !body.secure_url ||
            !body.public_id
          ) {
            reject(
              new Error(body.error?.message ?? "The video upload failed."),
            );
            return;
          }

          resolve({
            secure_url: body.secure_url,
            public_id: body.public_id,
          });
        };
        request.send(uploadData);
      });

      setContent(response.secure_url);
      setCloudinaryPublicId(response.public_id);
      setUploadProgress(100);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "The video upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-4">
        <p className="text-sm font-semibold text-ink">Add video lesson</p>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Course</span>
          <select name="courseSlug" required defaultValue="" className={field}>
            <option value="" disabled>
              Select a course
            </option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Video title</span>
          <input
            name="title"
            required
            placeholder="Enter the video title"
            className={field}
          />
        </label>
        <input type="hidden" name="type" value="video" />
        <input type="hidden" name="moduleTitle" value="Course videos" />
        <input type="hidden" name="moduleIndex" value="0" />
        <input type="hidden" name="content" value={content} />
        <input
          type="hidden"
          name="cloudinaryPublicId"
          value={cloudinaryPublicId}
        />

        <div className="rounded-2xl border border-line-dark bg-mist/60 p-4">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Choose video</span>
            <input
              type="file"
              accept="video/*"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadVideo(file);
                event.target.value = "";
              }}
              className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-teal-dark file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-teal-deep disabled:opacity-60"
            />
          </label>
          {uploading ? (
            <div className="mt-3" role="status">
              <div className="h-2 overflow-hidden rounded-full bg-line-dark">
                <div
                  className="h-full rounded-full bg-teal transition-[width]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted">
                Uploading… {uploadProgress}%
              </p>
            </div>
          ) : null}
          {cloudinaryPublicId && !uploading ? (
            <p className="mt-2 text-sm font-medium text-teal-deep">
              Video uploaded. Click “Add video” to publish it.
            </p>
          ) : null}
          {uploadError ? (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {uploadError}
            </p>
          ) : null}
        </div>
        {state.error ? (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p role="status" className="text-sm text-teal-deep">
            {state.success}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={
            pending || uploading || !content || courses.length === 0
          }
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-teal-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Add video"}
        </button>
      </form>

      {deleteState.error ? (
        <p role="alert" className="text-sm text-red-700">
          {deleteState.error}
        </p>
      ) : null}
      {deleteState.success ? (
        <p role="status" className="text-sm text-teal-deep">
          {deleteState.success}
        </p>
      ) : null}

      <div className="border-t border-line-dark pt-8">
        <p className="text-sm font-semibold text-ink">Published lessons</p>
        <p className="mt-1 text-sm text-muted">
          For video lessons, use <span className="font-medium text-ink">Generate summary</span> in
          the Summary column (after the video is saved).
        </p>
      </div>

      {lessons.length === 0 ? (
        <p className="text-sm text-muted">No lessons yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line-dark bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-line-dark text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Lesson</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Summary</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-dark">
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="px-5 py-3 text-muted">{lesson.courseSlug}</td>
                  <td className="px-5 py-3 font-medium text-ink">
                    {lesson.title}
                  </td>
                  <td className="px-5 py-3 capitalize text-ink">{lesson.type}</td>
                  <td className="px-5 py-3 text-muted">{lesson.order}</td>
                  <td className="px-5 py-3">
                    {lesson.type === "video" ? (
                      <LessonSummaryButton
                        lessonId={lesson.id}
                        initialStatus={lesson.summaryStatus ?? "idle"}
                        initialGeneratedAt={lesson.summaryGeneratedAt ?? null}
                      />
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <form
                      action={deleteAction}
                      onSubmit={(e) => {
                        if (!confirm(`Delete lesson “${lesson.title}”?`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input
                        type="hidden"
                        name="lessonId"
                        value={lesson.id}
                      />
                      <button
                        type="submit"
                        disabled={deletePending}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
