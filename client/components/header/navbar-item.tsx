"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface NavbarItemProps {
  item: {
    label: string;
    href: string;
    hasChild?: boolean;
    children?: {
      label: string;
      href: string;
    }[];
  };
}

const NavbarItem = ({ item }: NavbarItemProps) => {
  const pathname = usePathname();

  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname?.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full px-4 text-sm font-semibold transition-all duration-300 xl:px-5",
        "text-slate-700 hover:bg-blue-50 hover:text-blue-700",
        "dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white",
        isActive &&
          "bg-blue-600 text-white shadow-[0_14px_35px_rgba(37,99,235,0.28)] hover:bg-blue-600 hover:text-white dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300 dark:hover:text-black",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
          "bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.35),transparent_62%)]",
          isActive && "opacity-100",
        )}
      />

      <span className="relative z-10">{item.label}</span>
    </Link>
  );
};

export default NavbarItem;
