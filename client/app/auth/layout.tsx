import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 dark:bg-[#101b2d] dark:bg-none md:p-10">
      {/* LIGHT MODE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-100/80 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-sky-100/80 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* DARK MODE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        {children}
      </div>
    </div>
  );
}
