"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "./card-wrapper";
import { resetPasswordFormSchema } from "@/schemas";
import { authService } from "@/services/auth.service";
import { SubmitButton } from "../submit-button";

export function ResetPasswordForm() {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.replace("/auth/sign-in?reset=false");
    }
  }, [router, token]);

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof resetPasswordFormSchema>) => {
    if (!token) return;

    try {
      setError("");
      setSuccess(undefined);

      await authService.resetPassword({
        token,
        ...data,
      });

      setSuccess("Password reset successfully.");

      startTransition(() => {
        router.push("/auth/sign-in?reset=true");
        router.refresh();
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const isLoading = isSubmitting || isPending;

  const inputClass =
    "h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-none transition focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-rose-200 dark:focus-visible:ring-rose-200";

  return (
    <CardWrapper
      headerLabel="Reset password"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/sign-up"
      imageUrl="/assets/login-form.jpg"
      alt="Reset password form image"
      width={600}
      height={600}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup className="gap-5">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  New password
                </FieldLabel>

                <Input
                  {...field}
                  type="password"
                  placeholder="Enter new password"
                  className={inputClass}
                />

                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Confirm password
                </FieldLabel>

                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm new password"
                  className={inputClass}
                />

                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          {success ? (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <SubmitButton
            type="submit"
            disabled={!isValid || isLoading || !token}
            loading={isLoading}
            loadingText="Resetting password..."
            className="h-12 w-full rounded-full bg-blue-600 text-base font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
          >
            <KeyRound className="h-4 w-4" />
            Reset password
          </SubmitButton>
        </FieldGroup>
      </form>
    </CardWrapper>
  );
}
