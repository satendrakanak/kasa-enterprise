"use client";

interface CourseFeatureItemProps {
  title: string;
  value?: string | number | null;
}

const CourseFeatureItem = ({ title, value }: CourseFeatureItemProps) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 py-3 last:border-b-0 dark:border-white/10">
      <span className="shrink-0 text-sm font-semibold text-slate-600 dark:text-slate-400">
        {title}
      </span>

      <span className="text-right text-sm font-semibold leading-6 text-slate-950 dark:text-white">
        {value || "N/A"}
      </span>
    </div>
  );
};

export default CourseFeatureItem;
