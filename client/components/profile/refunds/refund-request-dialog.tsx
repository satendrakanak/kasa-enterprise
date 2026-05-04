"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { refundClientService } from "@/services/refunds/refund.client";

const refundRequestSchema = z.object({
  reason: z.string().min(10, "Please share a meaningful refund reason."),
  customerNote: z.string().max(2000).optional(),
});

type RefundRequestFormValues = z.infer<typeof refundRequestSchema>;

export function RefundRequestDialog({
  open,
  onOpenChange,
  orderId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RefundRequestFormValues>({
    resolver: zodResolver(refundRequestSchema),
    defaultValues: {
      reason: "",
      customerNote: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);

      await refundClientService.createRequest(orderId, values);

      toast.success("Refund request submitted successfully.");
      onOpenChange(false);
      form.reset();
      router.refresh();
    } catch {
      toast.error("Unable to submit refund request right now.");
    } finally {
      setIsSubmitting(false);
    }
  });

  const textareaClass =
    "resize-none rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-none transition focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-rose-200 dark:focus-visible:ring-rose-200";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-[0_35px_120px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-6">
            <DialogHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
                <RotateCcw className="h-7 w-7" />
              </div>

              <DialogTitle className="text-xl font-semibold text-slate-950 dark:text-white">
                Request a refund
              </DialogTitle>

              <DialogDescription className="pt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Share the reason clearly. The management team will review the
                request and update your order trail with every action taken.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Refund reason
                </label>

                <Textarea
                  {...form.register("reason")}
                  rows={5}
                  placeholder="Tell us why you want the refund and what happened."
                  className={`min-h-32 ${textareaClass}`}
                />

                {form.formState.errors.reason ? (
                  <p className="text-sm font-medium text-red-600 dark:text-red-300">
                    {form.formState.errors.reason.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Additional note
                </label>

                <Textarea
                  {...form.register("customerNote")}
                  rows={4}
                  placeholder="Optional context for the admin team."
                  className={`min-h-24 ${textareaClass}`}
                />

                {form.formState.errors.customerNote ? (
                  <p className="text-sm font-medium text-red-600 dark:text-red-300">
                    {form.formState.errors.customerNote.message}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-300">
                Refund requests are reviewed by the team. You will be able to
                track every update in the refund timeline.
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-slate-100 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-[#0b1628] sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-11 rounded-full border-slate-200 bg-white px-5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-full bg-blue-600 px-5 font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                "Submit refund request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
