"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { Course } from "@/types/course";
import { CouponMap } from "@/types/coupon";
import { couponClientService } from "@/services/coupons/coupon.client";
import { CourseCard } from "../courses/course-card";

interface RelatedCoursesProps {
  courses: Course[];
}

export const RelatedCourses = ({ courses }: RelatedCoursesProps) => {
  const [couponMap, setCouponMap] = useState<CouponMap>({});

  useEffect(() => {
    if (!courses?.length) return;

    const run = async () => {
      try {
        const res = await couponClientService.autoApplyBulk({
          courses: courses.map((course) => ({
            id: course.id,
            price: Number(course.priceInr),
          })),
        });

        setCouponMap(res.data?.data || {});
      } catch {
        setCouponMap({});
      }
    };

    run();
  }, [courses]);

  if (!courses?.length) return null;

  return (
    <section className="py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
              Keep Learning
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white lg:text-3xl">
              Related Courses
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Explore more courses similar to this one.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm font-semibold text-blue-700 dark:text-rose-200 md:flex">
            Swipe to explore
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* SLIDER */}
        <div className="related-courses-slider">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1.08, spaceBetween: 14 },
              640: { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
          >
            {courses.map((course, index) => (
              <SwiperSlide key={course.id || index} className="h-auto">
                <div className="h-full pb-2">
                  <CourseCard
                    course={course}
                    coupon={couponMap[course.id] || null}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
