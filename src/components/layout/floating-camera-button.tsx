"use client";

import { Camera } from "lucide-react";

type FloatingCameraButtonProps = {
  onClick: () => void;
};

export function FloatingCameraButton({ onClick }: FloatingCameraButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-5 z-40 grid size-16 place-items-center rounded-full bg-[var(--primary)] text-white shadow-[var(--primary-shadow)] transition active:scale-95"
      aria-label="Analyze food"
    >
      <Camera className="size-7" />
    </button>
  );
}
