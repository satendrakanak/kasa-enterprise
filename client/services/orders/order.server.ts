import { apiServer } from "@/lib/api/server";
import { ApiResponse } from "@/types/api";
import { Order } from "@/types/order";

export const orderServerService = {
  getAll: () => apiServer.get<ApiResponse<Order[]>>("/orders"),
  getMine: () => apiServer.get<ApiResponse<Order[]>>("/orders/my-orders"),
  getById: (orderId: number) =>
    apiServer.get<ApiResponse<Order>>(`/orders/${orderId}`),
};
