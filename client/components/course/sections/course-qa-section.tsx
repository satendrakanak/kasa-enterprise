"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error-handler";
import { getUserAvatarUrl, getUserDisplayName } from "@/lib/user-avatar";
import { courseQaClientService } from "@/services/course-qa/course-qa.client";
import { Course } from "@/types/course";
import { CourseQuestion } from "@/types/course-qa";
import { useSession } from "@/context/session-context";
import { CheckCircle2, MessageCircleQuestion, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type QaEditState =
  | { type: "question"; id: number; title: string; body: string }
  | { type: "answer"; id: number; body: string }
  | null;
type QaDeleteState =
  | { type: "question"; id: number; title: string }
  | { type: "answer"; id: number; title: string }
  | null;

export function CourseQaSection({ course }: { course: Course }) {
  const [questions, setQuestions] = useState<CourseQuestion[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editState, setEditState] = useState<QaEditState>(null);
  const [deleteState, setDeleteState] = useState<QaDeleteState>(null);
  const [answerDrafts, setAnswerDrafts] = useState<Record<number, string>>({});
  const [isPending, startTransition] = useTransition();
  const { user } = useSession();

  const loadQuestions = async () => {
    try {
      const response = await courseQaClientService.getByCourse(course.id);
      setQuestions(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!course.isEnrolled) return;

    let isMounted = true;

    courseQaClientService
      .getByCourse(course.id)
      .then((response) => {
        if (isMounted) setQuestions(response.data);
      })
      .catch((error) => {
        if (isMounted) toast.error(getErrorMessage(error));
      });

    return () => {
      isMounted = false;
    };
  }, [course.id, course.isEnrolled]);

  const submitQuestion = () => {
    startTransition(async () => {
      try {
        await courseQaClientService.createQuestion(course.id, { title, body });
        setTitle("");
        setBody("");
        setDialogOpen(false);
        toast.success("Question submitted for approval");
        await loadQuestions();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const submitAnswer = (questionId: number) => {
    startTransition(async () => {
      try {
        await courseQaClientService.createAnswer(questionId, {
          body: answerDrafts[questionId] || "",
        });
        setAnswerDrafts((current) => ({ ...current, [questionId]: "" }));
        toast.success("Answer submitted for approval");
        await loadQuestions();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const submitEdit = () => {
    if (!editState) return;
    startTransition(async () => {
      try {
        if (editState.type === "question") {
          await courseQaClientService.updateQuestion(editState.id, {
            title: editState.title,
            body: editState.body,
          });
          toast.success("Question updated and sent for approval");
        } else {
          await courseQaClientService.updateAnswer(editState.id, {
            body: editState.body,
          });
          toast.success("Answer updated and sent for approval");
        }
        setEditState(null);
        await loadQuestions();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const submitDelete = () => {
    if (!deleteState) return;
    startTransition(async () => {
      try {
        if (deleteState.type === "question") {
          await courseQaClientService.deleteQuestion(deleteState.id);
          toast.success("Question deleted");
        } else {
          await courseQaClientService.deleteAnswer(deleteState.id);
          toast.success("Answer deleted");
        }
        setDeleteState(null);
        await loadQuestions();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  if (!course.isEnrolled) return null;

  return (
    <section className="rounded-[28px] border border-[var(--brand-100)] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[var(--brand-50)] p-3 text-[var(--brand-700)]">
            <MessageCircleQuestion className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">
              Course Q&A
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Browse approved questions from enrolled learners and ask your own
              doubt from the button.
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-primary/15">
              <MessageCircleQuestion className="h-4 w-4" />
              Add your question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Ask a course question</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Short question title"
              />
              <Textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="min-h-32"
                placeholder="Explain what you need help with..."
              />
              <Button
                type="button"
                className="w-full rounded-full"
                disabled={isPending}
                onClick={submitQuestion}
              >
                {isPending ? "Posting..." : "Submit for approval"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {questions.length ? (
          questions.map((question) => (
            <article
              key={question.id}
              className="rounded-3xl border border-slate-200 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-950">
                    {question.title}
                  </h4>
                  <AuthorLine user={question.user} label="Asked by" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!question.isPublished ? (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Waiting for approval
                    </span>
                  ) : null}
                  {question.isResolved ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Resolved
                    </span>
                  ) : null}
                  {question.user.id === user?.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditState({
                            type: "question",
                            id: question.id,
                            title: question.title,
                            body: question.body,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDeleteState({
                            type: "question",
                            id: question.id,
                            title: question.title,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {question.body}
              </p>

              <div className="mt-4 space-y-3">
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="rounded-2xl bg-slate-50 p-4 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <AuthorLine user={answer.user} label="Answered by" small />
                      <div className="flex flex-wrap items-center gap-2">
                        {!answer.isPublished ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            Waiting approval
                          </span>
                        ) : null}
                        {answer.isAccepted ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            Accepted
                          </span>
                        ) : null}
                        {answer.user.id === user?.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setEditState({
                                  type: "answer",
                                  id: answer.id,
                                  body: answer.body,
                                })
                              }
                              className="text-slate-500 hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteState({
                                  type: "answer",
                                  id: answer.id,
                                  title: question.title,
                                })
                              }
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-2 leading-6 text-slate-600">
                      {answer.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Textarea
                  value={answerDrafts[question.id] || ""}
                  onChange={(event) =>
                    setAnswerDrafts((current) => ({
                      ...current,
                      [question.id]: event.target.value,
                    }))
                  }
                  placeholder="Write an answer..."
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  disabled={isPending}
                  onClick={() => submitAnswer(question.id)}
                >
                  Reply
                </Button>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-3xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
            No questions yet. Ask the first question for this course.
          </p>
        )}
      </div>

      <Dialog
        open={!!editState}
        onOpenChange={(open) => {
          if (!open) setEditState(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Edit {editState?.type === "question" ? "question" : "answer"}
            </DialogTitle>
          </DialogHeader>
          {editState ? (
            <div className="space-y-3">
              {editState.type === "question" ? (
                <Input
                  value={editState.title}
                  onChange={(event) =>
                    setEditState({ ...editState, title: event.target.value })
                  }
                  placeholder="Question title"
                />
              ) : null}
              <Textarea
                value={editState.body}
                onChange={(event) =>
                  setEditState({ ...editState, body: event.target.value })
                }
                className="min-h-32"
                placeholder="Write details..."
              />
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditState(null)}>
              Cancel
            </Button>
            <Button disabled={isPending} onClick={submitEdit}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteState}
        onOpenChange={(open) => {
          if (!open) setDeleteState(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {deleteState?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove “{deleteState?.title}”. You cannot undo this
              action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={submitDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function AuthorLine({
  user,
  label,
  small = false,
}: {
  user: CourseQuestion["user"];
  label: string;
  small?: boolean;
}) {
  const name = getUserDisplayName(user);

  return (
    <div className="mt-2 flex items-center gap-2">
      <Avatar className={small ? "h-7 w-7" : "h-9 w-9"}>
        <AvatarImage src={getUserAvatarUrl(user)} alt={name} />
        <AvatarFallback className="bg-[var(--brand-50)] text-[var(--brand-700)]">
          {name.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <p className={small ? "text-xs text-slate-500" : "text-sm text-slate-500"}>
        {label} <span className="font-semibold text-slate-800">{name}</span>
      </p>
    </div>
  );
}
