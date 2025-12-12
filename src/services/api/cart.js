import api from "@/services/api";
export const addToCart = async (food_id, quantity = 1) => {
  const res = await api.post("/cart/add", {
    food_id: food_id,
    quantity: quantity,
  });
  return res.data;
};

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const updateCartItem = async (foodId, quantity) => {
  const res = await api.put(`/cart/${foodId}`, {
    quantity: quantity,
  });
  return res.data;
};

export const removeFromCart = async (foodId) => {
  // Sử dụng phương thức DELETE
  const res = await api.delete(`/cart/${foodId}`);
  return res.data;
};
