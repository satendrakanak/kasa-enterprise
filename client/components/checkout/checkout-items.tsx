"use client";

import { ShoppingBag } from "lucide-react";

import { useCartStore } from "@/store/cart-store";
import { CartItemCard } from "../cart/cart-item-card";

export const CheckoutItems = () => {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-white/10">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Order Details
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {cartItems.length > 1
              ? `${cartItems.length} courses`
              : `${cartItems.length} course`}{" "}
            selected for checkout.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <ShoppingBag className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-5">
        {cartItems.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
