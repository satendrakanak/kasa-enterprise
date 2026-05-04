"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Chapter } from "@/types/chapter";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { chapterClientService } from "@/services/chapters/chapter.client";
import { Switch } from "@/components/ui/switch";
import { chapterSchema } from "@/schemas/courses";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error-handler";

interface ChapterDrawerProps {
  open: boolean;
  onClose: () => void;
  chapter: Chapter;
  courseId: number;
}

export default function ChapterDrawer({
  open,
  onClose,
  chapter,
  courseId,
}: ChapterDrawerProps) {
  const router = useRouter();

  const form = useForm<z.input<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
    mode: "onChange",
    defaultValues: {
      title: chapter.title || "",
      description: chapter.description || "",
      isFree: chapter.isFree || false,
    },
  });
  useEffect(() => {
    form.reset({
      title: chapter.title || "",
      description: chapter.description || "",
      isFree: chapter.isFree || false,
    });
  }, [chapter]);

  const isTemp = chapter.isTemp;

  const { isValid, isSubmitting } = form.formState;
  const onSubmit = async (data: z.input<typeof chapterSchema>) => {
    try {
      const { isPublished, ...rest } = data;
      const payload = {
        ...rest,
        courseId,
      };

      let response;

      if (!isTemp) {
        // UPDATE
        response = await chapterClientService.update(chapter.id, payload);
        toast.success("Chapter updated");
      } else {
        // CREATE
        response = await chapterClientService.create(payload);
        toast.success("Chapter created");
      }
      router.refresh();
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onClose}>
      <DrawerContent className="ml-auto h-full w-200 max-w-2xl! sm:max-w-4xl flex flex-col">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center justify-between w-full gap-4">
              {/* LEFT */}
              <div className="min-w-0">
                <DrawerTitle className="font-semibold">
                  {isTemp ? "Add New" : "Edit"} Chapter
                </DrawerTitle>
                <DrawerDescription>
                  Manage course chapters details
                </DrawerDescription>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3 shrink-0">
                <Controller
                  name="isFree"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        You want to make this chapter free?
                      </span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                />

                <SubmitButton
                  type="submit"
                  disabled={!isValid}
                  loading={isSubmitting}
                  className="w-auto shrink-0 px-4"
                >
                  {!isTemp ? "Update" : "Create"}
                </SubmitButton>
              </div>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <FieldGroup>
              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      placeholder="e.g. Introduction of the course"
                      className="h-11"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="mt-4 h-50 resize-y"
                    placeholder="Chapter description"
                  />
                )}
              />
            </FieldGroup>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
