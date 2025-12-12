import React, { useState, useEffect } from "react";
import FoodFilters from "../../components/FoodFilters";
import FoodCard from "../../components/FoodCard";
import { getFoodList } from "../../services/api/food";
import { addToCart, getCart } from "@/services/api/cart";
import toast from "react-hot-toast";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const CART_COUNT_STORAGE_KEY = "cartItemCount";
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFoodList({
        category: activeCategory,
        search: searchTerm,
      });

      const payload = response?.data;
      let foodsArray = [];

      if (Array.isArray(payload)) {
        foodsArray = payload;
      } else if (Array.isArray(payload?.data)) {
        foodsArray = payload.data;
      } else if (Array.isArray(payload?.result)) {
        foodsArray = payload.result;
      } else {
        const possibleArray = Object.values(payload || {}).find((v) =>
          Array.isArray(v)
        );
        if (Array.isArray(possibleArray)) foodsArray = possibleArray;
      }
      setFoods(foodsArray);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách món ăn:", err);
      setError(err?.response?.data?.message || err.message || "Lỗi mạng");
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [activeCategory, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleAddToCart = async (foodId) => {
    const toastId = toast.loading("Đang thêm vào giỏ hàng...");

    try {
      const quantity = 1;
      const responseData = await addToCart(foodId, quantity);

      const cartResponse = await getCart();
      const newCartItems = cartResponse?.data?.items || [];

      const totalCount = newCartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      localStorage.setItem(CART_COUNT_STORAGE_KEY, totalCount.toString());

      window.dispatchEvent(new Event("storageUpdate"));

      const successMessage =
        responseData?.message || "Đã thêm món ăn vào giỏ hàng!";
      toast.success(successMessage, { id: toastId });
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);

      const errorMessage =
        err?.response?.data?.message ||
        "Lỗi không xác định khi thêm vào giỏ hàng.";
      toast.error(errorMessage, { id: toastId });
    }
  };
  return (
    <>
      <FoodFilters
        searchTerm={searchTerm}
        activeCategory={activeCategory}
        onSearch={handleSearchChange}
        onCategoryChange={handleCategoryClick}
      />
      <div className=" sm:p-6 lg:p-8">
        {loading && (
          <div className="text-center py-8 text-lg text-muted-foreground">
            Đang tải món ăn...
          </div>
        )}
        {!loading && !error && foods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard
                key={food._id ?? food.id}
                food={food}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {!loading && !error && foods.length === 0 && (
          <div className="text-center py-8 text-lg text-muted-foreground">
            Không tìm thấy món ăn nào phù hợp với bộ lọc.
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
