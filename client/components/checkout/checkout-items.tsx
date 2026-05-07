"use client";

import { ShoppingBag } from "lucide-react";

import { useCartStore } from "@/store/cart-store";
import { CartItemCard } from "../cart/cart-item-card";

export const CheckoutItems = () => {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <section className="academy-card p-5 md:p-6">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Order Details
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {cartItems.length > 1
              ? `${cartItems.length} courses`
              : `${cartItems.length} course`}{" "}
            selected for checkout.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
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
