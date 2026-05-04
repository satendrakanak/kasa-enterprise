"use client";

import { useEffect, useState, useTransition } from "react";
import { Star, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/context/session-context";
import { getUserAvatarUrl } from "@/lib/user-avatar";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/error-handler";
import { facultyReviewClientService } from "@/services/faculty-reviews/faculty-review.client";
import {
  FacultyReview,
  FacultyReviewSummary,
} from "@/types/faculty-review";
import { User } from "@/types/user";
import { toast } from "sonner";
import Link from "next/link";

const emptySummary: FacultyReviewSummary = {
  average: 0,
  total: 0,
  breakdown: [5, 4, 3, 2, 1].map((rating) => ({ rating, count: 0 })),
};

export function FacultyReviewsSection({ faculty }: { faculty: User }) {
  const [reviews, setReviews] = useState<FacultyReview[]>([]);
  const [summary, setSummary] = useState<FacultyReviewSummary>(emptySummary);
  const [myReview, setMyReview] = useState<FacultyReview | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const { user } = useSession();

  const loadReviews = async () => {
    try {
      const [reviewsResponse, summaryResponse, mineResponse] = await Promise.all([
        facultyReviewClientService.getByFaculty(faculty.id),
        facultyReviewClientService.getSummary(faculty.id),
        user
          ? facultyReviewClientService.getMine(faculty.id).catch(() => null)
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
    void loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faculty.id, user?.id]);

  const submitReview = () => {
    startTransition(async () => {
      try {
        if (myReview) {
          await facultyReviewClientService.update(myReview.id, {
            rating,
            comment,
          });
        } else {
          await facultyReviewClientService.upsert(faculty.id, {
            rating,
            comment,
          });
        }
        toast.success("Faculty review saved");
        await loadReviews();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const deleteReview = (reviewId: number) => {
    startTransition(async () => {
      try {
        await facultyReviewClientService.delete(reviewId);
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
    <section className="rounded-[32px] border border-[var(--brand-100)] bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] md:p-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="rounded-[28px] bg-[linear-gradient(180deg,var(--brand-50)_0%,#fff_100%)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">
            Faculty rating
          </p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-bold text-slate-950">
              {summary.average || "0.0"}
            </span>
            <span className="pb-2 text-sm text-slate-500">
              / 5 from {summary.total} reviews
            </span>
          </div>
          <RatingStars rating={summary.average} />
          <div className="mt-5 space-y-2">
            {summary.breakdown.map((item) => {
              const width = summary.total
                ? Math.round((item.count / summary.total) * 100)
                : 0;

              return (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="w-10 text-xs font-semibold text-slate-600">
                    {item.rating} star
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs text-slate-500">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                Learner feedback
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Honest reviews from learners who interacted with this faculty.
              </p>
            </div>
          </div>

          {user ? (
            <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-900">
                Share your rating
              </p>
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded-full p-1"
                    aria-label={`${value} star rating`}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        value <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300",
                      )}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="What stood out in the teaching style, clarity, or support?"
              />
              <div className="mt-3 flex flex-wrap gap-3">
                <Button type="button" disabled={isPending} onClick={submitReview}>
                  {isPending
                    ? "Saving..."
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
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              Sign in to rate this faculty and share your experience.
              <Link
                href={`/auth/sign-in?callbackUrl=/our-faculty/${faculty.id}`}
                className="ml-2 font-semibold text-[var(--brand-700)]"
              >
                Go to sign in
              </Link>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {reviews.length ? (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-[28px] border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 border border-[var(--brand-100)]">
                        <AvatarImage
                          src={getUserAvatarUrl(review.user)}
                          alt={review.user.firstName}
                        />
                        <AvatarFallback className="bg-[var(--brand-50)] text-[var(--brand-700)]">
                          {review.user.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-950">
                          {review.user.firstName} {review.user.lastName || ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} compact />
                  </div>
                  {review.comment ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {review.comment}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="rounded-[28px] border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                No ratings yet. Be the first learner to review this faculty.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function mergeReviews(reviews: FacultyReview[], myReview: FacultyReview | null) {
  if (!myReview) return reviews;
  const withoutMine = reviews.filter((review) => review.id !== myReview.id);
  return [myReview, ...withoutMine];
}

function RatingStars({
  rating,
  compact = false,
}: {
  rating: number;
  compact?: boolean;
}) {
  return (
    <div className={cn("mt-3 flex gap-1", compact && "mt-0")}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            compact ? "h-4 w-4" : "h-5 w-5",
            value <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300",
          )}
        />
      ))}
    </div>
  );
}
