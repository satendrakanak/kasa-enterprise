"use client";

import MenuItem from "@/components/header/menu-item";
import { navbarItems } from "@/data/menu";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { WebsiteNavUser } from "@/components/auth/website-nav-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const MobileMenuItems = () => {
  return (
    <nav className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-border/70 px-5 pb-5 pt-6">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <ThemeToggle compact />
        </div>

        <div className="mt-5 flex items-center justify-between rounded-[24px] border border-border/70 bg-[color-mix(in_oklab,var(--brand-50)_60%,white)] p-3 dark:bg-white/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)] dark:text-[var(--brand-300)]">
              Learning Hub
            </p>
            <p className="mt-1 max-w-40 text-sm text-slate-600 dark:text-slate-300">
              Explore programs, articles, faculty, and more.
            </p>
          </div>
          <WebsiteNavUser />
        </div>
      </div>

      <div className="flex flex-col gap-1 px-3 py-4">
        {navbarItems.map((item) => (
          <MenuItem key={item.label} label={item.label} href={item.href} />
        ))}
      </div>

      <div className="mt-auto border-t border-border/70 p-5">
        <Button
          asChild
          className="h-11 w-full rounded-full bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]"
        >
          <Link href="/courses">Explore Courses</Link>
        </Button>
      </div>
    </nav>
  );
};
