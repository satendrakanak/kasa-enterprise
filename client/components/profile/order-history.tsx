"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BadgeAlert,
  CircleCheckBig,
  CreditCard,
  FileClock,
  HandCoins,
  RotateCcw,
} from "lucide-react";

import {
  Order,
  OrderStatus,
  RefundRequest,
  RefundRequestStatus,
} from "@/types/order";
import { Course } from "@/types/course";
import { CourseProgressBar } from "@/components/courses/course-progress-bar";
import { RefundRequestDialog } from "./refunds/refund-request-dialog";
import { RefundTimeline } from "@/components/refunds/refund-timeline";

interface OrderHistoryProps {
  orders: Order[];
  enrolledCourses?: Course[];
  limit?: number;
  showViewAll?: boolean;
}

const REFUND_WINDOW_DAYS = 7;
const MAX_REFUND_PROGRESS = 20;

export function OrderHistory({
  orders,
  enrolledCourses = [],
  limit,
  showViewAll = false,
}: OrderHistoryProps) {
  const [refundDialogOrderId, setRefundDialogOrderId] = useState<number | null>(
    null,
  );

  const visibleOrders =
    typeof limit === "number" ? orders.slice(0, limit) : orders;

  const enrolledCourseMap = useMemo(
    () => new Map(enrolledCourses.map((course) => [course.id, course])),
    [enrolledCourses],
  );

  const latestRefundMap = useMemo(
    () =>
      new Map(
        visibleOrders.map((order) => [
          order.id,
          getLatestRefundRequest(order.refundRequests || []),
        ]),
      ),
    [visibleOrders],
  );

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
            Purchase History
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            Recent Orders
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Track purchases, applied coupons, payment retries, and refund
            status.
          </p>
        </div>

        {showViewAll ? (
          <Link
            href="/orders"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
          >
            View all orders
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      {visibleOrders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-5">
          {visibleOrders.map((order) => {
            const primaryItem = order.items?.[0];
            const latestRefundRequest = latestRefundMap.get(order.id) || null;

            const enrolledCourse = primaryItem?.course
              ? enrolledCourseMap.get(primaryItem.course.id)
              : null;

            const courseProgress = enrolledCourse?.progress?.progress || 0;

            const refundEligibleTill = new Date(order.createdAt);
            refundEligibleTill.setDate(
              refundEligibleTill.getDate() + REFUND_WINDOW_DAYS,
            );

            const isWithinRefundWindow = new Date() <= refundEligibleTill;
            const isProgressAllowedForRefund =
              courseProgress <= MAX_REFUND_PROGRESS;

            const canRetry =
              order.status === OrderStatus.CANCELLED ||
              order.status === OrderStatus.FAILED;

            const canRequestRefund =
              [OrderStatus.PAID, OrderStatus.REFUND_FAILED].includes(
                order.status,
              ) &&
              isWithinRefundWindow &&
              isProgressAllowedForRefund &&
              (!latestRefundRequest ||
                [
                  RefundRequestStatus.REJECTED,
                  RefundRequestStatus.FAILED,
                ].includes(latestRefundRequest.status));

            const course = primaryItem?.course
              ? {
                  ...primaryItem.course,
                  isEnrolled: Boolean(enrolledCourse?.isEnrolled),
                  progress:
                    enrolledCourse?.progress || primaryItem.course.progress,
                }
              : null;

            const couponCode =
              order.manualCouponCode || order.autoCouponCode || null;

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
              >
                <div className="space-y-5 p-5 md:p-6">
                  {/* TOP */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold text-slate-950 dark:text-white">
                          Order #{order.id}
                        </h4>

                        <OrderStatusPill status={order.status} />
                      </div>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left dark:border-white/10 dark:bg-[#0b1628] md:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Total Paid
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                        ₹{formatPrice(Number(order.totalAmount || 0))}
                      </p>
                    </div>
                  </div>

                  {/* COURSE + DETAILS */}
                  <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
                      {course ? (
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <Link
                            href={`/course/${course.slug}`}
                            className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 sm:h-28 sm:w-32"
                          >
                            <Image
                              src={course.image?.path || "/assets/default.png"}
                              alt={course.imageAlt || course.title}
                              fill
                              sizes="128px"
                              className="object-cover transition duration-500 hover:scale-105"
                            />
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                              <div className="min-w-0">
                                <Link
                                  href={`/course/${course.slug}`}
                                  className="line-clamp-2 text-lg font-semibold leading-7 text-slate-950 transition hover:text-blue-700 dark:text-white dark:hover:text-rose-200"
                                >
                                  {course.title}
                                </Link>

                                <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                  {course.shortDescription ||
                                    "Purchased course from your learning dashboard."}
                                </p>
                              </div>

                              <p className="shrink-0 text-sm font-bold text-slate-800 dark:text-slate-100">
                                ₹{formatPrice(Number(primaryItem.price || 0))}
                              </p>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {course.experienceLevel ? (
                                <Tag>{course.experienceLevel}</Tag>
                              ) : null}

                              {course.language ? (
                                <Tag>{course.language}</Tag>
                              ) : null}

                              {course.isEnrolled ? (
                                <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300">
                                  Enrolled
                                </span>
                              ) : null}
                            </div>

                            {course.isEnrolled ? (
                              <div className="mt-4 max-w-sm">
                                <CourseProgressBar
                                  percent={course.progress?.progress || 0}
                                  slug={course.slug}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-white/10 dark:bg-[#07111f] dark:text-slate-400">
                          Course details are not available for this order.
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-rose-200">
                        Order Details
                      </p>

                      <div className="space-y-3">
                        <InfoLine
                          label="Items"
                          value={`${order.items?.length || 0} course${
                            (order.items?.length || 0) > 1 ? "s" : ""
                          }`}
                        />

                        {couponCode ? (
                          <InfoLine label="Coupon" value={couponCode} accent />
                        ) : (
                          <InfoLine label="Coupon" value="No coupon applied" />
                        )}

                        <InfoLine
                          label="Payment"
                          value={canRetry ? "Needs retry" : "Completed"}
                        />

                        {latestRefundRequest ? (
                          <InfoLine
                            label="Refund"
                            value={latestRefundRequest.status}
                            accent
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5 dark:border-white/10">
                    {course?.isEnrolled ? (
                      <Link
                        href={`/course/${course.slug}/learn`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.18)] transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
                      >
                        <CircleCheckBig className="h-4 w-4" />
                        Continue Learning
                      </Link>
                    ) : null}

                    {canRetry ? (
                      <Link
                        href={`/checkout?retryOrderId=${order.id}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.18)] transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
                      >
                        <CreditCard className="h-4 w-4" />
                        Retry Payment
                      </Link>
                    ) : null}

                    {canRequestRefund ? (
                      <button
                        type="button"
                        onClick={() => setRefundDialogOrderId(order.id)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Request Refund
                      </button>
                    ) : null}

                    {latestRefundRequest ? (
                      <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 text-sm font-semibold text-violet-700 dark:border-violet-300/20 dark:bg-violet-300/10 dark:text-violet-200">
                        <FileClock className="h-4 w-4" />
                        Refund {latestRefundRequest.status}
                      </span>
                    ) : null}

                    {!canRequestRefund &&
                    !latestRefundRequest &&
                    order.status === OrderStatus.PAID ? (
                      <RefundBlockedNote
                        isWithinRefundWindow={isWithinRefundWindow}
                        isProgressAllowedForRefund={isProgressAllowedForRefund}
                      />
                    ) : null}
                  </div>

                  {latestRefundRequest ? (
                    <RefundTimeline refundRequest={latestRefundRequest} />
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <RefundRequestDialog
        open={Boolean(refundDialogOrderId)}
        orderId={refundDialogOrderId || 0}
        onOpenChange={(open) => {
          if (!open) setRefundDialogOrderId(null);
        }}
      />
    </section>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#07111f]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
        <BadgeAlert className="h-8 w-8" />
      </div>

      <h4 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">
        No orders yet
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
        Once you purchase a course, the complete order trail will appear here.
      </p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
      {children}
    </span>
  );
}

function InfoLine({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 dark:border-white/10">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span
        className={`text-right text-sm font-semibold ${
          accent
            ? "text-blue-700 dark:text-rose-200"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function OrderStatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${getOrderStatusClass(
        status,
      )}`}
    >
      {String(status).replaceAll("_", " ")}
    </span>
  );
}

function RefundBlockedNote({
  isWithinRefundWindow,
  isProgressAllowedForRefund,
}: {
  isWithinRefundWindow: boolean;
  isProgressAllowedForRefund: boolean;
}) {
  if (isWithinRefundWindow && isProgressAllowedForRefund) return null;

  return (
    <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
      <AlertCircle className="h-4 w-4" />
      {!isWithinRefundWindow
        ? "Refund window closed"
        : "Progress exceeds refund limit"}
    </span>
  );
}

function getLatestRefundRequest(refundRequests: RefundRequest[]) {
  if (!refundRequests.length) return null;

  return [...refundRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
}

function formatDate(value?: string | Date | null) {
  if (!value) return "NA";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getOrderStatusClass(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PAID:
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-300";

    case OrderStatus.FAILED:
      return "bg-red-50 text-red-700 dark:bg-red-300/10 dark:text-red-300";

    case OrderStatus.CANCELLED:
      return "bg-amber-50 text-amber-700 dark:bg-amber-300/10 dark:text-amber-300";

    case OrderStatus.REFUNDED:
      return "bg-sky-50 text-sky-700 dark:bg-sky-300/10 dark:text-sky-300";

    case OrderStatus.REFUND_REQUESTED:
    case OrderStatus.REFUND_APPROVED:
    case OrderStatus.REFUND_PROCESSING:
      return "bg-violet-50 text-violet-700 dark:bg-violet-300/10 dark:text-violet-200";

    case OrderStatus.REFUND_REJECTED:
    case OrderStatus.REFUND_FAILED:
      return "bg-orange-50 text-orange-700 dark:bg-orange-300/10 dark:text-orange-300";

    default:
      return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
  }
}
