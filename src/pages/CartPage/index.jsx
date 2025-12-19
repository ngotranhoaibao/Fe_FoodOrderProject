import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import CartItemList from "../../components/CartItemList";
import OrderSummaryCard from "../../components/OrderSummaryCard";

import { getCart, updateCartItem, removeFromCart } from "@/services/api/cart";
import { createOrder } from "@/services/api/order";
import {io} from "socket.io-client";
const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Banking");
  const CART_COUNT_STORAGE_KEY = "cartItemCount";

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getCart();
      setCartData(response.data);
      const totalCount = response.data.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      localStorage.setItem(CART_COUNT_STORAGE_KEY, totalCount.toString());

      window.dispatchEvent(new Event("storageUpdate"));
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
      setError("Không thể tải giỏ hàng. Vui lòng kiểm tra kết nối.");
      localStorage.setItem(CART_COUNT_STORAGE_KEY, "0");
      window.dispatchEvent(new Event("storageUpdate"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  const handleUpdateQuantity = async (foodId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      await updateCartItem(foodId, newQuantity);
      toast.success(`Cập nhật số lượng thành công: ${newQuantity}`);
      fetchCart();
    } catch (error) {
      toast.error("Cập nhật số lượng thất bại.");
    } finally {
      setIsUpdating(false);
    }
  };
  const handleRemoveItem = async (foodId, itemName) => {
    if (
      !window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}" khỏi giỏ hàng?`)
    ) {
      return;
    }

    setIsUpdating(true);
    try {
      await removeFromCart(foodId);
      toast.success(`Đã xóa món "${itemName}" khỏi giỏ hàng.`);
      fetchCart();
    } catch (error) {
      toast.error("Xóa món ăn thất bại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!paymentMethod) {
      return toast.error("Vui lòng chọn phương thức thanh toán.");
    }

    setIsOrdering(true);
    try {
      const response = await createOrder({ payment_method: paymentMethod });

      toast.success(
        response.message ||
          "Đặt hàng thành công! Vui lòng kiểm tra lịch sử đơn hàng."
      );
      setCartData({ ...cartData, items: [] });
      localStorage.setItem(CART_COUNT_STORAGE_KEY, "0");
      window.dispatchEvent(new Event("storageUpdate"));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đặt hàng thất bại.";
      toast.error(errorMessage);
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-medium">
        Đang tải giỏ hàng...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">{error}</div>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Looks like you haven't added any items to your cart yet. Start
          exploring our delicious menu!
        </p>
      </div>
    );
  }

  const total = cartData.items
    .reduce((acc, item) => acc + item.quantity * item.price, 0)
    .toFixed(2);
  const processedItems = cartData.items.map((item) => ({
    id: item._id,
    foodId: item.food_id._id,
    name: item.food_id.name,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.food_id.image_url || "/default-sushi.jpg",
    isAvailable: item.food_id.is_available,
  }));

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <CartItemList
          items={processedItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          isUpdating={isUpdating}
        />
      </div>

      <div>
        <OrderSummaryCard
          items={processedItems}
          total={total}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onCreateOrder={handleCreateOrder}
          isOrdering={isOrdering}
        />
      </div>
    </div>
  );
};

export default CartPage;
