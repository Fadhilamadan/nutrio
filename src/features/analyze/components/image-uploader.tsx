"use client";

import { Camera, ImagePlus, ShieldCheck } from "lucide-react";

type ImageUploaderProps = {
  imageName: string;
  onSelectImage: (file: File | null) => void;
};

export function ImageUploader({ imageName, onSelectImage }: ImageUploaderProps) {
  return (
    <section className="rounded-xl border border-dashed border-[var(--ink-faint)] bg-[var(--surface)] p-5 text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))] text-[var(--primary)] shadow-[var(--shadow-soft)]">
        <Camera className="size-9" />
      </div>
      <h2 className="mt-4 text-xl font-bold tracking-[-0.025em] text-[var(--ink)]">Snap or upload food</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[var(--ink-muted)]">
        Images are sent for AI analysis only and discarded after nutrition metadata is extracted.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-white transition active:scale-[0.98]">
          <Camera className="size-4" />
          Camera
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => onSelectImage(event.target.files?.[0] ?? null)}
          />
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
        <p className="mt-4 rounded-full bg-[var(--surface-soft)] px-3 py-2 text-xs text-[var(--ink-muted)]">
          Selected: {imageName}
        </p>
      ) : null}
      <p className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--primary)]">
        <ShieldCheck className="size-4" />
        No permanent image storage
      </p>
    </section>
  );
}
