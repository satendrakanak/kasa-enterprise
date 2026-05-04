"use client";

import { useEffect, useMemo, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Briefcase,
  Globe,
  Loader2,
  MapPin,
  Save,
  UserRound,
  Sparkles,
} from "lucide-react";

import { User, UpdateFacultyProfilePayload } from "@/types/user";
import { userClientService } from "@/services/users/user.client";
import { getErrorMessage } from "@/lib/error-handler";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaInstagram, FaLinkedin, FaLinkedinIn } from "react-icons/fa";

interface ProfileViewProps {
  user: User;
}

const profileSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().optional(),
  phoneNumber: z.string().trim().min(8, "Phone number is required"),
  headline: z.string().trim().max(120, "Headline is too long").optional(),
  company: z.string().trim().max(120, "Company is too long").optional(),
  location: z.string().trim().max(100, "Location is too long").optional(),
  website: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid website URL",
    ),
  bio: z.string().trim().max(500, "Bio is too long").optional(),
  facebook: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid Facebook URL",
    ),
  instagram: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid Instagram URL",
    ),
  twitter: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid X/Twitter URL",
    ),
  linkedin: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid LinkedIn URL",
    ),
  youtube: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid YouTube URL",
    ),
  whatsapp: z.string().trim().max(40, "WhatsApp is too long").optional(),
  telegram: z.string().trim().max(80, "Telegram is too long").optional(),
});

const facultySchema = z.object({
  designation: z.string().trim().optional(),
  expertise: z.string().trim().optional(),
  experience: z.string().trim().optional(),
  linkedin: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid LinkedIn URL",
    ),
  instagram: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid Instagram URL",
    ),
  twitter: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid X/Twitter URL",
    ),
  youtube: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "Enter a valid YouTube URL",
    ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type FacultyFormValues = z.infer<typeof facultySchema>;

export default function ProfileView({ user }: ProfileViewProps) {
  const [isSavingProfile, startSavingProfile] = useTransition();
  const [isSavingFaculty, startSavingFaculty] = useTransition();

  const isFaculty = useMemo(
    () => user.roles?.some((role) => role.name === "faculty") ?? false,
    [user.roles],
  );

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: getProfileDefaults(user),
  });

  const facultyForm = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    mode: "onChange",
    defaultValues: getFacultyDefaults(user),
  });

  useEffect(() => {
    profileForm.reset(getProfileDefaults(user));
    facultyForm.reset(getFacultyDefaults(user));
  }, [facultyForm, profileForm, user]);

  const watchedHeadline = useWatch({
    control: profileForm.control,
    name: "headline",
  });

  const watchedCompany = useWatch({
    control: profileForm.control,
    name: "company",
  });

  const watchedLocation = useWatch({
    control: profileForm.control,
    name: "location",
  });

  const watchedLinkedin = useWatch({
    control: profileForm.control,
    name: "linkedin",
  });

  const watchedInstagram = useWatch({
    control: profileForm.control,
    name: "instagram",
  });

  const watchedWebsite = useWatch({
    control: profileForm.control,
    name: "website",
  });

  const handleProfileSave = profileForm.handleSubmit((values) => {
    startSavingProfile(async () => {
      try {
        await userClientService.updateUser({
          firstName: values.firstName,
          lastName: values.lastName || "",
          phoneNumber: values.phoneNumber,
        });

        await userClientService.updateProfile(user.id, {
          headline: values.headline || "",
          company: values.company || "",
          location: values.location || "",
          website: values.website || "",
          bio: values.bio || "",
          facebook: values.facebook || "",
          instagram: values.instagram || "",
          twitter: values.twitter || "",
          linkedin: values.linkedin || "",
          youtube: values.youtube || "",
          whatsapp: values.whatsapp || "",
          telegram: values.telegram || "",
        });

        toast.success("Profile updated");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      }
    });
  });

  const handleFacultySave = facultyForm.handleSubmit((values) => {
    startSavingFaculty(async () => {
      try {
        const payload: UpdateFacultyProfilePayload = {
          designation: values.designation || "",
          expertise: values.expertise || "",
          experience: values.experience || "",
          linkedin: values.linkedin || "",
          instagram: values.instagram || "",
          twitter: values.twitter || "",
          youtube: values.youtube || "",
        };

        await userClientService.updateFacultyProfile(user.id, payload);
        toast.success("Faculty profile updated");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      }
    });
  });

  const inputClass =
    "h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-none transition focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-rose-200 dark:focus-visible:ring-rose-200";

  const textareaClass =
    "resize-none rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-none transition focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-rose-200 dark:focus-visible:ring-rose-200";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        {/* PROFILE FORM */}
        <form
          onSubmit={handleProfileSave}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6"
        >
          <SectionHeader
            icon={UserRound}
            eyebrow="Personal Profile"
            title="Update your public profile"
            description="Keep your basic details, professional headline, and social links fresh."
          />

          <FieldGroup className="mt-6 gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  First name
                </FieldLabel>
                <Controller
                  name="firstName"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="First name"
                      className={inputClass}
                    />
                  )}
                />
                <FieldError errors={[profileForm.formState.errors.firstName]} />
              </Field>

              <Field>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Last name
                </FieldLabel>
                <Controller
                  name="lastName"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Last name"
                      className={inputClass}
                    />
                  )}
                />
                <FieldError errors={[profileForm.formState.errors.lastName]} />
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Phone number
                </FieldLabel>
                <Controller
                  name="phoneNumber"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Phone number"
                      className={inputClass}
                    />
                  )}
                />
                <FieldError
                  errors={[profileForm.formState.errors.phoneNumber]}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Headline
                </FieldLabel>
                <Controller
                  name="headline"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nutrition learner, wellness mentor..."
                      className={inputClass}
                    />
                  )}
                />
                <FieldError errors={[profileForm.formState.errors.headline]} />
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Company
                </FieldLabel>
                <Controller
                  name="company"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Company or institution"
                      className={inputClass}
                    />
                  )}
                />
                <FieldError errors={[profileForm.formState.errors.company]} />
              </Field>

              <Field>
                <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Location
                </FieldLabel>
                <Controller
                  name="location"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="City, Country"
                      className={inputClass}
                    />
                  )}
                />
                <FieldError errors={[profileForm.formState.errors.location]} />
              </Field>
            </div>

            <Field>
              <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Website
              </FieldLabel>
              <Controller
                name="website"
                control={profileForm.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="https://yourwebsite.com"
                    className={inputClass}
                  />
                )}
              />
              <FieldError errors={[profileForm.formState.errors.website]} />
            </Field>

            <Field>
              <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Bio
              </FieldLabel>
              <Controller
                name="bio"
                control={profileForm.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Write a short profile bio..."
                    className={`min-h-32 ${textareaClass}`}
                  />
                )}
              />
              <FieldError errors={[profileForm.formState.errors.bio]} />
            </Field>

            <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
                Social Links
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Facebook
                  </FieldLabel>
                  <Controller
                    name="facebook"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://facebook.com/..."
                        className={inputClass}
                      />
                    )}
                  />
                  <FieldError
                    errors={[profileForm.formState.errors.facebook]}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Instagram
                  </FieldLabel>
                  <Controller
                    name="instagram"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://instagram.com/..."
                        className={inputClass}
                      />
                    )}
                  />
                  <FieldError
                    errors={[profileForm.formState.errors.instagram]}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    X / Twitter
                  </FieldLabel>
                  <Controller
                    name="twitter"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://x.com/..."
                        className={inputClass}
                      />
                    )}
                  />
                  <FieldError errors={[profileForm.formState.errors.twitter]} />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    LinkedIn
                  </FieldLabel>
                  <Controller
                    name="linkedin"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://linkedin.com/in/..."
                        className={inputClass}
                      />
                    )}
                  />
                  <FieldError
                    errors={[profileForm.formState.errors.linkedin]}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    YouTube
                  </FieldLabel>
                  <Controller
                    name="youtube"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://youtube.com/..."
                        className={inputClass}
                      />
                    )}
                  />
                  <FieldError errors={[profileForm.formState.errors.youtube]} />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    WhatsApp
                  </FieldLabel>
                  <Controller
                    name="whatsapp"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="+91..."
                        className={inputClass}
                      />
                    )}
                  />
                  <FieldError
                    errors={[profileForm.formState.errors.whatsapp]}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Telegram
                  </FieldLabel>
                  <Controller
                    name="telegram"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="@username"
                        className={inputClass}
                      />
                    )}
                  />
                  <FieldError
                    errors={[profileForm.formState.errors.telegram]}
                  />
                </Field>
              </div>
            </div>
          </FieldGroup>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5 dark:border-white/10">
            <Button
              type="submit"
              disabled={isSavingProfile || !profileForm.formState.isValid}
              className="h-11 rounded-full bg-blue-600 px-6 font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>

        {/* PREVIEW */}
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
            <SectionHeader
              icon={Sparkles}
              eyebrow="Live Preview"
              title="Profile snapshot"
              description="This gives you a quick idea of how the public profile details will read."
              compact
            />

            <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50/70 p-5 dark:border-rose-200/20 dark:bg-rose-200/10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
                {watchedHeadline || "Learner Profile"}
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {profileForm.watch("firstName") || user.firstName}{" "}
                {profileForm.watch("lastName") || user.lastName || ""}
              </h3>

              <div className="mt-4 space-y-3">
                {watchedCompany ? (
                  <PreviewLine icon={Briefcase} value={watchedCompany} />
                ) : null}

                {watchedLocation ? (
                  <PreviewLine icon={MapPin} value={watchedLocation} />
                ) : null}

                {watchedWebsite ? (
                  <PreviewLine icon={Globe} value={watchedWebsite} />
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {watchedLinkedin ? (
                <SocialPill icon={FaLinkedin} label="LinkedIn" />
              ) : null}

              {watchedInstagram ? (
                <SocialPill icon={FaInstagram} label="Instagram" />
              ) : null}

              {!watchedLinkedin && !watchedInstagram ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-400">
                  Add social links to make your public profile more complete.
                </p>
              ) : null}
            </div>
          </div>

          {isFaculty ? (
            <form
              onSubmit={handleFacultySave}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6"
            >
              <SectionHeader
                icon={Briefcase}
                eyebrow="Faculty Profile"
                title="Faculty details"
                description="These details are used on faculty and course instructor sections."
                compact
              />

              <FieldGroup className="mt-6 gap-5">
                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Designation
                  </FieldLabel>
                  <Controller
                    name="designation"
                    control={facultyForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Senior Faculty Mentor"
                        className={inputClass}
                      />
                    )}
                  />
                  <FieldError
                    errors={[facultyForm.formState.errors.designation]}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Expertise
                  </FieldLabel>
                  <Controller
                    name="expertise"
                    control={facultyForm.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Nutrition, Ayurveda, Wellness..."
                        className={`min-h-24 ${textareaClass}`}
                      />
                    )}
                  />
                  <FieldError
                    errors={[facultyForm.formState.errors.expertise]}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Experience
                  </FieldLabel>
                  <Controller
                    name="experience"
                    control={facultyForm.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Brief teaching or professional experience..."
                        className={`min-h-24 ${textareaClass}`}
                      />
                    )}
                  />
                  <FieldError
                    errors={[facultyForm.formState.errors.experience]}
                  />
                </Field>
              </FieldGroup>

              <div className="mt-6 flex justify-end border-t border-slate-100 pt-5 dark:border-white/10">
                <Button
                  type="submit"
                  disabled={isSavingFaculty || !facultyForm.formState.isValid}
                  className="h-11 rounded-full bg-blue-600 px-6 font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
                >
                  {isSavingFaculty ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Faculty
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function getProfileDefaults(user: User): ProfileFormValues {
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    headline: user.profile?.headline || "",
    company: user.profile?.company || "",
    location: user.profile?.location || "",
    website: user.profile?.website || "",
    bio: user.profile?.bio || "",
    facebook: user.profile?.facebook || "",
    instagram: user.profile?.instagram || "",
    twitter: user.profile?.twitter || "",
    linkedin: user.profile?.linkedin || "",
    youtube: user.profile?.youtube || "",
    whatsapp: user.profile?.whatsapp || "",
    telegram: user.profile?.telegram || "",
  };
}

function getFacultyDefaults(user: User): FacultyFormValues {
  return {
    designation: user.facultyProfile?.designation || "",
    expertise: user.facultyProfile?.expertise || "",
    experience: user.facultyProfile?.experience || "",
    linkedin: user.facultyProfile?.linkedin || "",
    instagram: user.facultyProfile?.instagram || "",
    twitter: user.facultyProfile?.twitter || "",
    youtube: user.facultyProfile?.youtube || "",
  };
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  compact = false,
}: {
  icon: typeof UserRound;
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

        <h2
          className={`mt-2 font-semibold text-slate-950 dark:text-white ${
            compact ? "text-xl" : "text-2xl"
          }`}
        >
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function PreviewLine({
  icon: Icon,
  value,
}: {
  icon: typeof Briefcase;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
      <Icon className="h-4 w-4 text-blue-700 dark:text-rose-200" />
      <span className="break-words">{value}</span>
    </div>
  );
}

function SocialPill({
  icon: Icon,
  label,
}: {
  icon: typeof FaLinkedinIn;
  label: string;
}) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
      <Icon className="h-4 w-4 text-blue-700 dark:text-rose-200" />
      {label}
    </span>
  );
}

function SparkPreviewIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Globe {...props} />;
}
