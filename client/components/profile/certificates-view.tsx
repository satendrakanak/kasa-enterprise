"use client";

import Link from "next/link";
import { Award, Download, ExternalLink } from "lucide-react";

import { Certificate } from "@/types/certificate";
import { slugify } from "@/utils/slugify";
import { downloadRemoteFile } from "@/lib/download-file";
import { Button } from "@/components/ui/button";

interface CertificatesViewProps {
  certificates: Certificate[];
}

export function CertificatesView({ certificates }: CertificatesViewProps) {
  const handleDownload = async (certificate: Certificate) => {
    if (!certificate.file?.path) return;

    const learner = slugify(
      `${certificate.user?.firstName || ""} ${
        certificate.user?.lastName || ""
      }`.trim() || "learner",
    );

    const course = slugify(certificate.course?.title || "course");

    await downloadRemoteFile(certificate.file.path, `${learner}-${course}.pdf`);
  };

  if (!certificates.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <Award className="h-10 w-10" />
        </div>

        <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
          No certificates yet
        </h3>

        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
          Complete a course and your certificate will appear here automatically.
        </p>

        <Link
          href="/courses"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
        >
          Explore Courses
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
              Achievement Vault
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              Certificates
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Download your earned certificates anytime from your learning
              profile.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
            <Award className="h-4 w-4" />
            {certificates.length}{" "}
            {certificates.length > 1 ? "certificates" : "certificate"}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {certificates.map((certificate) => (
          <article
            key={certificate.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_28px_80px_rgba(37,99,235,0.12)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] dark:hover:border-rose-200/25 dark:hover:shadow-[0_30px_90px_rgba(244,63,94,0.12)]"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white dark:from-[#0b1628] dark:via-[#111f35] dark:to-[#07111f]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_90%_30%,rgba(255,255,255,0.14),transparent_34%)] dark:bg-[radial-gradient(circle_at_15%_10%,rgba(251,207,232,0.16),transparent_30%),radial-gradient(circle_at_90%_30%,rgba(56,189,248,0.10),transparent_34%)]" />

              <div className="relative z-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md dark:text-rose-200">
                  <Award className="h-6 w-6" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75 dark:text-rose-200">
                  Certificate
                </p>

                <h3 className="mt-3 line-clamp-2 text-2xl font-semibold leading-tight">
                  {certificate.course.title}
                </h3>
              </div>
            </div>

            <div className="space-y-5 p-5 md:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBox
                  label="Certificate ID"
                  value={certificate.certificateNumber}
                />

                <InfoBox
                  label="Issued On"
                  value={new Date(certificate.issuedAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                />
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-300">
                Your certificate is stored safely and can be downloaded anytime
                from this page.
              </div>

              <div className="flex flex-wrap gap-3">
                {certificate.file?.path ? (
                  <Button
                    type="button"
                    onClick={() => handleDownload(certificate)}
                    className="h-10 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.18)] transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                ) : null}

                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className="h-10 rounded-full border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
                >
                  <Link href={`/course/${certificate.course.slug}`}>
                    <ExternalLink className="h-4 w-4" />
                    View Course
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-[#0b1628]">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}
