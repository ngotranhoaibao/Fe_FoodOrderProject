import React from "react";
import { Circle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrderSummaryCard = ({
  items = [],
  total = "0.00",
  paymentMethod,
  setPaymentMethod,
  onCreateOrder,
  isOrdering,
}) => {
  const formattedTotal = `$${parseFloat(total).toFixed(2)}`;
  const hasItems = items && items.length > 0;

  const renderRadioIndicator = (method) => {
    return (
      <div className="aspect-square size-4 shrink-0 rounded-full border shadow-xs  flex items-center justify-center">
        {paymentMethod === method && (
          <Circle className="lucide lucide-circle fill-primary size-2" />
        )}
      </div>
    );
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="leading-none font-semibold">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>{" "}
            </div>
          ))}

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formattedTotal}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label
            data-slot="label"
            className="flex items-center gap-2 select-none text-base font-semibold"
          >
            Payment Method
          </label>

          <div className="grid gap-3 space-y-2">
            <div
              className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === "banking"
                  ? "border-primary ring-2 ring-primary/50 bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setPaymentMethod("Banking")}
            >
              {renderRadioIndicator("Banking")}
              <label className="flex items-center gap-2 text-sm leading-none font-medium cursor-pointer flex-1">
                Bank Transfer / Card
              </label>
            </div>
            <div
              className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === "cash"
                  ? "border-primary ring-2 ring-primary/50 bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setPaymentMethod("Cash")}
            >
              {renderRadioIndicator("Cash")}
              <label className="flex items-center gap-2 text-sm leading-none font-medium cursor-pointer flex-1">
                Cash on Delivery
              </label>
            </div>
          </div>
        </div>
        <Button
          onClick={onCreateOrder}
          size="lg"
          className="w-full h-12 text-base font-semibold"
          disabled={isOrdering || !hasItems}
        >
          {isOrdering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo đơn hàng...
            </>
          ) : (
            "Create Order"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
