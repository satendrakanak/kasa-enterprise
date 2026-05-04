"use client";

import dynamic from "next/dynamic";

import { Order } from "@/types/order";

const OrdersList = dynamic(
  () => import("./orders-list").then((mod) => mod.OrdersList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-[28px] border border-slate-100 bg-slate-100/70" />
        <div className="h-96 animate-pulse rounded-[28px] border border-slate-100 bg-white" />
      </div>
    ),
  },
);

export function OrdersListLoader({ orders }: { orders: Order[] }) {
  return <OrdersList orders={orders} />;
}
