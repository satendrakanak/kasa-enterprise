"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Database,
  KeyRound,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CompleteInstallationPayload,
  InstallationProgress,
  InstallerStatus,
  installerClientService,
} from "@/services/installer/installer.client";

const steps = [
  { key: "system", label: "System check", icon: Database },
  { key: "academy", label: "Academy details", icon: Sparkles },
  { key: "license", label: "Activation", icon: KeyRound },
  { key: "admin", label: "Admin account", icon: UserRoundCog },
] as const;

type StepKey = (typeof steps)[number]["key"];

const initialForm: CompleteInstallationPayload = {
  siteName: "Kasa Enterprise",
  siteTagline: "Practical courses, live classes, and certificates in one platform.",
  supportEmail: "support@kasaenterprise.com",
  supportPhone: "",
  licenseKey: "",
  adminFirstName: "",
  adminLastName: "",
  adminEmail: "",
  adminPassword: "",
  importDemoData: true,
};

export function InstallationWizard() {
  const router = useRouter();
  const [status, setStatus] = useState<InstallerStatus | null>(null);
  const [activeStep, setActiveStep] = useState<StepKey>("system");
  const [form, setForm] = useState<CompleteInstallationPayload>(initialForm);
  const [licenseFingerprint, setLicenseFingerprint] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [installationJobId, setInstallationJobId] = useState<string | null>(null);
  const [installationProgress, setInstallationProgress] =
    useState<InstallationProgress | null>(null);

  useEffect(() => {
    installerClientService
      .getStatus()
      .then(setStatus)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const activeIndex = useMemo(
    () => steps.findIndex((step) => step.key === activeStep),
    [activeStep],
  );

  const updateForm = <K extends keyof CompleteInstallationPayload>(
    key: K,
    value: CompleteInstallationPayload[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const goNext = () => {
    const nextStep = steps[activeIndex + 1];
    if (nextStep) setActiveStep(nextStep.key);
  };

  const validateLicense = async () => {
    setValidating(true);
    try {
      const result = await installerClientService.validateLicense(
        form.licenseKey,
      );
      setLicenseFingerprint(result.fingerprint);
      toast.success("License activated");
      setActiveStep("admin");
    } catch (error) {
      setLicenseFingerprint(null);
      toast.error(error instanceof Error ? error.message : "Invalid license key");
    } finally {
      setValidating(false);
    }
  };

  const completeInstallation = async () => {
    setSubmitting(true);
    try {
      const result = await installerClientService.start(form);
      setInstallationJobId(result.jobId);
      setInstallationProgress({
        id: result.jobId,
        status: "queued",
        progress: 1,
        label: "Installation queued...",
        error: null,
        redirectTo: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Installation could not finish",
      );
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!installationJobId) return;

    const interval = window.setInterval(async () => {
      try {
        const progress =
          await installerClientService.getProgress(installationJobId);
        setInstallationProgress(progress);

        if (progress.status === "completed") {
          window.clearInterval(interval);
          toast.success("Installation completed");
          router.push(progress.redirectTo || "/auth/sign-in");
        }

        if (progress.status === "failed") {
          window.clearInterval(interval);
          toast.error(progress.error || "Installation could not finish");
          setSubmitting(false);
        }
      } catch (error) {
        window.clearInterval(interval);
        toast.error(
          error instanceof Error ? error.message : "Could not read progress",
        );
        setSubmitting(false);
      }
    }, 850);

    return () => window.clearInterval(interval);
  }, [installationJobId, router]);

  const normalizedProgress = Math.max(
    0,
    Math.min(100, installationProgress?.progress || 0),
  );

  if (installationProgress) {
    return (
      <InstallShell>
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
          <div className="w-full overflow-hidden rounded-[2rem] border bg-card shadow-sm">
            <div className="border-b bg-primary/5 p-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {installationProgress.status === "completed" ? (
                  <CheckCircle2 className="size-8" />
                ) : (
                  <Loader2 className="size-8 animate-spin" />
                )}
              </div>
              <h1 className="mt-6 text-3xl font-semibold">
                Installing Kasa Enterprise
              </h1>
              <p className="mt-2 text-muted-foreground">
                Keep this page open while the platform prepares your database,
                demo content, and admin workspace.
              </p>
            </div>
            <div className="p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Current step
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {installationProgress.label}
                  </p>
                </div>
                <p className="text-4xl font-semibold text-primary">
                  {normalizedProgress}%
                </p>
              </div>
              <div className="mt-6 h-5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${normalizedProgress}%` }}
                />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <ProgressTile
                  label="Status"
                  value={installationProgress.status}
                />
                <ProgressTile
                  label="Job"
                  value={installationProgress.id.slice(0, 8).toUpperCase()}
                />
                <ProgressTile
                  label="Updated"
                  value={new Date(installationProgress.updatedAt).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                />
              </div>
              {installationProgress.status === "failed" ? (
                <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  {installationProgress.error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </InstallShell>
    );
  }

  if (loading) {
    return (
      <InstallShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Checking installation status...
            </p>
          </div>
        </div>
      </InstallShell>
    );
  }

  if (status?.isInstalled) {
    return (
      <InstallShell>
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center">
          <div className="w-full rounded-[2rem] border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-8" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold">
              Installation is complete
            </h1>
            <p className="mt-3 text-muted-foreground">
              This academy is already configured. Continue to the admin login to
              manage the platform.
            </p>
            <Button className="mt-6" onClick={() => router.push("/auth/sign-in")}>
              Go to login
            </Button>
          </div>
        </div>
      </InstallShell>
    );
  }

  return (
    <InstallShell>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[2rem] border bg-card p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            <ShieldCheck className="size-4" />
            Secure installer
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">
            Set up your academy workspace.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Connect the running database, activate the license, create the first
            admin, and optionally import marketplace-ready demo data.
          </p>

          <div className="mt-8 space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.key === activeStep;
              const isDone = index < activeIndex;

              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => index <= activeIndex && setActiveStep(step.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isDone
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "bg-background"
                  }`}
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-background/80 text-foreground">
                    {isDone ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {step.label}
                    </span>
                    <span className="text-xs opacity-75">Step {index + 1}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="rounded-[2rem] border bg-card p-6 shadow-sm">
          {activeStep === "system" ? (
            <section>
              <SectionTitle
                icon={Database}
                title="System check"
                description="The installer uses the database connection already configured in Docker or your server environment."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoTile label="Database" value={status?.database.name || "-"} />
                <InfoTile label="Host" value={status?.database.host || "-"} />
                <InfoTile
                  label="Port"
                  value={String(status?.database.port || "-")}
                />
                <InfoTile
                  label="Connection"
                  value={status?.database.connected ? "Connected" : "Not ready"}
                  tone={status?.database.connected ? "success" : "danger"}
                />
              </div>
              <div className="mt-6 rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                Database credentials stay in environment/Docker config. Branding,
                mail, storage, payment, live class, push, and other app settings
                are managed from the dashboard after installation.
              </div>
              <WizardActions onNext={goNext} nextDisabled={!status?.database.connected} />
            </section>
          ) : null}

          {activeStep === "academy" ? (
            <section>
              <SectionTitle
                icon={Sparkles}
                title="Academy details"
                description="These values become the first site identity. You can edit them later from Site Settings."
              />
              <div className="mt-6 grid gap-4">
                <Field label="Academy name">
                  <Input
                    value={form.siteName}
                    onChange={(event) => updateForm("siteName", event.target.value)}
                  />
                </Field>
                <Field label="Tagline">
                  <Textarea
                    value={form.siteTagline}
                    onChange={(event) =>
                      updateForm("siteTagline", event.target.value)
                    }
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Support email">
                    <Input
                      value={form.supportEmail}
                      onChange={(event) =>
                        updateForm("supportEmail", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Support phone">
                    <Input
                      value={form.supportPhone}
                      onChange={(event) =>
                        updateForm("supportPhone", event.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>
              <WizardActions onNext={goNext} />
            </section>
          ) : null}

          {activeStep === "license" ? (
            <section>
              <SectionTitle
                icon={KeyRound}
                title="Activate license"
                description="Activation is checked before admin setup and demo import. This keeps installation gated without interrupting the first screen."
              />
              <div className="mt-6 grid gap-4">
                <Field label="License key">
                  <Input
                    value={form.licenseKey}
                    onChange={(event) => {
                      updateForm("licenseKey", event.target.value);
                      setLicenseFingerprint(null);
                    }}
                    placeholder={
                      status?.canUseDevLicense
                        ? "KASA-DEMO-LICENSE-2026"
                        : "Enter your license key"
                    }
                  />
                </Field>
                {status?.canUseDevLicense ? (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200">
                    Development mode has a local demo license available:
                    <span className="ml-1 font-semibold">
                      KASA-DEMO-LICENSE-2026
                    </span>
                  </div>
                ) : null}
                {licenseFingerprint ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600">
                    <BadgeCheck className="size-5" />
                    License verified. Fingerprint {licenseFingerprint}
                  </div>
                ) : null}
              </div>
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={validateLicense}
                  disabled={validating || form.licenseKey.trim().length < 8}
                >
                  {validating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="size-4" />
                  )}
                  Validate license
                </Button>
              </div>
            </section>
          ) : null}

          {activeStep === "admin" ? (
            <section>
              <SectionTitle
                icon={UserRoundCog}
                title="First admin account"
                description="This account will receive full platform access after installation is complete."
              />
              <div className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name">
                    <Input
                      value={form.adminFirstName}
                      onChange={(event) =>
                        updateForm("adminFirstName", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Last name">
                    <Input
                      value={form.adminLastName}
                      onChange={(event) =>
                        updateForm("adminLastName", event.target.value)
                      }
                    />
                  </Field>
                </div>
                <Field label="Admin email">
                  <Input
                    type="email"
                    value={form.adminEmail}
                    onChange={(event) =>
                      updateForm("adminEmail", event.target.value)
                    }
                  />
                </Field>
                <Field label="Password">
                  <Input
                    type="password"
                    value={form.adminPassword}
                    onChange={(event) =>
                      updateForm("adminPassword", event.target.value)
                    }
                  />
                </Field>
                <label className="flex items-start gap-3 rounded-2xl border p-4">
                  <Checkbox
                    checked={form.importDemoData}
                    onCheckedChange={(checked) =>
                      updateForm("importDemoData", checked === true)
                    }
                  />
                  <span>
                    <span className="block text-sm font-semibold">
                      Import marketplace demo data
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Adds demo courses, batches, class sessions, coupons,
                      articles, testimonials, notifications, and schedulers.
                    </span>
                  </span>
                </label>
              </div>
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={completeInstallation}
                  disabled={
                    submitting ||
                    !licenseFingerprint ||
                    !form.adminEmail ||
                    form.adminPassword.length < 8
                  }
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Play className="size-4" />
                  )}
                  Complete installation
                </Button>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </InstallShell>
  );
}

function InstallShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_32%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)))] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Kasa Enterprise Installer
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Product setup and activation
          </p>
        </div>
        <div className="rounded-full border bg-card px-4 py-2 text-sm font-medium">
          Kasa Enterprise
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function InfoTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger";
}) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-semibold ${
          tone === "success"
            ? "text-emerald-500"
            : tone === "danger"
              ? "text-destructive"
              : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ProgressTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}

function WizardActions({
  onNext,
  nextDisabled,
}: {
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex justify-end">
      <Button onClick={onNext} disabled={nextDisabled}>
        Continue
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
