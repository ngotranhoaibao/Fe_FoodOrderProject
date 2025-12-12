import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CartItemList = ({
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  isUpdating,
}) => {
  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 shadow-sm">
        <p className="text-muted-foreground">Giỏ hàng không có món ăn nào.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 flex gap-4">
            <img
              alt={item.name}
              className="w-20 h-20 rounded-lg object-cover"
              src={item.imageUrl}
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {item.name}
              </h3>

              <p className="text-primary font-bold mt-1">
                ${item.price.toFixed(2)}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onUpdateQuantity(item.foodId, item.quantity, -1)
                  }
                  disabled={item.quantity <= 1 || isUpdating}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onUpdateQuantity(item.foodId, item.quantity, 1)
                  }
                  disabled={isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem(item.foodId, item.name)}
                  disabled={isUpdating}
                  className="ml-auto text-destructive hover:bg-destructive/10" // Thêm màu sắc
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CartItemList;
