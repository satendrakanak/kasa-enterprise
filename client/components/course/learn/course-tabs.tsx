"use client";

import { Course } from "@/types/course";
import { Certificate } from "@/types/certificate";
import { certificateClientService } from "@/services/certificates/certificate.client";
import { getCourseProgress } from "@/helpers/course-progress";
import { getCourseMeta } from "@/helpers/course-meta";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CourseQaSection } from "@/components/course/sections/course-qa-section";
import { CourseRatingReviews } from "@/components/course/sections/course-rating-reviews";
import { slugify } from "@/utils/slugify";
import { downloadRemoteFile } from "@/lib/download-file";
import { CourseExamSection } from "@/components/course/learn/course-exam-section";

interface CourseTabsProps {
  course: Course;
}

export const CourseTabs = ({ course }: CourseTabsProps) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "exam" | "qa" | "reviews"
  >("overview");
  const [meta, setMeta] = useState({
    totalLectures: 0,
    totalDuration: "0m",
  });
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { completed, total, percent } = getCourseProgress(course);
  const isCourseCompleted = total > 0 && completed >= total;
  const hasPublishedExam =
    !!course.exam?.isPublished && !!course.exam?.questions?.length;

  useEffect(() => {
    const loadMeta = async () => {
      const data = await getCourseMeta(course);
      setMeta(data);
    };

    loadMeta();
  }, [course]);

  useEffect(() => {
    let mounted = true;

    const loadCertificate = async () => {
      try {
        const response = await certificateClientService.getForCourse(course.id);
        if (mounted) setCertificate(response.data);
      } catch {
        if (mounted) setCertificate(null);
      }
    };

    loadCertificate();

    return () => {
      mounted = false;
    };
  }, [course.id]);

  const downloadCertificate = async (nextCertificate: Certificate) => {
    const fileUrl = nextCertificate.file?.path;
    if (!fileUrl) return;

    const name = slugify(
      `${nextCertificate.user?.firstName} ${nextCertificate.user?.lastName}`,
    );

    const course = slugify(nextCertificate.course?.title || "course");

    const fileName = `${name}-${course}.pdf`;
    await downloadRemoteFile(fileUrl, fileName);
  };

  const handleCertificateClick = async () => {
    if (certificate) {
      downloadCertificate(certificate);
      return;
    }

    if (!isCourseCompleted) {
      toast.info("Complete all lectures to unlock your certificate");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await certificateClientService.generateForCourse(
        course.id,
      );
      setCertificate(response.data);
      toast.success("Certificate generated and emailed successfully");
      downloadCertificate(response.data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Certificate could not be generated",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white border-t">
      {/* 🔥 TAB HEADER */}
      <div className="flex flex-wrap gap-5 px-6 pt-4 border-b">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-2 text-sm cursor-pointer font-bold ${
            activeTab === "overview"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-800"
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("qa")}
          className={`pb-2 text-sm cursor-pointer font-bold ${
            activeTab === "qa"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-800"
          }`}
        >
          Q&A
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 text-sm cursor-pointer font-bold ${
            activeTab === "reviews"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-800"
          }`}
        >
          Reviews
        </button>
        {hasPublishedExam ? (
          <button
            type="button"
            onClick={() => setActiveTab("exam")}
            className={`pb-2 text-sm cursor-pointer font-bold ${
              activeTab === "exam"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-800"
            }`}
          >
            Final Exams
          </button>
        ) : null}
      </div>

      {/* 🔥 CONTENT */}
      {activeTab === "exam" ? (
        <div className="px-6 py-6">
          <CourseExamSection course={{ ...course, isEnrolled: true }} />
        </div>
      ) : activeTab === "qa" ? (
        <div className="px-6 py-6">
          <CourseQaSection course={{ ...course, isEnrolled: true }} />
        </div>
      ) : activeTab === "reviews" ? (
        <div className="px-6 py-6">
          <CourseRatingReviews course={{ ...course, isEnrolled: true }} />
        </div>
      ) : (
        <div className="px-6 py-6 space-y-4 text-sm text-gray-700">
          <h1 className="text-2xl font-semibold ">{course.title}</h1>

          {/* 🚀 SHORT DESCRIPTION */}
          {course.shortDescription && (
            <div>
              <p className="text-base text-gray-900 leading-relaxed">
                {course.shortDescription}
              </p>
            </div>
          )}

          {/* 📊 STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t pt-6">
            <div>
              <p className="text-gray-500 text-xs">Lectures</p>
              <p className="font-semibold">{meta.totalLectures}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Total Duration</p>
              <p className="font-semibold">{meta.totalDuration}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Language</p>
              <p className="font-semibold">{course.language || "English"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Level</p>
              <p className="font-semibold">All Level</p>
            </div>
          </div>

          {/* 🎓 CERTIFICATE */}
          <div className="border-t pt-6">
            <div className="overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-primary/10 via-white to-orange-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Certificate
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-gray-950">
                    {certificate
                      ? "Your certificate is ready"
                      : "Unlock your completion certificate"}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                    {certificate
                      ? `Certificate ID ${certificate.certificateNumber}. You can download it anytime from here or your profile.`
                      : hasPublishedExam
                        ? `Complete all ${total || meta.totalLectures} lectures and clear the final exam to generate your official Unitus certificate. Current lecture progress: ${percent}%.`
                        : `Complete all ${total || meta.totalLectures} lectures to generate your official Unitus certificate. Current progress: ${percent}%.`}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    (!isCourseCompleted && !certificate) || isGenerating
                  }
                  onClick={handleCertificateClick}
                  className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none cursor-pointer"
                >
                  {isGenerating
                    ? "Generating..."
                    : certificate
                      ? "Download Certificate"
                      : "Get Certificate"}
                </button>
              </div>
            </div>
          </div>

          {/* 📚 FULL DESCRIPTION */}
          {course.description && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-base mb-3">Description</h3>

              <div
                className="prose prose-sm max-w-none
                 prose-headings:font-semibold
                 prose-p:leading-relaxed
                 prose-ul:list-disc prose-ul:ml-4
                 prose-ol:list-decimal prose-ol:ml-4"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
