"use client";

import { useEffect, useState } from "react";
import { Camera, ImagePlus } from "lucide-react";

type ImageUploaderProps = {
  imageName: string;
  onSelectImage: (file: File | null) => void;
};

export function ImageUploader({ imageName, onSelectImage }: ImageUploaderProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches));
  }, []);

  return (
    <section className="rounded-xl border border-dashed border-[var(--ink-faint)] bg-[var(--surface)] p-3 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))] text-[var(--primary)] shadow-[var(--shadow-soft)]">
        <Camera className="size-6" />
      </div>
      <h2 className="mt-2.5 text-base font-bold tracking-[-0.025em] text-[var(--ink)]">Snap or upload food</h2>
      <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[var(--ink-muted)]">
        Images are sent for AI analysis only and discarded after nutrition metadata is extracted.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label
          className={
            isTouchDevice
              ? "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-white transition active:scale-[0.98]"
              : "inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[var(--primary)]/40 px-4 text-sm font-semibold text-white/40 transition"
          }
        >
          <Camera className="size-4" />
          Camera
          {isTouchDevice ? (
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => onSelectImage(event.target.files?.[0] ?? null)}
            />
          ) : null}
        </label>
        <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--ink-secondary)] transition active:scale-[0.98]">
          <ImagePlus className="size-4" />
          Upload
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={(event) => onSelectImage(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      {imageName ? (
        <p className="mt-2.5 rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-[var(--ink-muted)]">
          Selected: {imageName}
        </p>
      ) : null}
    </section>
  );
}
