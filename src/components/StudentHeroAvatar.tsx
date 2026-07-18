"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { uploadAvatarAction, type AvatarState } from "@/lib/avatar-actions";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function StudentHeroAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadState, uploadAction, uploading] = useActionState(
    uploadAvatarAction,
    {} as AvatarState,
  );

  const shown = preview ?? avatarUrl;
  const message = uploadState.error || uploadState.success;

  useEffect(() => {
    if (uploadState.success) {
      setPreview(null);
    }
  }, [uploadState.success]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFileChange(file: File | undefined) {
    if (!file) return;
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:items-center">
      <div className="animate-float relative">
        <div className="relative size-24 overflow-hidden rounded-full border-2 border-lime/80 bg-teal-dark shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:size-28">
          {shown ? (
            shown.startsWith("blob:") ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob preview before upload
              <img
                src={shown}
                alt={`${name}'s profile photo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={shown}
                alt={`${name}'s profile photo`}
                fill
                className="object-cover"
                sizes="112px"
              />
            )
          ) : (
            <span className="grid h-full w-full place-items-center font-display text-2xl font-semibold text-lime sm:text-3xl">
              {initials(name)}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 inline-flex size-9 items-center justify-center rounded-full border border-white/30 bg-lime text-ink shadow-md hover:bg-lime-soft disabled:opacity-60"
          aria-label="Change profile photo"
          title="Change profile photo"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 17.5V19a1 1 0 0 0 1 1h1.5M14.5 5.5l4 4M7 17l9.2-9.2a1.5 1.5 0 0 1 2.1 0l1.9 1.9a1.5 1.5 0 0 1 0 2.1L11 21H7v-4z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <form action={uploadAction} className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          name="avatar"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            onFileChange(file);
            if (file) e.currentTarget.form?.requestSubmit();
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/35 px-3.5 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : avatarUrl ? "Change photo" : "Add photo"}
        </button>
      </form>

      {message ? (
        <p
          className={`max-w-[14rem] text-xs ${
            uploadState.error ? "text-red-200" : "text-lime"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
