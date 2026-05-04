"use client";

import RatingStars from "@/components/courses/rating-star";
import { Award, Star, Users } from "lucide-react";

interface CourseRatingDetailsProps {
  rating: number;
  reviews: number;
  enrolledStudentCount: number;
}

const CourseRatingDetails = ({
  rating,
  reviews,
  enrolledStudentCount,
}: CourseRatingDetailsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
      {/* Bestseller */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-4 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_28px_rgba(2,6,23,0.18)] backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
        <Award className="h-4 w-4 text-sky-100 dark:text-rose-200" />
        <span>Bestseller</span>
      </div>

      {/* Rating */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

        <span className="font-semibold text-white">{rating}</span>

        <RatingStars rating={rating} />

        <span className="text-white/60">({reviews.toLocaleString()})</span>
      </div>

      {/* Students */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <Users className="h-4 w-4 text-sky-100 dark:text-rose-200" />

        <span>
          <strong className="font-semibold text-white">
            {enrolledStudentCount.toLocaleString()}
          </strong>{" "}
          students
        </span>
      </div>
    </div>
  );
};

export default CourseRatingDetails;
