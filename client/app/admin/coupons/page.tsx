import { CouponsListLoader } from "@/components/admin/coupons/coupons-list-loader";
import { getErrorMessage } from "@/lib/error-handler";
import { couponServerService } from "@/services/coupons/coupon.server";
import { Coupon } from "@/types/coupon";

const CouponsPage = async () => {
  let coupons: Coupon[] = [];
  try {
    const response = await couponServerService.getAll();
    coupons = response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }

  return (
    <div>
      <CouponsListLoader coupons={coupons} />
    </div>
  );
};

export default CouponsPage;
