import Link from "next/link";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types/testimonial";
import { TestimonialCard } from "./testimonial-card";

export const FeaturedTestimonialsSection = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => {
  if (!testimonials.length) return null;

  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-[#101b2d]">
      {/* Light mode premium soft background */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#eef6ff] to-white" />

        <div className="absolute -left-40 top-8 h-[420px] w-[420px] rounded-full bg-sky-200/45 blur-[120px]" />

        <div className="absolute right-[-160px] top-28 h-[420px] w-[420px] rounded-full bg-blue-200/45 blur-[120px]" />

        <div className="absolute bottom-[-160px] left-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-100/70 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.055)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Dark mode glossy background */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="dark-section-shine absolute inset-0 opacity-35" />
      </div>

      <Container>
        <div className="relative z-10">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-700 shadow-sm backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
                Client Testimonials
              </span>

              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Real transformations, not generic praise.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                Explore a mix of written stories and video experiences from
                learners who trusted Unitus with their growth.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-blue-200 bg-white/80 px-6 font-semibold text-blue-700 shadow-sm backdrop-blur-md transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
            >
              <Link href="/client-testimonials">View All Testimonials</Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
