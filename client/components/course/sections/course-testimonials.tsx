import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { Testimonial } from "@/types/testimonial";

export const CourseTestimonials = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 dark:border-white/10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Student Testimonials
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real stories and learning experiences from students of this course.
        </p>
      </div>

      {testimonials?.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              variant="compact"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center dark:border-white/10 dark:bg-[#0b1628]">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            No testimonials yet
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Testimonials for this course will be added soon.
          </p>
        </div>
      )}
    </section>
  );
};
