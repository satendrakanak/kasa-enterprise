import Image from "next/image";

interface FormImageProps {
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
}

export default function FormImage({
  imageUrl,
  alt,
  width,
  height,
}: FormImageProps) {
  return (
    <div className="relative hidden min-h-[560px] overflow-hidden bg-slate-100 md:block dark:bg-[#0b1628]">
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-blue-700/35 dark:hidden" />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 hidden bg-gradient-to-br from-slate-950/82 via-slate-950/55 to-rose-950/35 dark:block" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:52px_52px] opacity-25 dark:opacity-10" />

      <div className="absolute inset-x-0 bottom-0 p-8">
        <div className="rounded-3xl border border-white/20 bg-white/14 p-5 text-white shadow-[0_20px_60px_rgba(2,6,23,0.25)] backdrop-blur-md dark:bg-white/8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75 dark:text-rose-200">
            Secure Learning
          </p>

          <h2 className="mt-2 text-2xl font-semibold leading-tight">
            Start where your progress continues.
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/75">
            Access courses, certificates, exams, and your academy dashboard from
            one protected account.
          </p>
        </div>
      </div>
    </div>
  );
}
