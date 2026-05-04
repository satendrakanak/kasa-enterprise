"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Ticket, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";

interface CouponApplyBoxProps {
  appliedCoupon?: string | null;
  onApply: (code: string) => Promise<void>;
  onRemove?: () => Promise<void>;
}

export const CouponApplyBox = ({
  appliedCoupon,
  onApply,
  onRemove,
}: CouponApplyBoxProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);
      await onApply(code.trim().toUpperCase());
      setCode("");
      toast.success("Coupon applied successfully");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      await onRemove?.();
      toast.success("Coupon removed");
    } catch {
      toast.error("Failed to remove coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 space-y-3">
      <h3 className="text-sm font-semibold">Apply Coupon</h3>

      {/* ✅ Applied State */}
      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-lg border bg-green-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-green-600" />
            <Badge variant="secondary">{appliedCoupon}</Badge>
            <span className="text-xs text-green-700">Applied successfully</span>
          </div>

          <button
            onClick={handleRemove}
            disabled={loading}
            className="p-1 rounded-md hover:bg-red-100 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ) : (
        /* ✅ Modern Input */
        <div className="relative">
          <Input
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApply();
              }
            }}
            className="h-11 pr-12"
          />

          {/* 🔥 Inline Button */}
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 
              h-9 w-9 flex items-center justify-center 
              rounded-md bg-primary text-white 
              hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
