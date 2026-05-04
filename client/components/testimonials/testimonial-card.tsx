"use client";

import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Quote } from "lucide-react";
import { useState } from "react";

import VideoPreviewModal from "@/components/modals/video-preview-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types/testimonial";
import { TestimonialRating } from "./testimonial-rating";

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: "featured" | "compact";
}

export const TestimonialCard = ({
  testimonial,
  variant = "featured",
}: TestimonialCardProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const isVideo = testimonial.type === "VIDEO";
  const primaryCourse = testimonial.courses?.[0] || null;

  return (
    <>
      <article
        className={`group relative flex overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_65px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_30px_90px_rgba(37,99,235,0.16)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_28px_80px_rgba(0,0,0,0.36)] dark:hover:border-rose-200/25 dark:hover:shadow-[0_34px_100px_rgba(244,63,94,0.16)] ${
          variant === "featured" ? "h-full" : ""
        }`}
      >
        <div className="flex w-full flex-col">
          {/* TOP BAR - stable, no absolute issue */}
          <div className="mx-7 h-[3px] rounded-b-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 dark:from-rose-200 dark:via-rose-300 dark:to-pink-300" />

          <div className="relative flex h-full flex-col p-6 pt-7 md:p-7 md:pt-8">
            {/* soft background glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(251,113,133,0.14),transparent_65%)]" />
            </div>

            {/* HEADER */}
            <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                {/* AVATAR - proper circle */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.12)] ring-4 ring-blue-50 dark:border-[#07111f] dark:bg-white/10 dark:ring-white/10">
                  <Image
                    src={testimonial.avatar?.path || "/assets/default.png"}
                    alt={testimonial.avatarAlt || testimonial.name}
                    fill
                    sizes="56px"
                    className="rounded-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-slate-950 dark:text-white">
                    {testimonial.name}
                  </h3>

                  <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                    {[testimonial.designation, testimonial.company]
                      .filter(Boolean)
                      .join(" at ") || "Verified learner"}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="shrink-0 rounded-full border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-white/10 dark:bg-white/10 dark:text-rose-200"
              >
                {isVideo ? "Video" : "Review"}
              </Badge>
            </div>

            {/* RATING + COURSE */}
            <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
              <TestimonialRating rating={testimonial.rating} />

              {primaryCourse && (
                <Link
                  href={`/course/${primaryCourse.slug}`}
                  className="line-clamp-1 text-right text-xs font-semibold text-blue-700 underline-offset-4 hover:underline dark:text-rose-200"
                >
                  {primaryCourse.title}
                </Link>
              )}
            </div>

            {/* CONTENT */}
            {isVideo ? (
              <div className="relative z-10 mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-inner dark:border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.30),transparent_34%),linear-gradient(135deg,#020617_0%,#0f2a55_48%,#020617_100%)]" />

                <div className="relative flex aspect-video flex-col justify-between p-5 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                      <Quote className="h-5 w-5 text-sky-100 dark:text-rose-200" />
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                      Student Voice
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="max-w-xs text-sm leading-6 text-white/80">
                      Hear {testimonial.name}&apos;s experience in their own
                      words.
                    </p>

                    <Button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="h-11 rounded-full bg-white px-5 font-semibold text-blue-950 shadow-sm transition hover:bg-sky-50 dark:bg-rose-200! dark:text-black dark:hover:bg-rose-300"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Watch Story
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 mb-5 flex-1 overflow-hidden rounded-3xl border border-blue-50 bg-gradient-to-b from-white to-blue-50/70 p-5 dark:border-white/10 dark:bg-none dark:bg-[#101b2d]">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/70 blur-3xl dark:bg-rose-300/10" />

                <Quote className="relative mb-4 h-8 w-8 text-blue-600/55 dark:text-rose-200/70" />

                <p className="relative text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                  {testimonial.message}
                </p>
              </div>
            )}

            {/* FOOTER */}
            <div className="relative z-10 mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
              <span>
                {new Date(testimonial.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>

              <span className="rounded-full bg-slate-50 px-3 py-1 font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {isVideo ? "Video testimonial" : "Text testimonial"}
              </span>
            </div>
          </div>
        </div>
      </article>

      <VideoPreviewModal
        videoUrl={previewOpen ? testimonial.video?.path || null : null}
        title={`${testimonial.name} testimonial`}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};
