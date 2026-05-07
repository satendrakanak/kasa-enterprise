"use client";

import { Home, ShoppingCart, User2, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "@/context/session-context";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const MobileMenu = () => {
  const pathname = usePathname();
  const { user } = useSession();
  const cartItems = useCartStore((state) => state.cartItems);

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/courses", label: "Courses", icon: BookOpen },
    {
      href: "/cart",
      label: "Cart",
      icon: ShoppingCart,
      count: cartItems.length,
    },
    {
      href: user ? "/dashboard" : "/auth/sign-in",
      label: user ? "Account" : "Sign in",
      icon: User2,
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/92 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 shadow-[0_-10px_40px_-24px_rgba(15,23,42,0.3)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-full border border-border/70 bg-[color-mix(in_oklab,var(--background)_88%,white)] p-1 dark:bg-white/5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-full text-[10px] font-semibold tracking-[0.16em] uppercase text-slate-500 transition",
                isActive
                  ? "bg-[var(--brand-600)] text-white shadow-[0_16px_32px_-18px_rgba(37,99,235,0.7)]"
                  : "hover:bg-muted/80 dark:text-slate-300",
              )}
            >
              <span className="relative">
                <Icon className="size-4" />
                {item.count ? (
                  <span className="absolute -right-2.5 -top-2 inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {item.count}
                  </span>
                ) : null}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileMenu;
