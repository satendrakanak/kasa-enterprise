"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error-handler";
import { cn } from "@/lib/utils";
import { courseExamsClientService } from "@/services/course-exams/course-exams.client";
import {
  Course,
  CourseExamAttempt,
  CourseExamLearnerPayload,
} from "@/types/course";
import { formatDateTime } from "@/utils/formate-date";

interface CourseExamSectionProps {
  course: Course;
}

export function CourseExamSection({ course }: CourseExamSectionProps) {
  const [payload, setPayload] = useState<CourseExamLearnerPayload | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [draggedOptionId, setDraggedOptionId] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [celebrationTick, setCelebrationTick] = useState(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const response = await courseExamsClientService.getForCourse(course.id);
        if (!mounted) return;
        setPayload(response.data);
      } catch (error: unknown) {
        if (!mounted) return;
        toast.error(getErrorMessage(error));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [course.id]);

  const questions = useMemo(() => payload?.exam.questions ?? [], [payload]);

  const totalMarks = useMemo(
    () => questions.reduce((sum, question) => sum + question.points, 0),
    [questions],
  );

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canGoBack = currentQuestionIndex > 0;

  useEffect(() => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const question of questions) {
        if (question.type === "drag_drop" && !next[question.id]?.length) {
          next[question.id] = shuffleArray(
            question.options.map((option) => option.id),
          );
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [questions]);

  useEffect(() => {
    setHasStarted(false);
    setCurrentQuestionIndex(0);
    setTimeRemaining(null);
  }, [course.id, payload?.attemptsUsed]);

  useEffect(() => {
    if (!payload?.canAttempt || !payload.exam.timeLimitMinutes || !hasStarted) {
      setTimeRemaining(null);
      return;
    }

    setTimeRemaining(payload.exam.timeLimitMinutes * 60);

    const timer = window.setInterval(() => {
      setTimeRemaining((current) => {
        if (current === null) return current;

        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasStarted, payload?.canAttempt, payload?.exam.timeLimitMinutes]);

  const handleOptionToggle = (
    questionId: string,
    optionId: string,
    type: "single" | "multiple" | "true_false" | "short_text" | "drag_drop",
  ) => {
    setSelectedAnswers((prev) => {
      if (type === "multiple") {
        const current = prev[questionId] ?? [];

        return {
          ...prev,
          [questionId]: current.includes(optionId)
            ? current.filter((value) => value !== optionId)
            : [...current, optionId],
        };
      }

      return {
        ...prev,
        [questionId]: [optionId],
      };
    });
  };

  const handleSubmit = useCallback(
    async (force = false) => {
      if (!payload) return;

      const answers = questions.map((question) => ({
        questionId: question.id,
        selectedOptionIds: selectedAnswers[question.id] ?? [],
        answerText: answerTexts[question.id]?.trim() || undefined,
      }));

      const unanswered = answers.filter((answer) => {
        const question = questions.find(
          (item) => item.id === answer.questionId,
        );

        if (!question) return false;

        if (question.type === "short_text") {
          return !answer.answerText;
        }

        return !answer.selectedOptionIds.length;
      });

      if (unanswered.length && !force) {
        toast.error("Please answer every question before submitting the exam.");
        return;
      }

      try {
        setIsSubmitting(true);

        const response = await courseExamsClientService.submitAttempt(
          course.id,
          answers,
        );

        const latestAttempt = response.data;

        setPayload((prev) =>
          prev
            ? {
                ...prev,
                latestAttempt,
                attempts: latestAttempt
                  ? [latestAttempt, ...prev.attempts]
                  : prev.attempts,
                attemptsUsed: prev.attemptsUsed + 1,
                attemptsRemaining:
                  prev.attemptsRemaining === null
                    ? null
                    : Math.max(prev.attemptsRemaining - 1, 0),
                canAttempt:
                  !!latestAttempt &&
                  !latestAttempt.passed &&
                  (prev.attemptsRemaining === null ||
                    prev.attemptsRemaining > 1),
                isPassed: !!latestAttempt?.passed,
                passedAttempt: latestAttempt?.passed
                  ? latestAttempt
                  : prev.passedAttempt,
              }
            : prev,
        );

        setHasStarted(false);
        setCurrentQuestionIndex(0);
        setTimeRemaining(null);
        setSelectedAnswers({});
        setAnswerTexts({});
        setCelebrationTick((current) => current + 1);

        toast.success(
          latestAttempt?.passed
            ? "Excellent. You cleared the exam."
            : "Exam submitted. Review your score below.",
        );
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [answerTexts, course.id, payload, questions, selectedAnswers],
  );

  useEffect(() => {
    if (
      timeRemaining === 0 &&
      payload?.canAttempt &&
      hasStarted &&
      !isSubmitting
    ) {
      void handleSubmit(true);
    }
  }, [
    handleSubmit,
    hasStarted,
    isSubmitting,
    payload?.canAttempt,
    timeRemaining,
  ]);

  const isCurrentQuestionAnswered = currentQuestion
    ? currentQuestion.type === "short_text"
      ? !!answerTexts[currentQuestion.id]?.trim()
      : !!selectedAnswers[currentQuestion.id]?.length
    : false;

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-border bg-card p-8 text-sm text-muted-foreground shadow-(--shadow-card)">
        Loading exam workspace...
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="rounded-[28px] border border-border bg-card p-8 text-sm text-muted-foreground shadow-(--shadow-card)">
        Final exam is not available for this course yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <CelebrationBurst activeKey={celebrationTick} />

      <div className="rounded-[28px] border border-border bg-card p-6 shadow-(--shadow-card)">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Final exam
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-card-foreground">
              {payload.exam.title}
            </h3>

            {payload.exam.description ? (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                {payload.exam.description}
              </p>
            ) : null}

            {payload.exam.instructions ? (
              <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm leading-6 text-muted-foreground">
                {payload.exam.instructions}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-90">
            <MetricCard
              label="Pass mark"
              value={`${payload.exam.passingPercentage}%`}
            />
            <MetricCard
              label="Attempts used"
              value={`${payload.attemptsUsed}`}
            />
            <MetricCard
              label="Attempts left"
              value={payload.attemptsRemaining ?? "Unlimited"}
            />
            <MetricCard label="Total marks" value={`${totalMarks}`} />
          </div>
        </div>
      </div>

      {payload.latestAttempt ? (
        <AttemptSummaryCard attempt={payload.latestAttempt} />
      ) : null}

      {!payload.isUnlocked ? (
        <div className="rounded-[28px] border border-primary/20 bg-primary/10 p-6 text-sm leading-6 text-muted-foreground shadow-(--shadow-card)">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Final exam locked
          </p>

          <h4 className="mt-2 text-lg font-semibold text-card-foreground">
            Finish the learning journey first
          </h4>

          <p className="mt-2">{payload.unlockMessage}</p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${payload.unlockProgress}%` }}
            />
          </div>

          <p className="mt-2 text-xs font-medium text-primary">
            Lecture completion: {payload.unlockProgress}%
          </p>
        </div>
      ) : payload.canAttempt ? (
        <div className="space-y-4 rounded-[28px] border border-border bg-card p-6 shadow-(--shadow-card)">
          {!hasStarted ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <div className="rounded-[24px] border border-border bg-muted/50 p-5">
                <h4 className="text-lg font-semibold text-card-foreground">
                  Read before you start
                </h4>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This assessment opens one question at a time. Read the
                  instructions first, then begin when you are ready to stay
                  focused till the final submission.
                </p>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p>1. Questions will appear one at a time.</p>
                  <p>2. Use Next and Back to move through the exam.</p>
                  <p>3. If a timer is set, it starts only after you begin.</p>
                  <p>
                    4. Your certificate unlocks only after a passing result.
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-primary/15 bg-primary/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Exam snapshot
                </p>

                <div className="mt-4 grid gap-3">
                  <MetricCard label="Questions" value={`${questions.length}`} />
                  <MetricCard
                    label="Pass mark"
                    value={`${payload.exam.passingPercentage}%`}
                  />
                  <MetricCard
                    label="Attempts left"
                    value={payload.attemptsRemaining ?? "Unlimited"}
                  />
                  {payload.exam.timeLimitMinutes ? (
                    <MetricCard
                      label="Duration"
                      value={`${payload.exam.timeLimitMinutes} min`}
                    />
                  ) : null}
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="mt-5 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setHasStarted(true);
                    setCurrentQuestionIndex(0);
                  }}
                >
                  Start exam
                </Button>
              </div>
            </div>
          ) : currentQuestion ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-card-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h4>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete this question, then move to the next one.
                  </p>
                </div>

                {payload.exam.timeLimitMinutes ? (
                  <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    {formatSeconds(
                      timeRemaining ?? payload.exam.timeLimitMinutes * 60,
                    )}
                  </div>
                ) : null}
              </div>

              <div className="rounded-[24px] border border-border bg-muted/50 p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Current question
                    </p>

                    <h5 className="mt-2 text-base font-semibold text-card-foreground">
                      {currentQuestion.prompt}
                    </h5>
                  </div>

                  <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {currentQuestion.points} mark
                    {currentQuestion.points > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {currentQuestion.type === "short_text" ? (
                    <textarea
                      value={answerTexts[currentQuestion.id] ?? ""}
                      onChange={(event) =>
                        setAnswerTexts((prev) => ({
                          ...prev,
                          [currentQuestion.id]: event.target.value,
                        }))
                      }
                      className="min-h-32 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-0 transition focus:border-primary"
                      placeholder="Write your answer in one short line or sentence."
                    />
                  ) : currentQuestion.type === "drag_drop" ? (
                    <div className="space-y-3">
                      {(selectedAnswers[currentQuestion.id] ?? []).map(
                        (optionId, orderIndex) => {
                          const option = currentQuestion.options.find(
                            (item) => item.id === optionId,
                          );

                          if (!option) return null;

                          return (
                            <div
                              key={option.id}
                              draggable
                              onDragStart={() => setDraggedOptionId(option.id)}
                              onDragEnd={() => setDraggedOptionId(null)}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={() =>
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [currentQuestion.id]: reorderItems(
                                    prev[currentQuestion.id] ?? [],
                                    draggedOptionId,
                                    option.id,
                                  ),
                                }))
                              }
                              className="flex cursor-move items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3"
                            >
                              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {orderIndex + 1}
                              </div>

                              <span className="text-sm leading-6 text-foreground">
                                {option.text}
                              </span>
                            </div>
                          );
                        },
                      )}

                      <p className="text-xs text-muted-foreground">
                        Drag items into the correct order.
                      </p>
                    </div>
                  ) : (
                    currentQuestion.options.map((option) => {
                      const selected =
                        selectedAnswers[currentQuestion.id] ?? [];
                      const checked = selected.includes(option.id);

                      return (
                        <label
                          key={option.id}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors",
                            checked
                              ? "border-primary/25 bg-primary/10"
                              : "border-border bg-background",
                          )}
                        >
                          <input
                            type={
                              currentQuestion.type === "multiple"
                                ? "checkbox"
                                : "radio"
                            }
                            name={currentQuestion.id}
                            checked={checked}
                            onChange={() =>
                              handleOptionToggle(
                                currentQuestion.id,
                                option.id,
                                currentQuestion.type,
                              )
                            }
                            className="mt-0.5 size-4 accent-primary"
                          />

                          <span className="text-sm leading-6 text-foreground">
                            {option.text}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {isCurrentQuestionAnswered
                    ? "Answer saved for this step."
                    : "Please answer this question before moving on."}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border bg-background text-foreground hover:bg-muted"
                    disabled={!canGoBack || isSubmitting}
                    onClick={() =>
                      setCurrentQuestionIndex((current) =>
                        Math.max(current - 1, 0),
                      )
                    }
                  >
                    Back
                  </Button>

                  {!isLastQuestion ? (
                    <Button
                      type="button"
                      className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={!isCurrentQuestionAnswered || isSubmitting}
                      onClick={() =>
                        setCurrentQuestionIndex((current) =>
                          Math.min(current + 1, questions.length - 1),
                        )
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="lg"
                      className="rounded-2xl bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                      disabled={!isCurrentQuestionAnswered || isSubmitting}
                      onClick={() => void handleSubmit()}
                    >
                      {isSubmitting ? "Submitting..." : "Submit final exam"}
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[28px] border border-border bg-card p-6 text-sm leading-6 text-muted-foreground shadow-(--shadow-card)">
          {payload.isPassed
            ? "You have already cleared this exam. Your certificate can now be generated from the overview tab once lecture completion is also done."
            : "You have exhausted the allowed attempts for this exam. Please contact the academy team if a retake needs to be enabled."}
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-card-foreground">{value}</p>
    </div>
  );
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function shuffleArray(items: string[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function reorderItems(
  items: string[],
  sourceId: string | null,
  targetId: string,
) {
  if (!sourceId || sourceId === targetId) {
    return items;
  }

  const next = [...items];
  const sourceIndex = next.indexOf(sourceId);
  const targetIndex = next.indexOf(targetId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return items;
  }

  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);

  return next;
}

function CelebrationBurst({ activeKey }: { activeKey: number }) {
  const pieces = useMemo(() => {
    if (!activeKey) return [];

    return Array.from({ length: 28 }, (_, index) => ({
      id: activeKey * 100 + index,
      left: (index * 13 + activeKey * 7) % 100,
      delay: ((index % 7) * 0.05 + (activeKey % 3) * 0.04) % 0.35,
      rotate: (index * 37 + activeKey * 19) % 360,
    }));
  }, [activeKey]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-80 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-[-10%] h-3 w-2 rounded-sm bg-primary opacity-90"
          style={{
            left: `${piece.left}%`,
            transform: `rotate(${piece.rotate}deg)`,
            animation: `confetti-fall 1.8s ease-in forwards`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 110vh, 0) rotate(540deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function AttemptSummaryCard({ attempt }: { attempt: CourseExamAttempt }) {
  return (
    <div className="rounded-[28px] border border-border bg-card p-6 shadow-(--shadow-card)">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Latest result
          </p>

          <h4 className="mt-2 text-xl font-semibold text-card-foreground">
            Attempt {attempt.attemptNumber}{" "}
            {attempt.passed ? "passed" : "submitted"}
          </h4>

          <p className="mt-2 text-sm text-muted-foreground">
            Score {attempt.score}/{attempt.maxScore} • {attempt.percentage}% •{" "}
            {attempt.submittedAt
              ? formatDateTime(attempt.submittedAt)
              : "Awaiting evaluation"}
          </p>
        </div>

        <div
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold",
            attempt.passed
              ? "border-primary/15 bg-primary/10 text-primary"
              : "border-border bg-muted text-muted-foreground",
          )}
        >
          {attempt.passed ? "Passed" : "Needs improvement"}
        </div>
      </div>
    </div>
  );
}
