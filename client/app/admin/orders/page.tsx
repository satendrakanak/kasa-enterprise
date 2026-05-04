import { OrdersListLoader } from "@/components/admin/orders/orders-list-loader";
import { getErrorMessage } from "@/lib/error-handler";
import { orderServerService } from "@/services/orders/order.server";
import { Order } from "@/types/order";
import { notFound } from "next/navigation";

const OrdersPage = async () => {
  let orders: Order[] = [];

  try {
    const response = await orderServerService.getAll();
    orders = response.data || [];
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Orders fetch error:", message);
    notFound(); // only for real error
  }

  // 🔥 EMPTY STATE HANDLE
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-semibold mb-2">No orders found</h2>
        <p className="text-sm text-gray-500">
          Orders will appear here once users start purchasing.
        </p>
      </div>
    );
  }

  return (
    <div>
      <OrdersListLoader orders={orders} />
    </div>
  );
};

export default OrdersPage;
