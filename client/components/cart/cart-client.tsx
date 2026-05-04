"use client";

import { useCartStore } from "@/store/cart-store";
import { CartItemCard } from "./cart-item-card";
import { CartSummary } from "./cart-summary";
import Container from "../container";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CartClient = () => {
  const router = useRouter();

  const cartItems = useCartStore((s) => s.cartItems);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const isEmpty = cartItems.length === 0;

  return (
    <div className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 py-12 dark:bg-[#101b2d] dark:bg-none md:py-16">
      <Container>
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
            Cart
          </p>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Review your selected courses before moving to checkout.
              </p>
            </div>
          </div>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
              <ShoppingCart className="h-10 w-10" />
            </div>

            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Your cart is empty
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              Looks like you haven’t added any courses yet. Start exploring and
              find something you love.
            </p>

            <Button
              type="button"
              onClick={() => router.push("/courses")}
              className="mt-7 h-12 rounded-full bg-blue-600 px-6 text-base font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            {/* LEFT */}
            <div className="space-y-5 lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                      Selected Courses
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {cartItems.length > 1
                        ? `${cartItems.length} courses`
                        : `${cartItems.length} course`}{" "}
                      in your cart
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
                    <ShoppingCart className="h-5 w-5" />
                  </span>
                </div>
              </div>

              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} showRemove={true} />
              ))}
            </div>

            {/* RIGHT */}
            <div className="lg:sticky lg:top-28">
              <CartSummary />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
