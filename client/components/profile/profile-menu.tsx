"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileMenuProps {
  isOwner?: boolean;
}

export function ProfileMenu({ isOwner }: ProfileMenuProps) {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", key: "dashboard" },
    { label: "My Courses", key: "my-courses" },
    { label: "Exams", key: "exams" },
    { label: "Orders", key: "orders" },
    { label: "Certificates", key: "certificates" },
    { label: "Profile", key: "profile" },
    ...(isOwner ? [{ label: "Settings", key: "settings" }] : []),
  ];

  return (
    <div className="mt-8">
      <div className="flex gap-2 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_18px_55px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        {menu.map((item) => {
          const isActive =
            pathname === `/${item.key}` || pathname.startsWith(`/${item.key}/`);

          return (
            <Link
              key={item.key}
              href={`/${item.key}`}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] dark:bg-rose-200 dark:text-black"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
