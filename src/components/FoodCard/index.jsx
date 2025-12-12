
import React from "react";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formattedPrice } from "../../utils/formattedPrice";
const FoodCard = ({ food, onAddToCart, onToggleFavorite }) => {
  if (!food) return null;

  const { _id, name, price, description, image_url, isFavorite } = food;

  const validPrice = typeof price === "number" && !isNaN(price) ? price : 0;

  const image = image_url;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(_id);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(_id);
    }
  };

  return (
    <div
      data-slot="card"
      className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={image}
        />

        <Button
          variant="ghost"
          onClick={handleToggleFavorite}
          className="size-9 absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart
            className="w-5 h-5 transition-colors"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </Button>
      </div>

      <div data-slot="card-content" className="p-4 pt-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{name}</h3>
          <span className="text-primary font-bold whitespace-nowrap">
            {formattedPrice.format(validPrice)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>

        <Button className="w-full gap-2" onClick={handleAddToCart}>
          <Plus className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default FoodCard;
