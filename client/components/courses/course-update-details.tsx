"use client";

import { BookA, CalendarDays } from "lucide-react";
import { PiCertificateDuotone } from "react-icons/pi";

interface CourseUpdateDetailsProps {
  lastUpdateDate: string;
  language: string;
  certificate: string;
}

const CourseUpdateDetails = ({
  lastUpdateDate,
  language,
  certificate,
}: CourseUpdateDetailsProps) => {
  const items = [
    {
      icon: CalendarDays,
      label: `Last updated on ${lastUpdateDate}`,
    },
    {
      icon: BookA,
      label: language,
    },
    {
      icon: PiCertificateDuotone,
      label: certificate,
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm lg:justify-start">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-white/82 backdrop-blur-md dark:bg-white/5 dark:text-slate-200"
          >
            <Icon className="h-4 w-4 shrink-0 text-sky-100 dark:text-rose-200" />
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CourseUpdateDetails;
