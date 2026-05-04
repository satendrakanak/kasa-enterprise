import { Course } from "@/types/course";

interface CoursePriceProps {
  course: Course;
  discount: number | null;
  finalAmount: number | null;
  couponCode?: string;
}

export default function CoursePrice({
  course,
  discount,
  finalAmount,
  couponCode,
}: CoursePriceProps) {
  const hasDiscount = Boolean(discount && discount > 0);

  const formatPrice = (value: number | string | null | undefined) =>
    new Intl.NumberFormat("en-IN").format(Number(value || 0));

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
        Course Price
      </p>

      {hasDiscount ? (
        <>
          <div className="flex flex-wrap items-end gap-2">
            <span className="text-3xl font-bold leading-none text-slate-950 dark:text-white">
              ₹{formatPrice(finalAmount)}
            </span>

            <span className="text-base font-semibold text-slate-400 line-through dark:text-slate-500">
              ₹{formatPrice(course.priceInr)}
            </span>
          </div>

          <div className="mt-3 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300">
            🎉 {couponCode || "Coupon"} applied
          </div>
        </>
      ) : (
        <span className="text-3xl font-bold leading-none text-slate-950 dark:text-white">
          ₹{formatPrice(course.priceInr)}
        </span>
      )}
    </div>
  );
}
