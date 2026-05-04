"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const start = () => {
      setActive(true);
      setProgress(18);

      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setProgress((current) => {
          if (current >= 82) return current;
          return current + Math.max(3, (84 - current) * 0.12);
        });
      }, 180);
    };

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      try {
        const nextUrl = new URL(href, window.location.origin);
        const currentUrl = new URL(window.location.href);

        if (nextUrl.origin !== currentUrl.origin) return;
        if (
          nextUrl.pathname === currentUrl.pathname &&
          nextUrl.search === currentUrl.search
        ) {
          return;
        }

        start();
      } catch {
        return;
      }
    };

    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const finishFrame = window.requestAnimationFrame(() => {
      setProgress(100);
    });

    const timeout = window.setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 240);

    if (timerRef.current) window.clearInterval(timerRef.current);

    return () => {
      window.cancelAnimationFrame(finishFrame);
      window.clearTimeout(timeout);
    };
  }, [pathname, searchParams, active]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-transparent",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className="h-full bg-[linear-gradient(90deg,var(--brand-500),#5f7bff,var(--primary))] shadow-[0_0_18px_rgba(95,123,255,0.55)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
