"use client";

import dynamic from "next/dynamic";

import { Coupon } from "@/types/coupon";

const CouponsList = dynamic(
  () => import("./coupons-list").then((mod) => mod.CouponsList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-[28px] border border-slate-100 bg-slate-100/70" />
        <div className="h-96 animate-pulse rounded-[28px] border border-slate-100 bg-white" />
      </div>
    ),
  },
);

export function CouponsListLoader({ coupons }: { coupons: Coupon[] }) {
  return <CouponsList coupons={coupons} />;
}
