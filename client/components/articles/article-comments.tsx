"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getErrorMessage } from "@/lib/error-handler";
import { getUserAvatarUrl, getUserDisplayName } from "@/lib/user-avatar";
import { articleCommentClientService } from "@/services/article-comments/article-comment.client";
import { ArticleComment } from "@/types/article-comment";
import { useSession } from "@/context/session-context";
import {
  Heart,
  MessageCircle,
  Pencil,
  Reply,
  Trash2,
  Send,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function ArticleComments({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [content, setContent] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDrafts, setEditDrafts] = useState<Record<number, string>>({});
  const [isPending, startTransition] = useTransition();
  const { user } = useSession();

  const isOwner = (comment: ArticleComment) => comment.user.id === user?.id;

  const loadComments = async () => {
    try {
      const [publicResponse, mineResponse] = await Promise.all([
        articleCommentClientService.getByArticle(articleId),
        user
          ? articleCommentClientService
              .getMineByArticle(articleId)
              .catch(() => null)
          : Promise.resolve(null),
      ]);

      setComments(mergeComments(publicResponse.data, mineResponse?.data || []));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      articleCommentClientService.getByArticle(articleId),
      user
        ? articleCommentClientService
            .getMineByArticle(articleId)
            .catch(() => null)
        : Promise.resolve(null),
    ])
      .then(([publicResponse, mineResponse]) => {
        if (!isMounted) return;

        setComments(
          mergeComments(publicResponse.data, mineResponse?.data || []),
        );
      })
      .catch((error) => {
        if (isMounted) toast.error(getErrorMessage(error));
      });

    return () => {
      isMounted = false;
    };
  }, [articleId, user]);

  const submitComment = () => {
    if (!content.trim()) {
      toast.error("Please write a comment first");
      return;
    }

    startTransition(async () => {
      try {
        await articleCommentClientService.create(articleId, {
          content: content.trim(),
        });

        setContent("");
        toast.success("Comment submitted for approval");
        await loadComments();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const submitReply = (commentId: number) => {
    const replyContent = replyDrafts[commentId]?.trim();

    if (!replyContent) {
      toast.error("Please write a reply first");
      return;
    }

    startTransition(async () => {
      try {
        await articleCommentClientService.reply(commentId, {
          content: replyContent,
        });

        setReplyDrafts((current) => ({ ...current, [commentId]: "" }));
        setOpenReplies((current) => ({ ...current, [commentId]: false }));

        toast.success("Reply submitted for approval");
        await loadComments();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const updateComment = (commentId: number) => {
    const updatedContent = editDrafts[commentId]?.trim();

    if (!updatedContent) {
      toast.error("Comment cannot be empty");
      return;
    }

    startTransition(async () => {
      try {
        await articleCommentClientService.update(commentId, {
          content: updatedContent,
        });

        setEditingId(null);
        toast.success("Comment updated and sent for approval");
        await loadComments();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const deleteComment = (commentId: number) => {
    startTransition(async () => {
      try {
        await articleCommentClientService.delete(commentId);

        toast.success("Comment deleted");
        await loadComments();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const toggleLike = (commentId: number) => {
    startTransition(async () => {
      try {
        await articleCommentClientService.toggleLike(commentId);
        await loadComments();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5 dark:border-white/10">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <MessageCircle className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Comments & Discussion
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Share your thoughts, like helpful comments, and reply to readers.
          </p>
        </div>
      </div>

      {/* COMMENT FORM */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a thoughtful comment..."
          className="min-h-28 resize-none border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#07111f] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-rose-200"
        />

        <Button
          type="button"
          disabled={isPending}
          onClick={submitComment}
          className="mt-3 rounded-full bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
        >
          <Send className="h-4 w-4" />
          {isPending ? "Posting..." : "Post comment"}
        </Button>
      </div>

      {/* COMMENTS LIST */}
      <div className="mt-6 space-y-4">
        {comments.length ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-3xl border border-slate-100 bg-white p-4 transition hover:border-blue-100 hover:bg-blue-50/40 dark:border-white/10 dark:bg-[#0b1628] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.045]"
            >
              <CommentNode
                comment={comment}
                level={0}
                isPending={isPending}
                replyDrafts={replyDrafts}
                openReplies={openReplies}
                onToggleLike={toggleLike}
                onToggleReply={(commentId) =>
                  setOpenReplies((current) => ({
                    ...current,
                    [commentId]: !current[commentId],
                  }))
                }
                onReplyChange={(commentId, value) =>
                  setReplyDrafts((current) => ({
                    ...current,
                    [commentId]: value,
                  }))
                }
                onSubmitReply={submitReply}
                editingId={editingId}
                editDrafts={editDrafts}
                getCanEdit={isOwner}
                onStartEdit={(currentComment) => {
                  setEditingId(currentComment.id);
                  setEditDrafts((current) => ({
                    ...current,
                    [currentComment.id]: currentComment.content,
                  }));
                }}
                onEditChange={(commentId, value) =>
                  setEditDrafts((current) => ({
                    ...current,
                    [commentId]: value,
                  }))
                }
                onUpdate={updateComment}
                onDelete={deleteComment}
                onCancelEdit={() => setEditingId(null)}
              />
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center dark:border-white/10 dark:bg-[#0b1628]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-rose-200">
              <MessageCircle className="h-6 w-6" />
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              No comments yet
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Start the discussion by posting the first comment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function CommentNode({
  comment,
  level,
  isPending,
  replyDrafts,
  openReplies,
  onToggleLike,
  onToggleReply,
  onReplyChange,
  onSubmitReply,
  editingId,
  editDrafts,
  getCanEdit,
  onStartEdit,
  onEditChange,
  onUpdate,
  onDelete,
  onCancelEdit,
}: {
  comment: ArticleComment;
  level: number;
  isPending: boolean;
  replyDrafts: Record<number, string>;
  openReplies: Record<number, boolean>;
  onToggleLike: (commentId: number) => void;
  onToggleReply: (commentId: number) => void;
  onReplyChange: (commentId: number, value: string) => void;
  onSubmitReply: (commentId: number) => void;
  editingId: number | null;
  editDrafts: Record<number, string>;
  getCanEdit: (comment: ArticleComment) => boolean;
  onStartEdit: (comment: ArticleComment) => void;
  onEditChange: (commentId: number, value: string) => void;
  onUpdate: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onCancelEdit: () => void;
}) {
  const canManage = getCanEdit(comment);
  const isEditing = editingId === comment.id;
  const replies = comment.replies || [];
  const likeCount = comment.likedBy?.length || 0;

  return (
    <div
      className={
        level ? "mt-4 border-l border-slate-200 pl-4 dark:border-white/10" : ""
      }
    >
      <div
        className={
          level
            ? "rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#07111f]"
            : ""
        }
      >
        <CommentHeader comment={comment} />

        {!comment.isPublished ? (
          <p className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-300">
            Waiting for admin approval
          </p>
        ) : null}

        {isEditing ? (
          <div className="mt-4">
            <Textarea
              value={editDrafts[comment.id] || ""}
              onChange={(event) => onEditChange(comment.id, event.target.value)}
              className="min-h-24 resize-none border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-rose-200"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => onUpdate(comment.id)}
                disabled={isPending}
                className="rounded-full bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
              >
                Save
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={onCancelEdit}
                className="rounded-full border-slate-200 bg-white px-4 font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {comment.content}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleLike(comment.id)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-70 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:border-rose-200/20 dark:hover:bg-rose-200/10 dark:hover:text-rose-200"
          >
            <Heart className="h-4 w-4" />
            {likeCount}
          </button>

          <button
            type="button"
            onClick={() => onToggleReply(comment.id)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-70 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:border-rose-200/20 dark:hover:bg-rose-200/10 dark:hover:text-rose-200"
          >
            <Reply className="h-4 w-4" />
            Reply
          </button>

          {canManage ? (
            <>
              <button
                type="button"
                onClick={() => onStartEdit(comment)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-70 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:border-rose-200/20 dark:hover:bg-rose-200/10 dark:hover:text-rose-200"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-70 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-300 dark:hover:bg-red-300/15"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          ) : null}
        </div>

        {openReplies[comment.id] ? (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
            <Textarea
              value={replyDrafts[comment.id] || ""}
              onChange={(event) =>
                onReplyChange(comment.id, event.target.value)
              }
              placeholder="Reply to this comment..."
              className="min-h-24 resize-none border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#07111f] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-rose-200"
            />

            <Button
              type="button"
              className="mt-3 rounded-full bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
              disabled={isPending}
              onClick={() => onSubmitReply(comment.id)}
            >
              <Reply className="h-4 w-4" />
              Post reply
            </Button>
          </div>
        ) : null}

        {replies.length > 0 && (
          <div className="mt-4">
            {replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply}
                level={level + 1}
                isPending={isPending}
                replyDrafts={replyDrafts}
                openReplies={openReplies}
                onToggleLike={onToggleLike}
                onToggleReply={onToggleReply}
                onReplyChange={onReplyChange}
                onSubmitReply={onSubmitReply}
                editingId={editingId}
                editDrafts={editDrafts}
                getCanEdit={getCanEdit}
                onStartEdit={onStartEdit}
                onEditChange={onEditChange}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onCancelEdit={onCancelEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CommentHeader({ comment }: { comment: ArticleComment }) {
  const name = getUserDisplayName(comment.user);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/10">
        <AvatarImage src={getUserAvatarUrl(comment.user)} alt={name} />

        <AvatarFallback className="bg-blue-50 font-semibold text-blue-700 dark:bg-white/10 dark:text-rose-200">
          {name.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-950 dark:text-white">
          {name}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(comment.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

function mergeComments(
  publicComments: ArticleComment[],
  mine: ArticleComment[],
) {
  const map = new Map<number, ArticleComment>();

  const add = (comment: ArticleComment) => {
    map.set(comment.id, {
      ...comment,
      replies: comment.replies?.map((reply) => ({ ...reply })) || [],
    });

    comment.replies?.forEach(add);
  };

  publicComments.forEach(add);

  const roots = publicComments.map((comment) => map.get(comment.id)!);

  mine.forEach((comment) => {
    if (map.has(comment.id)) return;

    const nextComment = { ...comment, replies: [] };
    map.set(comment.id, nextComment);

    const parentId = comment.parent?.id;
    const parent = parentId ? map.get(parentId) : null;

    if (parent) {
      parent.replies = [...(parent.replies || []), nextComment];
    } else {
      roots.unshift(nextComment);
    }
  });

  return roots;
}
