import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ClipboardList, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserNav from "@/components/UserNav";
import CartBadgeWithLocal from "@/components/CartBadgeWithLocal";
const Header = ({
  avatarSrc ,
  userName ,
  email ,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link className="flex items-center gap-2" to="/home">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">
            FoodOrder
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/home/orders">
            <Button
              variant="ghost"
              className="h-8 rounded-md px-3 has-[&>svg]:px-2.5 gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">My Orders</span>
            </Button>
          </Link>
          <CartBadgeWithLocal to="/home/cart" />
          <UserNav userName={userName} avatarSrc={avatarSrc} email={email} />
        </div>
      </div>
    </header>
  );
};

export default Header;
