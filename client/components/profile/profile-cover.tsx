"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/error-handler";
import { userClientService } from "@/services/users/user.client";

interface ProfileCoverProps {
  coverImage?: string;
  isOwner?: boolean;
}

export function ProfileCover({ coverImage, isOwner }: ProfileCoverProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(coverImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);

    try {
      setIsUploading(true);
      setPreview(previewUrl);

      const initRes = await fetch("/api/uploads/init", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await initRes.json();
      const { uploadId, url } = json.data;

      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
      });

      const confirmRes = await fetch(`/api/uploads/confirm/${uploadId}`, {
        method: "POST",
        credentials: "include",
      });

      const confirmJson = await confirmRes.json();
      const newFile = confirmJson.data;

      await userClientService.updateUser({
        coverImageId: newFile.id,
      });

      toast.success("Cover picture updated");
    } catch (error: unknown) {
      setPreview(coverImage);
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-[34px] border border-slate-200 bg-slate-100 shadow-[0_30px_90px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_30px_90px_rgba(0,0,0,0.38)] md:h-[290px]">
      <Image
        src={preview || "/assets/default-cover.jpg"}
        alt="Profile cover"
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-slate-950/14 to-blue-600/30 dark:from-slate-950/68 dark:via-[#07111f]/35 dark:to-rose-950/22" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25 dark:opacity-15" />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/72 via-slate-950/24 to-transparent p-5 md:p-7">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-xl text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-100/85 dark:text-rose-200">
              Learner Space
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Your learning dashboard
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/78 md:text-base">
              Track progress, revisit purchases, and keep your profile polished
              from one clean workspace.
            </p>
          </div>
        </div>
      </div>

      {isOwner && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          title="Change Cover"
          className="absolute right-4 top-4 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-slate-950/45 text-white shadow-lg backdrop-blur-md transition hover:bg-white hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-rose-200 dark:hover:text-black"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleUpload(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
