"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { User } from "@/types/user";

interface FacultyCardInnerProps {
  faculty: User;
}

export function FacultyCardInner({ faculty }: FacultyCardInnerProps) {
  const name = `${faculty.firstName} ${faculty.lastName || ""}`.trim();
  const designation = faculty.facultyProfile?.designation || "Faculty Mentor";

  const socials = [
    {
      href: faculty.profile?.linkedin,
      icon: FaLinkedinIn,
      label: "LinkedIn",
    },
    {
      href: faculty.profile?.instagram,
      icon: FaInstagram,
      label: "Instagram",
    },
    {
      href: faculty.profile?.facebook,
      icon: FaFacebookF,
      label: "Facebook",
    },
    {
      href: faculty.profile?.twitter,
      icon: FaXTwitter,
      label: "Twitter",
    },
    {
      href: faculty.profile?.youtube,
      icon: FaYoutube,
      label: "YouTube",
    },
  ].filter((item) => Boolean(item.href));

  return (
    <Link
      href={`/our-faculty/${faculty.id}`}
      className="group relative block h-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_30px_90px_rgba(37,99,235,0.16)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.38)] dark:hover:border-rose-200/25 dark:hover:shadow-[0_32px_90px_rgba(244,63,94,0.16)]"
    >
      {/* soft hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_64%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(251,113,133,0.13),transparent_64%)]" />
      </div>

      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden rounded-[22px] border border-slate-100 bg-slate-100 dark:border-white/10 dark:bg-white/5">
        <Image
          src={faculty.avatar?.path || "/assets/default.png"}
          alt={name || "Faculty"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-[#020617]/10 to-transparent opacity-70 transition group-hover:opacity-85" />

        <div className="absolute left-3 top-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <span className="line-clamp-1 inline-flex max-w-full rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {designation}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-2 pb-2 pt-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-950 dark:text-white">
          {name || "Faculty"}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm font-semibold text-blue-700 dark:text-rose-200">
          {designation}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          {socials.length > 0 ? (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <span
                    key={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-rose-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
                    title={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              View mentor profile
            </span>
          )}

          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-rose-200 dark:group-hover:border-rose-200 dark:group-hover:bg-rose-200 dark:group-hover:text-black">
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
