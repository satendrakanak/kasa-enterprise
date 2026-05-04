import { RefundsDashboard } from "@/components/admin/refunds/refunds-dashboard";
import { getErrorMessage } from "@/lib/error-handler";
import { refundServerService } from "@/services/refunds/refund.server";
import { RefundRequest } from "@/types/order";

export default async function AdminRefundsPage() {
  let refundRequests: RefundRequest[] = [];

  try {
    const response = await refundServerService.getAdminList();
    refundRequests = response.data || [];
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }

  return <RefundsDashboard refundRequests={refundRequests} />;
}
