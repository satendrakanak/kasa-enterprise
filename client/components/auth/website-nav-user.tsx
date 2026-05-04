"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  Loader,
  LogOut,
  ReceiptText,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/session-context";
import { apiClient } from "@/lib/api/client";
import { getErrorMessage } from "@/lib/error-handler";
import { getUserAvatarUrl } from "@/lib/user-avatar";

export const WebsiteNavUser = () => {
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Button
        asChild
        variant="ghost"
        aria-label="Sign in"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white p-0 text-slate-700 shadow-sm backdrop-blur transition hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-rose-200 dark:hover:text-black"
      >
        <Link href="/auth/sign-in">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  const avatarUrl = getUserAvatarUrl(user);

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const handleLogout = async () => {
    try {
      setLoading(true);

      await apiClient.post("/api/auth/sign-out");

      router.refresh();
      router.push("/auth/sign-in");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Open user menu"
          className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white p-0 shadow-sm backdrop-blur transition hover:border-blue-100 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600/20 dark:border-white/10 dark:bg-white/10 dark:hover:border-rose-200/25 dark:hover:bg-white/15 dark:focus-visible:ring-rose-200/20"
        >
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 opacity-0 blur transition group-hover:opacity-20 dark:from-rose-200 dark:to-pink-300 dark:group-hover:opacity-25" />

          <Avatar className="relative h-9 w-9 border border-white/70 dark:border-white/10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={fullName || user.firstName} />
            ) : null}

            <AvatarFallback className="bg-blue-50 text-sm font-bold text-blue-700 dark:bg-[#0b1628] dark:text-rose-200">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72 rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_28px_90px_rgba(0,0,0,0.48)]"
      >
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3 dark:border-rose-200/20 dark:bg-rose-200/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border border-white shadow-sm dark:border-white/10">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={fullName || user.firstName} />
              ) : null}

              <AvatarFallback className="bg-white text-sm font-bold text-blue-700 dark:bg-white/10 dark:text-rose-200">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                {fullName || "User"}
              </p>

              <p
                title={user.email}
                className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-300"
              >
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-white/10" />

        <DropdownMenuGroup className="space-y-1">
          <NavMenuItem
            href="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <NavMenuItem href="/profile" icon={User} label="Profile" />
          <NavMenuItem href="/my-courses" icon={BookOpen} label="My Courses" />
          <NavMenuItem href="/exams" icon={ClipboardCheck} label="Exams" />
          <NavMenuItem href="/orders" icon={ReceiptText} label="Orders" />
          <NavMenuItem href="/certificates" icon={Award} label="Certificates" />
          <NavMenuItem href="/settings" icon={Settings} label="Settings" />
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-white/10" />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={loading}
          className="flex h-11 cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-red-600 transition focus:bg-red-50 focus:text-red-700 disabled:cursor-not-allowed disabled:opacity-70 dark:text-red-300 dark:focus:bg-red-300/10 dark:focus:text-red-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-300/10 dark:text-red-300">
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </span>

          {loading ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function NavMenuItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
}) {
  return (
    <DropdownMenuItem asChild>
      <Link
        href={href}
        className="flex h-11 cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-slate-700 transition focus:bg-blue-50 focus:text-blue-700 dark:text-slate-200 dark:focus:bg-white/10 dark:focus:text-white"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-blue-700 ring-1 ring-slate-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <Icon className="h-4 w-4" />
        </span>

        <span>{label}</span>
      </Link>
    </DropdownMenuItem>
  );
}
