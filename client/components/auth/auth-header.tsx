"use client";

import Logo from "@/components/logo";

interface AuthHeaderProps {
  label: string;
}

export default function AuthHeader({ label }: AuthHeaderProps) {
  return (
    <div className="mb-2 flex flex-col items-center text-center">
      <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#0b1628]">
        <Logo />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
        Code With Kasa
      </p>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-3xl">
        {label}
      </h1>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        Continue securely to access your learning dashboard.
      </p>
    </div>
  );
}
