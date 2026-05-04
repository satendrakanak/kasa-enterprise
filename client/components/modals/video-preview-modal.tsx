"use client";

import { createPortal } from "react-dom";
import { X, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface VideoPreviewModalProps {
  videoUrl: string | null;
  title?: string;
  onClose: () => void;
}

export default function VideoPreviewModal({
  videoUrl,
  title,
  onClose,
}: VideoPreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!videoUrl) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoUrl, onClose]);

  if (!mounted || !videoUrl) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-99999 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_35px_120px_rgba(0,0,0,0.45)] dark:border-white/10 dark:bg-[#07111f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-[#101b2d]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-rose-200/10 dark:text-rose-200">
              <PlayCircle className="h-4 w-4" />
            </span>

            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {title || "Video Preview"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close video preview"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-rose-200 dark:hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* VIDEO */}
        <div className="bg-black">
          <video
            src={videoUrl}
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            autoPlay
            className="h-auto max-h-[72vh] w-full"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
