import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const CART_COUNT_STORAGE_KEY = "cartItemCount";

const CartBadgeWithLocal = ({ to }) => {
  const initialCount = parseInt(
    localStorage.getItem(CART_COUNT_STORAGE_KEY) || "0",
    10
  );
  const [cartItemCount, setCartItemCount] = useState(initialCount);

  useEffect(() => {
    const handleStorageChange = () => {
      const newCount = parseInt(
        localStorage.getItem(CART_COUNT_STORAGE_KEY) || "0",
        10
      );
      setCartItemCount(newCount);
    };

    window.addEventListener("storageUpdate", handleStorageChange);

    return () => {
      window.removeEventListener("storageUpdate", handleStorageChange);
    };
  }, []);

  const displayCount = cartItemCount > 99 ? "99+" : cartItemCount.toString();
  const isCartEmpty = cartItemCount === 0;

  return (
    <Button variant="ghost" className="size-9 relative" asChild>
      <Link to={to}>
        <ShoppingCart className="w-5 h-5" />

        {!isCartEmpty && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center pointer-events-none">
            {displayCount}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default CartBadgeWithLocal;
