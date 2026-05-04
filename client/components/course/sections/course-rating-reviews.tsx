"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getErrorMessage } from "@/lib/error-handler";
import { getUserAvatarUrl } from "@/lib/user-avatar";
import { cn } from "@/lib/utils";
import { useSession } from "@/context/session-context";
import { courseReviewClientService } from "@/services/course-reviews/course-review.client";
import { Course } from "@/types/course";
import { CourseReview, CourseReviewSummary } from "@/types/course-review";
import { MessageSquare, Star, Trash2, UserRound } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const emptySummary: CourseReviewSummary = {
  average: 0,
  total: 0,
  breakdown: [5, 4, 3, 2, 1].map((rating) => ({ rating, count: 0 })),
};

export function CourseRatingReviews({ course }: { course: Course }) {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [summary, setSummary] = useState<CourseReviewSummary>(emptySummary);
  const [myReview, setMyReview] = useState<CourseReview | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const { user } = useSession();

  const loadReviews = async () => {
    try {
      const [reviewsResponse, summaryResponse, mineResponse] =
        await Promise.all([
          courseReviewClientService.getByCourse(course.id),
          courseReviewClientService.getSummary(course.id),
          user
            ? courseReviewClientService.getMine(course.id).catch(() => null)
            : Promise.resolve(null),
        ]);

      const ownReview = mineResponse?.data || null;

      setMyReview(ownReview);
      setReviews(mergeReviews(reviewsResponse.data, ownReview));
      setSummary(summaryResponse.data);

      if (ownReview) {
        setRating(ownReview.rating);
        setComment(ownReview.comment || "");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      courseReviewClientService.getByCourse(course.id),
      courseReviewClientService.getSummary(course.id),
      user
        ? courseReviewClientService.getMine(course.id).catch(() => null)
        : Promise.resolve(null),
    ])
      .then(([reviewsResponse, summaryResponse, mineResponse]) => {
        if (!isMounted) return;

        const ownReview = mineResponse?.data || null;

        setMyReview(ownReview);
        setReviews(mergeReviews(reviewsResponse.data, ownReview));
        setSummary(summaryResponse.data);

        if (ownReview) {
          setRating(ownReview.rating);
          setComment(ownReview.comment || "");
        }
      })
      .catch((error) => {
        if (isMounted) toast.error(getErrorMessage(error));
      });

    return () => {
      isMounted = false;
    };
  }, [course.id, user]);

  const submitReview = () => {
    startTransition(async () => {
      try {
        if (myReview) {
          await courseReviewClientService.update(myReview.id, {
            rating,
            comment,
          });
        } else {
          await courseReviewClientService.upsert(course.id, {
            rating,
            comment,
          });
        }

        toast.success("Review submitted for approval");
        await loadReviews();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const deleteReview = (reviewId: number) => {
    startTransition(async () => {
      try {
        await courseReviewClientService.delete(reviewId);

        setMyReview(null);
        setRating(5);
        setComment("");

        toast.success("Review deleted");
        await loadReviews();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 dark:border-white/10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Ratings & Reviews
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          See what learners are saying and share your own experience after
          enrolling.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* LEFT SUMMARY */}
        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 dark:border-white/10 dark:bg-[#0b1628]">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
            Course Rating
          </p>

          <div className="mt-5 flex items-end gap-2">
            <span className="text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
              {summary.average ? summary.average.toFixed(1) : "0.0"}
            </span>

            <span className="pb-2 text-sm text-slate-500 dark:text-slate-400">
              / 5
            </span>
          </div>

          <div className="mt-3">
            <RatingStars rating={summary.average} />
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Based on {summary.total} review{summary.total === 1 ? "" : "s"}
          </p>

          <div className="mt-6 space-y-3">
            {summary.breakdown.map((item) => {
              const width = summary.total
                ? Math.round((item.count / summary.total) * 100)
                : 0;

              return (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="w-10 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {item.rating} star
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <span className="w-7 text-right text-xs text-slate-500 dark:text-slate-400">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT REVIEWS */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Learner Reviews
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Real feedback from students who joined this course.
              </p>
            </div>
          </div>

          {/* REVIEW FORM */}
          {course.isEnrolled ? (
            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
              <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Share your experience
              </p>

              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="cursor-pointer rounded-full p-1 transition hover:scale-105"
                    aria-label={`${value} star rating`}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        value <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-600",
                      )}
                    />
                  </button>
                ))}
              </div>

              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="What helped you most in this course?"
                className="min-h-28 resize-none border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#07111f] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-rose-200"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={submitReview}
                  className="rounded-full bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
                >
                  {isPending
                    ? "Submitting..."
                    : myReview
                      ? "Update review"
                      : "Submit review"}
                </Button>

                {myReview ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => deleteReview(myReview.id)}
                    className="rounded-full border-slate-200 bg-white px-5 font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-500 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-400">
              Enroll in this course to add your own rating and review.
            </div>
          )}

          {/* REVIEW LIST */}
          <div className="mt-6 space-y-4">
            {reviews.length ? (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-slate-100 bg-white p-4 transition hover:border-blue-100 hover:bg-blue-50/40 dark:border-white/10 dark:bg-[#0b1628] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.045]"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-11 w-11 shrink-0 border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/10">
                      <AvatarImage
                        src={getUserAvatarUrl(review.user)}
                        alt={getReviewUserName(review)}
                      />
                      <AvatarFallback className="bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-rose-200">
                        {getReviewInitials(review)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-950 dark:text-white">
                            {getReviewUserName(review)}
                          </h4>

                          <div className="mt-1">
                            <RatingStars rating={review.rating} small />
                          </div>
                        </div>

                        {myReview?.id === review.id ? (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-rose-200/10 dark:text-rose-200">
                            Your review
                          </span>
                        ) : null}
                      </div>

                      {review.comment ? (
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {review.comment}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm italic text-slate-400 dark:text-slate-500">
                          No written comment added.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-8 text-center dark:border-white/10 dark:bg-[#0b1628]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-rose-200">
                  <MessageSquare className="h-6 w-6" />
                </div>

                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  No reviews yet
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Be the first learner to share feedback for this course.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RatingStars({
  rating,
  small = false,
}: {
  rating: number;
  small?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            small ? "h-4 w-4" : "h-5 w-5",
            value <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300 dark:text-slate-600",
          )}
        />
      ))}
    </div>
  );
}

function mergeReviews(
  reviews: CourseReview[],
  ownReview: CourseReview | null,
): CourseReview[] {
  if (!ownReview) return reviews;

  const exists = reviews.some((review) => review.id === ownReview.id);

  if (exists) return reviews;

  return [ownReview, ...reviews];
}

function getReviewUserName(review: CourseReview) {
  const firstName = review.user?.firstName || "";
  const lastName = review.user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Learner";
}

function getReviewInitials(review: CourseReview) {
  const name = getReviewUserName(review);

  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
