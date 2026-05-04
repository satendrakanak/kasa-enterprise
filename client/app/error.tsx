"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  const isAuthExpired = error.message === "AUTH_EXPIRED";

  return (
    <div className="flex h-screen items-center justify-center bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_42%,#eef4ff_100%)] px-4 dark:bg-[radial-gradient(circle_at_top_left,rgba(86,114,255,0.16),transparent_24%),linear-gradient(180deg,rgba(9,16,31,0.98),rgba(15,24,43,1))]">
      <Card
        className="
          w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[rgba(11,18,32,0.98)]
          transform transition-all duration-500
          animate-in slide-in-from-top-6 fade-in zoom-in-95
        "
      >
        <CardContent className="flex flex-col items-center space-y-5 p-6 text-center">
          {/* 🔥 Icon with subtle pulse */}
          <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-red-100 dark:bg-rose-500/12">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-rose-300" />
          </div>

          {/* 🔥 Title */}
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {isAuthExpired ? "Session expired 🔒" : "Something went wrong"}
          </h2>

          {/* 🔥 Description */}
          <p className="text-sm leading-relaxed text-muted-foreground dark:text-slate-300">
            {isAuthExpired
              ? "Your session has expired. Please refresh to continue."
              : error.message || "Unexpected error occurred. Please try again."}
          </p>

          {/* 🔥 Actions */}
          <div className="flex w-full gap-3 pt-3">
            <Button
              onClick={() => reset()}
              className="flex w-full items-center gap-2 bg-[var(--brand-600)] text-white transition hover:bg-[var(--brand-700)]"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>

            {isAuthExpired ? (
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/auth/sign-in")}
                className="flex w-full items-center gap-2 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/10"
              >
                Go Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
