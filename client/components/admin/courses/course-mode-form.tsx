"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, RadioTower, SplitSquareHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { COURSE_DELIVERY_MODES } from "@/lib/course-delivery";
import { getErrorMessage } from "@/lib/error-handler";
import { cn } from "@/lib/utils";
import { courseClientService } from "@/services/courses/course.client";
import type { Course } from "@/types/course";

const courseModeSchema = z.object({
  mode: z.enum(["self_learning", "faculty_led", "hybrid"]),
});

const modeIcons = {
  self_learning: BookOpen,
  faculty_led: RadioTower,
  hybrid: SplitSquareHorizontal,
} as const;

type CourseModeFormProps = {
  course: Course;
};

export function CourseModeForm({ course }: CourseModeFormProps) {
  const router = useRouter();
  const currentMode = COURSE_DELIVERY_MODES.some(
    (option) => option.value === course.mode,
  )
    ? (course.mode as z.input<typeof courseModeSchema>["mode"])
    : "self_learning";

  const form = useForm<z.input<typeof courseModeSchema>>({
    resolver: zodResolver(courseModeSchema),
    mode: "onChange",
    defaultValues: {
      mode: currentMode,
    },
  });

  const { isSubmitting } = form.formState;
  const selectedMode = useWatch({
    control: form.control,
    name: "mode",
  });

  const onSubmit = async (data: z.input<typeof courseModeSchema>) => {
    try {
      await courseClientService.update(course.id, data);
      router.refresh();
      toast.success("Course delivery mode updated");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(11,18,32,0.96),rgba(17,27,46,0.98))]">
      <div className="border-b border-slate-100 px-4 py-3 dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
            Delivery Mode
          </h3>
          <Badge variant="outline">Required</Badge>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          This controls course content, live classes, faculty assignment, and
          learner workspace.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 p-4">
        <Controller
          name="mode"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              {COURSE_DELIVERY_MODES.map((option) => {
                const Icon = modeIcons[option.value];
                const active = field.value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {option.shortLabel}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />

        {selectedMode === "self_learning" ? (
          <p className="rounded-xl border bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
            Faculty assignment is not required for self-learning courses.
          </p>
        ) : (
          <p className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs leading-5 text-primary">
            Faculty assignment is required because this mode includes live class
            management.
          </p>
        )}

        <SubmitButton
          type="submit"
          loading={isSubmitting}
          disabled={selectedMode === currentMode}
          className="w-full"
          loadingText="Updating..."
        >
          Save Mode
        </SubmitButton>
      </form>
    </div>
  );
}
