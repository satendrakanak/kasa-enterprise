"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MailCheck, Send } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "./card-wrapper";
import { fogotPasswordFormSchema } from "@/schemas";
import { authService } from "@/services/auth.service";
import { SubmitButton } from "../submit-button";

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof fogotPasswordFormSchema>>({
    resolver: zodResolver(fogotPasswordFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof fogotPasswordFormSchema>) => {
    try {
      setError("");

      await authService.forgotPassword(data);

      setIsSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const inputClass =
    "h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-none transition focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-rose-200 dark:focus-visible:ring-rose-200";

  if (isSuccess) {
    return (
      <CardWrapper
        headerLabel="Check your email"
        backButtonLabel="Back to login"
        backButtonHref="/auth/sign-in"
        imageUrl="/assets/login-form.jpg"
        alt="Password reset verification"
        width={600}
        height={600}
      >
        <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
            <MailCheck className="h-10 w-10" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Verify your email
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
            We’ve sent a password reset link to your email address. Please check
            your inbox and open the link to reset your password.
          </p>

          <div className="my-5 h-0.5 w-12 rounded-full bg-slate-200 dark:bg-white/10" />

          <p className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-300">
            Didn’t receive it? Check your spam folder or submit the request
            again.
          </p>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to sign in"
      backButtonHref="/auth/sign-in"
      imageUrl="/assets/login-form.jpg"
      alt="Forgot password form image"
      width={600}
      height={600}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup className="gap-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email address
                </FieldLabel>

                <Input
                  {...field}
                  type="email"
                  placeholder="m@example.com"
                  className={inputClass}
                />

                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          {error ? (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <SubmitButton
            type="submit"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            loadingText="Sending link..."
            className="h-12 w-full rounded-full bg-blue-600 text-base font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
          >
            <Send className="h-4 w-4" />
            Send reset link
          </SubmitButton>
        </FieldGroup>
      </form>
    </CardWrapper>
  );
}
