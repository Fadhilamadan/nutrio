"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

type FloatingCameraButtonProps = {
  onClick: () => void;
};

export function FloatingCameraButton({ onClick }: FloatingCameraButtonProps) {
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => setHasCamera(devices.some((d) => d.kind === "videoinput")))
      .catch(() => setHasCamera(false));
  }, []);

  if (!hasCamera) return null;

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
