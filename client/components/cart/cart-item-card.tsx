"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Clock3, BookOpen, BarChart3 } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/store/cart-store";
import { CartItem } from "@/types/cart";

interface CartItemCardProps {
  showRemove?: boolean;
  item: CartItem;
}

export const CartItemCard = ({ item, showRemove }: CartItemCardProps) => {
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const autoDiscount = useCartStore((state) => state.autoDiscount);
  const manualDiscount = useCartStore((state) => state.manualDiscount);
  const total = useCartStore((state) => state.totalPrice());

  const discount = autoDiscount + manualDiscount;

  const itemDiscount =
    total > 0 ? Math.round((item.price / total) * discount) : 0;

  const finalPrice = Math.max(item.price - itemDiscount, 0);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN").format(value);

  const handleRemove = () => {
    removeFromCart(item.id);
    toast.success("Removed from cart");
  };

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-blue-100 hover:shadow-[0_24px_70px_rgba(37,99,235,0.10)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] dark:hover:border-rose-200/25 dark:hover:shadow-[0_30px_90px_rgba(244,63,94,0.12)]">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* IMAGE */}
        <Link
          href={`/course/${item.slug}`}
          className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5 sm:h-32 sm:w-48"
        >
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/45 via-transparent to-transparent opacity-70" />
        </Link>

        {/* INFO */}
        <div className="min-w-0 flex-1">
          <Link href={`/course/${item.slug}`}>
            <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-slate-950 transition hover:text-blue-700 dark:text-white dark:hover:text-rose-200">
              {item.title}
            </h3>
          </Link>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            By{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {item.instructor || "Unknown Instructor"}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
              <Clock3 className="h-3.5 w-3.5 text-blue-700 dark:text-rose-200" />
              {item.totalDuration || "--"} duration
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
              <BookOpen className="h-3.5 w-3.5 text-blue-700 dark:text-rose-200" />
              {item.totalLectures || "--"} lectures
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
              <BarChart3 className="h-3.5 w-3.5 text-blue-700 dark:text-rose-200" />
              All Levels
            </span>
          </div>

          {showRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-95 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-300 dark:hover:bg-red-300/15"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          )}
        </div>

        {/* PRICE */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-t border-slate-100 pt-4 sm:min-w-28 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 dark:border-white/10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-rose-200 sm:hidden">
            Price
          </p>

          <div className="text-right">
            {discount > 0 ? (
              <>
                <p className="text-xl font-bold text-slate-950 dark:text-white">
                  ₹{formatPrice(finalPrice)}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-400 line-through dark:text-slate-500">
                  ₹{formatPrice(item.price)}
                </p>

                {itemDiscount > 0 && (
                  <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                    Saved ₹{formatPrice(itemDiscount)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xl font-bold text-slate-950 dark:text-white">
                ₹{formatPrice(item.price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
