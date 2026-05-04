"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCards } from "swiper/modules";
import Image from "next/image";
import { Course } from "@/types/course";
import { CouponMap } from "@/types/coupon";
import { useEffect, useState } from "react";
import { couponClientService } from "@/services/coupons/coupon.client";
import Link from "next/link";

interface HeroProps {
  courses: Course[];
}

export default function Hero({ courses }: HeroProps) {
  const [couponMap, setCouponMap] = useState<CouponMap>({});

  useEffect(() => {
    if (!courses?.length) return;

    const run = async () => {
      try {
        const res = await couponClientService.autoApplyBulk({
          courses: courses.map((c) => ({
            id: c.id,
            price: Number(c.priceInr),
          })),
        });

        setCouponMap(res.data?.data || {});
      } catch {
        setCouponMap({});
      }
    };

    run();
  }, [courses]);

  return (
    <section className="academy-hero relative overflow-hidden bg-[#020617] text-white">
      {/* ANIMATED PREMIUM BACKGROUND */}
      <div className="absolute inset-0 academy-hero-animated-bg-light dark:academy-hero-animated-bg-dark" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)] dark:bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.28),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(99,102,241,0.25),transparent_34%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.16),transparent_38%)]" />

      {/* Moving glow blobs */}
      <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
      <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
      <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

      {/* Glossy shine */}
      <div className="academy-hero-shine absolute inset-0 opacity-45" />

      {/* Grid */}
      <div className="academy-hero-grid absolute inset-0 opacity-20" />

      {/* Soft dark overlay for readability */}
      <div className="absolute inset-0 bg-linear-to-r from-[#020617]/85 via-[#020617]/35 to-[#020617]/60" />

      <div className="relative z-10 mx-auto flex min-h-190 max-w-360 flex-col px-6 pt-12 lg:min-h-162.5 lg:flex-row lg:items-center lg:px-12 lg:py-20 xl:px-16">
        {/* LEFT CONTENT */}
        <div className="z-20 max-w-130 text-center lg:text-left">
          <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-medium text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_10px_30px_rgba(15,23,42,0.28)] backdrop-blur-md">
            🏆 The Leader in Online Learning
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl">
            Learn with clarity, apply with confidence, grow for the long term.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/78 lg:mx-0 lg:text-lg">
            Learn practical skills with expert-led courses designed to help you
            grow, build confidence, and advance your career.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link
              href="/courses"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-7 text-sm font-semibold text-black shadow-[0_15px_45px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(56,189,248,0.42)] dark:bg-rose-200! dark:text-black dark:hover:bg-rose-300!"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/60 to-transparent transition duration-700 group-hover:translate-x-full" />
              <span className="relative z-10">View Courses →</span>
            </Link>

            <Link
              href="/contact"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_15px_45px_rgba(15,23,42,0.28)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full" />
              <span className="relative z-10">Speak to our team</span>
            </Link>
          </div>
        </div>

        {/* GIRL */}
        <div className="absolute bottom-0 left-[50%] hidden -translate-x-1/2 lg:block">
          <div className="relative h-155 w-130 drop-shadow-[0_35px_70px_rgba(0,0,0,0.45)]">
            <Image
              src="/assets/courses/banner-01.webp"
              alt="hero"
              fill
              priority
              className="object-contain object-bottom"
            />
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="absolute right-10 top-1/2 z-20 hidden w-105 -translate-y-1/2 lg:block">
          <Swiper
            modules={[Pagination, EffectCards, Autoplay]}
            effect="cards"
            loop
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
          >
            {courses.map((course, index) => {
              const coupon = couponMap[course.id];
              const discount = coupon?.discount ?? 0;
              const finalPrice = coupon?.finalAmount ?? Number(course.priceInr);

              return (
                <SwiperSlide key={index}>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_35px_90px_rgba(2,6,23,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_35px_90px_rgba(0,0,0,0.75)]">
                    <div className="relative overflow-hidden rounded-2xl">
                      <Image
                        alt={course.title}
                        src={course.image?.path || "/placeholder.jpg"}
                        className="h-50 w-full object-cover"
                        width={950}
                        height={600}
                      />

                      {discount > 0 && (
                        <span className="absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold bg-primary text-white shadow-lg dark:bg-linear-to-r dark:from-rose-300 dark:to-rose-400 dark:text-black dark:shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                          -
                          {Math.round(
                            (discount / Number(course.priceInr)) * 100,
                          )}
                          %
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-1 flex-col">
                      <h3 className="mb-2 text-lg font-semibold text-slate-950 dark:text-white">
                        {course.title}
                      </h3>

                      <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                        {course.shortDescription}
                      </p>

                      <div className="mb-3 text-sm text-yellow-500">
                        ⭐⭐⭐⭐⭐{" "}
                        <span className="text-slate-400 dark:text-slate-500">
                          (15)
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-primary dark:text-rose-400">
                            ₹{new Intl.NumberFormat("en-IN").format(finalPrice)}
                          </p>

                          {discount > 0 && (
                            <span className="text-sm text-slate-400 line-through dark:text-slate-500">
                              ₹
                              {new Intl.NumberFormat("en-IN").format(
                                Number(course.priceInr),
                              )}
                            </span>
                          )}
                        </div>

                        <Link href={`/course/${course.slug}`}>
                          <span className="text-sm font-medium text-primary dark:text-rose-400">
                            Learn More →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* MOBILE */}
        <div className="relative mt-8 flex w-full flex-col items-center pb-0 lg:hidden">
          <div className="relative z-40 w-full max-w-85">
            <Swiper
              modules={[Pagination, Autoplay]}
              loop={courses.length > 1}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              className="pb-8"
            >
              {courses.map((course, index) => {
                const coupon = couponMap[course.id];
                const discount = coupon?.discount ?? 0;
                const finalPrice =
                  coupon?.finalAmount ?? Number(course.priceInr);

                return (
                  <SwiperSlide key={index}>
                    <div className="rounded-2xl border border-white/25 bg-white/95 p-3 text-left shadow-[0_25px_70px_rgba(2,6,23,0.48)] backdrop-blur-xl">
                      <div className="relative overflow-hidden rounded-xl">
                        <Image
                          alt={course.title}
                          src={course.image?.path || "/placeholder.jpg"}
                          className="h-36 w-full object-cover"
                          width={950}
                          height={600}
                        />

                        {discount > 0 && (
                          <span className="absolute right-2 top-2 rounded-full bg-purple-600 px-2 py-1 text-[10px] text-white">
                            -
                            {Math.round(
                              (discount / Number(course.priceInr)) * 100,
                            )}
                            %
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <h3 className="line-clamp-2 text-sm font-semibold text-black">
                          {course.title}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {course.shortDescription}
                        </p>

                        <div className="mt-2 text-xs text-yellow-500">
                          ⭐⭐⭐⭐⭐ <span className="text-gray-400">(15)</span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-primary">
                              ₹
                              {new Intl.NumberFormat("en-IN").format(
                                finalPrice,
                              )}
                            </p>

                            {discount > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹
                                {new Intl.NumberFormat("en-IN").format(
                                  Number(course.priceInr),
                                )}
                              </span>
                            )}
                          </div>

                          <Link href={`/course/${course.slug}`}>
                            <span className="whitespace-nowrap text-xs text-primary">
                              Learn →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <div className="relative z-20 mt-2 h-82.5 w-full drop-shadow-[0_30px_55px_rgba(0,0,0,0.42)]">
            <Image
              src="/assets/courses/banner-01.webp"
              alt="hero"
              fill
              priority
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>

      {/* WAVE */}
      {/* <div className="absolute bottom-[-1px] left-0 z-40 hidden w-full lg:block">
        <svg
          viewBox="0 0 1440 120"
          className="block h-20 w-full"
          preserveAspectRatio="none"
        >
          <path
            className="fill-[#101b2d]"
            d="M0,64L60,69.3C120,75,240,85,360,85.3C480,85,600,75,720,64C840,53,960,43,1080,42.7C1200,43,1320,53,1380,58.7L1440,64V120H0Z"
          />
        </svg>
      </div> */}
    </section>
  );
}
