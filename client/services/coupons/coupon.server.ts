import { apiServer } from "@/lib/api/server";
import { ApiResponse } from "@/types/api";
import { Coupon } from "@/types/coupon";

export const couponServerService = {
  getAll: () => apiServer.get<ApiResponse<{ data: Coupon[] }>>("/coupons"),
  getById: (id: string) => apiServer.get<ApiResponse<Coupon>>(`/coupons/${id}`),
};
