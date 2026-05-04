"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineRotateLeft } from "react-icons/md";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";

import { Course } from "@/types/course";
import VideoPlayIcon from "../icons/video-play-icon";
import CourseFeatureItem from "./course-feature-item";
import { AddToCartButton } from "../cart/add-to-cart-button";
import { getCourseMeta } from "@/helpers/course-meta";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart-store";
import { couponClientService } from "@/services/coupons/coupon.client";
import CoursePrice from "./course-price";

interface CourseSidebarcardProps {
  course: Course;
}

export const CourseSidebarCard = ({ course }: CourseSidebarcardProps) => {
  const applyAutoCoupon = useCartStore((s) => s.applyAutoCoupon);

  const [couponData, setCouponData] = useState<{
    code: string;
    discount: number;
    finalAmount: number;
  } | null>(null);

  const [meta, setMeta] = useState({
    totalLectures: 0,
    totalDuration: "0m",
  });

  useEffect(() => {
    const loadMeta = async () => {
      const data = await getCourseMeta(course);
      setMeta(data);
    };

    loadMeta();
  }, [course]);

  useEffect(() => {
    applyAutoCoupon();
  }, [applyAutoCoupon, course.id]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await couponClientService.autoApplyCoupon({
          cartTotal: Number(course.priceInr),
          courseIds: [course.id],
        });

        setCouponData(res.data || null);
      } catch {
        setCouponData(null);
      }
    };

    run();
  }, [course.id, course.priceInr]);

  const discount = couponData?.discount || 0;
  const finalAmount = couponData?.finalAmount || Number(course.priceInr);
  const couponCode = couponData?.code;

  const isEnrolled = course.isEnrolled;
  const percent = course.progress?.progress || 0;

  return (
    <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_28px_90px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_32px_100px_rgba(0,0,0,0.45)]">
      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
        <Image
          src={course.image?.path || "/placeholder.jpg"}
          alt={course.title || "Course Image"}
          width={950}
          height={600}
          className="aspect-video w-full object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/65 via-[#020617]/10 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <VideoPlayIcon
            videoUrl={course.video?.path || null}
            isFree={course.chapters?.[0]?.isFree}
            title={course.title}
          />
        </div>

        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
          <PlayCircle className="h-3.5 w-3.5" />
          Preview
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-4">
        {!isEnrolled ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
            <Clock className="h-3.5 w-3.5" />
            Few seats left
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Lifetime access unlocked
          </div>
        )}
      </div>

      {!isEnrolled && (
        <div className="mt-4">
          <CoursePrice
            course={course}
            discount={discount}
            finalAmount={finalAmount}
            couponCode={couponCode}
          />
        </div>
      )}

      {/* CTA SECTION */}
      <div className="mt-5 space-y-3">
        {!isEnrolled ? (
          <AddToCartButton course={course} />
        ) : (
          <>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
              <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Your Progress</span>
                <span>{percent}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all dark:bg-emerald-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <Link href={`/course/${course.slug}/learn`}>
              <Button className="h-12 w-full rounded-full bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300">
                {percent > 0 ? "Continue Learning" : "Start Learning"}
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* GUARANTEE */}
      <p className="mt-4 flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
        <MdOutlineRotateLeft className="mr-1 h-4 w-4 text-blue-700 dark:text-rose-200" />
        15 days money back guarantee
      </p>

      {/* FEATURES */}
      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
          This course includes
        </p>

        <div className="space-y-2">
          <CourseFeatureItem
            title="Duration"
            value={course.duration || "N/A"}
          />
          <CourseFeatureItem title="Lectures" value={meta.totalLectures} />
          <CourseFeatureItem
            title="Total Video Duration"
            value={meta.totalDuration}
          />
          <CourseFeatureItem
            title="Experience Level"
            value={course.experienceLevel || "No prior experience required"}
          />
          <CourseFeatureItem
            title="Language"
            value={course.language || "English - Hindi"}
          />
        </div>
      </div>
    </aside>
  );
};
