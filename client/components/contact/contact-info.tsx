"use client";

import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { useSiteSettings } from "@/context/site-settings-context";
import Link from "next/link";

export function ContactInfo() {
  const { site } = useSiteSettings();

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-5">
        <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
            Get in touch
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-2xl">
            Let&apos;s help with the right next step.
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Reach out for course guidance, support, admissions help, or faculty
            questions. We usually respond within one working day.
          </p>
        </div>

        <div className="grid gap-2.5">
          <InfoRow
            icon={Mail}
            label="Email"
            value={site.supportEmail || "info@academy.com"}
          />

          <InfoRow
            icon={Phone}
            label="Phone"
            value={site.supportPhone || "+91-9809-XXXXXX"}
          />

          <InfoRow
            icon={MapPin}
            label="Address"
            value={site.supportAddress || "India"}
          />

          <InfoRow
            icon={Clock3}
            label="Support hours"
            value="Monday to Saturday, 10:00 AM to 6:00 PM"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-5">
        <h4 className="text-base font-semibold text-slate-950 dark:text-white">
          Prefer exploring first?
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Browse the latest programs, testimonials, and faculty stories before
          talking to the team.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/courses"
            className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
          >
            Explore Courses
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/client-testimonials"
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
          >
            View Testimonials
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-blue-100 hover:bg-blue-50/60 dark:border-white/10 dark:bg-[#0b1628] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.055]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-white/10 dark:text-rose-200 dark:ring-white/10 dark:group-hover:bg-rose-200 dark:group-hover:text-black">
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm leading-5 text-slate-600 dark:text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}
