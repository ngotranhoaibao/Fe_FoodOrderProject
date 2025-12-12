
import React from "react"; 
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Burger",
  "Pizza",
  "Sushi",
  "Salads",
  "Desserts",
  "Drinks",
];

const FoodFilters = ({
  searchTerm,
  activeCategory,
  onSearch,
  onCategoryChange,
}) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative max-w-md">
        <Search className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

        <Input
          className="pl-10"
          placeholder="Search for food..."
          value={searchTerm}
          // 🎯 Đã đúng: onChange truyền sự kiện (E) cho onSearch
          onChange={onSearch}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className="rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 shadow-xs"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FoodFilters;
