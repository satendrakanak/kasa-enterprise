"use client";

import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { changePasswordSchema } from "@/schemas/profile";
import { userClientService } from "@/services/users/user.client";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error-handler";

export function ChangePasswordForm() {
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    try {
      await userClientService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password updated successfully");
      form.reset();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const inputClass =
    "h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-none transition focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-rose-200 dark:focus-visible:ring-rose-200";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="flex items-start gap-3 border-b border-slate-100 pb-5 dark:border-white/10">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <LockKeyhole className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
            Security
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            Change password
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Update your password to keep your learning account secure.
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <FieldGroup className="gap-5">
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Current password
                </FieldLabel>

                <Input
                  {...field}
                  type="password"
                  placeholder="Enter current password"
                  className={inputClass}
                />

                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="newPassword"
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
        </FieldGroup>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Use a strong password that you do not reuse on other websites.
          </p>

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="h-11 rounded-full bg-blue-600 px-6 font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
