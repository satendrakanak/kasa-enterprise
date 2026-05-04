import { apiServer } from "@/lib/api/server";
import { ApiResponse } from "@/types/api";
import { RefundRequest } from "@/types/order";

export const refundServerService = {
  getAdminList: () =>
    apiServer.get<ApiResponse<RefundRequest[]>>("/refund-requests/admin"),

  getMine: () =>
    apiServer.get<ApiResponse<RefundRequest[]>>("/refund-requests/my"),

  getById: (refundRequestId: number) =>
    apiServer.get<ApiResponse<RefundRequest>>(
      `/refund-requests/${refundRequestId}`,
    ),
};
