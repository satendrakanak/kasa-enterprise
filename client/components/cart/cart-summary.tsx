"use client";

import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { CouponApplyBox } from "../coupon/coupon-apply-box";

export const CartSummary = () => {
  const {
    cartItems,
    autoDiscount,
    manualDiscount,
    finalAmount,
    autoCoupon,
    manualCoupon,
    applyManualCoupon,
    removeCoupon,
  } = useCartStore();

  const originalTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const totalDiscount = autoDiscount + manualDiscount;
  const finalTotal = Math.max(
    totalDiscount > 0 ? finalAmount : originalTotal,
    0,
  );

  const gstRate = 0.18;
  const baseAmount = Math.round(finalTotal / (1 + gstRate));
  const gstAmount = finalTotal - baseAmount;

  const format = (value: number) =>
    new Intl.NumberFormat("en-IN").format(value);

  const isEmpty = cartItems.length === 0;

  return (
    <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_28px_90px_rgba(0,0,0,0.42)] md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-white/10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
            Order Summary
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
            Cart Summary
          </h2>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <Sparkles className="h-5 w-5" />
        </span>
      </div>

      <div className="space-y-3">
        {totalDiscount > 0 && (
          <SummaryRow
            label="Original Price"
            value={`₹${format(originalTotal)}`}
            muted
            strike
          />
        )}

        {autoDiscount > 0 && (
          <SummaryRow
            label={`Best offer applied 🎉${autoCoupon ? ` (${autoCoupon})` : ""}`}
            value={`-₹${format(autoDiscount)}`}
            accent="blue"
          />
        )}

        {manualDiscount > 0 && (
          <SummaryRow
            label={`Coupon${manualCoupon ? ` (${manualCoupon})` : ""}`}
            value={`-₹${format(manualDiscount)}`}
            accent="green"
          />
        )}

        {totalDiscount > 0 && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-300/20 dark:bg-emerald-300/10">
            <SummaryRow
              label="You Saved"
              value={`-₹${format(totalDiscount)}`}
              accent="green"
              strong
              noPadding
            />
          </div>
        )}

        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-white/10">
          <SummaryRow
            label="Subtotal (excl. GST)"
            value={`₹${format(baseAmount)}`}
          />

          <SummaryRow label="GST (18%)" value={`₹${format(gstAmount)}`} />

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
            <span className="text-base font-semibold text-slate-950 dark:text-white">
              Total
            </span>

            <span className="text-2xl font-bold text-slate-950 dark:text-white">
              ₹{format(finalTotal)}
            </span>
          </div>

          <p className="text-right text-xs text-slate-500 dark:text-slate-400">
            GST is included in the total amount.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]">
        <CouponApplyBox
          appliedCoupon={manualCoupon}
          onApply={applyManualCoupon}
          onRemove={removeCoupon}
        />
      </div>

      <Link href="/checkout" className="mt-5 block">
        <Button
          disabled={isEmpty}
          className="h-12 w-full rounded-full bg-blue-600 text-base font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
        >
          Proceed to Checkout →
        </Button>
      </Link>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-center dark:border-white/10 dark:bg-[#0b1628]">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-rose-200">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          30-Day Money-Back Guarantee
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Not satisfied? Get a full refund within 30 days.
        </p>
      </div>
    </aside>
  );
};

function SummaryRow({
  label,
  value,
  muted = false,
  strike = false,
  strong = false,
  accent,
  noPadding = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strike?: boolean;
  strong?: boolean;
  accent?: "blue" | "green";
  noPadding?: boolean;
}) {
  const accentClass =
    accent === "blue"
      ? "text-blue-700 dark:text-rose-200"
      : accent === "green"
        ? "text-emerald-700 dark:text-emerald-300"
        : "text-slate-700 dark:text-slate-300";

  return (
    <div
      className={`flex items-start justify-between gap-4 ${
        noPadding ? "" : "text-sm"
      }`}
    >
      <span
        className={`leading-6 ${
          muted
            ? "text-slate-400 dark:text-slate-500"
            : strong
              ? "font-semibold text-slate-950 dark:text-white"
              : "text-slate-600 dark:text-slate-400"
        }`}
      >
        {label}
      </span>

      <span
        className={`shrink-0 text-right font-semibold ${accentClass} ${
          strike ? "line-through" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
