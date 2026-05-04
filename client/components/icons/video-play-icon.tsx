"use client";

import { useState } from "react";
import { IoMdPlayCircle } from "react-icons/io";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import VideoPreviewModal from "@/components/modals/video-preview-modal";
interface VideoPlayIconProps {
  isFree?: boolean;
  videoUrl: string | null;
  title?: string;
  className?: string;
}

const VideoPlayIcon = ({
  isFree,
  videoUrl,
  title,
  className,
}: VideoPlayIconProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (isFree && videoUrl) {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* ICON */}
      <div
        className="relative flex items-center justify-center cursor-pointer group"
        onClick={handleClick}
      >
        {/* Play / Lock */}
        {isFree ? (
          <IoMdPlayCircle
            className={cn(
              "w-20 h-20 text-rose-500 group-hover:scale-110 transition",
              className,
            )}
          />
        ) : (
          <Lock className="w-12 h-12 text-white bg-black/60 p-2 rounded-full" />
        )}

        {/* Ping Effect */}
        {isFree && (
          <span className="absolute w-20 h-20 rounded-full border-2 border-rose-500 animate-ping" />
        )}
      </div>

      {/* MODAL */}
      <VideoPreviewModal
        videoUrl={showModal ? videoUrl : null}
        title={title}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default VideoPlayIcon;
