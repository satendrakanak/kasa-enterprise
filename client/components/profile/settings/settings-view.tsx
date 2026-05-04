"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { User } from "@/types/user";
import { profileClientService } from "@/services/users/profile.client";
import { getErrorMessage } from "@/lib/error-handler";
import { SwitchRow } from "../switch-row";
import { Button } from "@/components/ui/button";
import { ChangePasswordForm } from "./change-password-form";

interface SettingsViewProps {
  user: User;
}

export default function SettingsView({ user }: SettingsViewProps) {
  const [isSaving, startSaving] = useTransition();

  const [data, setData] = useState({
    isPublic: user.profile?.isPublic ?? false,
    showCourses: user.profile?.showCourses ?? true,
    showCertificates: user.profile?.showCertificates ?? true,
  });

  const [dirty, setDirty] = useState(false);

  const isFaculty = useMemo(
    () => user.roles?.some((role) => role.name === "faculty") ?? false,
    [user.roles],
  );

  const handleProfileSave = () => {
    startSaving(async () => {
      try {
        await profileClientService.updateProfile({
          isPublic: data.isPublic,
          showCourses: data.showCourses,
          showCertificates: data.showCertificates,
        });

        setDirty(false);
        toast.success("Settings updated");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {/* PRIVACY */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
            <SectionHeader
              icon={ShieldCheck}
              eyebrow="Privacy Settings"
              title="Control how your profile appears"
              description="Decide what visitors and learners can see when they open your public profile surfaces."
            />

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
                <SwitchRow
                  label="Public Profile"
                  description="Allow your learner profile to be discoverable from public views."
                  checked={data.isPublic}
                  onChange={(value) => {
                    setDirty(true);
                    setData((current) => ({ ...current, isPublic: value }));
                  }}
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
                <SwitchRow
                  label="Show Courses"
                  description="Display your enrolled or taught courses on public profile areas."
                  checked={data.showCourses}
                  onChange={(value) => {
                    setDirty(true);
                    setData((current) => ({
                      ...current,
                      showCourses: value,
                    }));
                  }}
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
                <SwitchRow
                  label="Show Certificates"
                  description="Expose completed course certificates on your public-facing profile."
                  checked={data.showCertificates}
                  onChange={(value) => {
                    setDirty(true);
                    setData((current) => ({
                      ...current,
                      showCertificates: value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                Changes will only apply after saving your visibility settings.
              </p>

              <Button
                type="button"
                disabled={!dirty || isSaving}
                onClick={handleProfileSave}
                className="h-11 rounded-full bg-blue-600 px-6 font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Visibility
                  </>
                )}
              </Button>
            </div>
          </section>

          <ChangePasswordForm />
        </div>

        <div className="space-y-6">
          {/* SUMMARY */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
            <SectionHeader
              icon={UserRound}
              eyebrow="Account Summary"
              title="Current visibility state"
              description="A quick snapshot of what your profile currently exposes."
              compact
            />

            <div className="mt-5 space-y-3">
              <SummaryRow
                icon={data.isPublic ? Eye : EyeOff}
                label="Profile type"
                value={data.isPublic ? "Publicly visible" : "Private"}
                active={data.isPublic}
              />

              <SummaryRow
                icon={data.showCourses ? Eye : EyeOff}
                label="Courses section"
                value={data.showCourses ? "Visible to visitors" : "Hidden"}
                active={data.showCourses}
              />

              <SummaryRow
                icon={data.showCertificates ? Eye : EyeOff}
                label="Certificates section"
                value={data.showCertificates ? "Visible to visitors" : "Hidden"}
                active={data.showCertificates}
              />

              <SummaryRow
                icon={UserRound}
                label="Faculty access"
                value={
                  isFaculty ? "Faculty profile enabled" : "Learner profile"
                }
                active={isFaculty}
              />
            </div>
          </section>

          {/* SECURITY NOTES */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
            <SectionHeader
              icon={LockKeyhole}
              eyebrow="Security Notes"
              title="Keep your account protected"
              description="Small security habits make your account and certificates safer."
              compact
            />

            <ul className="mt-5 space-y-3">
              <SecurityNote>
                Use a strong password that you do not reuse elsewhere.
              </SecurityNote>

              <SecurityNote>
                Keep your contact email accurate so certificates and updates
                reach you.
              </SecurityNote>

              <SecurityNote>
                Review public profile visibility before sharing your dashboard
                publicly.
              </SecurityNote>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  compact = false,
}: {
  icon: typeof ShieldCheck;
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 border-b border-slate-100 dark:border-white/10 ${
        compact ? "pb-4" : "pb-5"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
          {eyebrow}
        </p>

        <h3
          className={`mt-2 font-semibold text-slate-950 dark:text-white ${
            compact ? "text-xl" : "text-2xl"
          }`}
        >
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  active,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
        active
          ? "border-blue-100 bg-blue-50/80 dark:border-rose-200/20 dark:bg-rose-200/10"
          : "border-slate-100 bg-slate-50/80 dark:border-white/10 dark:bg-[#0b1628]"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${
          active
            ? "bg-white text-blue-700 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10"
            : "bg-white text-slate-500 ring-slate-100 dark:bg-white/10 dark:text-slate-400 dark:ring-white/10"
        }`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold leading-none text-slate-950 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function SecurityNote({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-300">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-rose-200" />
      <span>{children}</span>
    </li>
  );
}
