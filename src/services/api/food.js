import api from "@/services/api";

export const getFoodList = async ({ category = "All", search = "" } = {}) => {
  return api.get("/foods", {
    params: {
      search,
      category,
    },
  });
};
export const deleteFood = async (id) => {
  return await api.delete(`/foods/${id}`);
};

export const updateStatus = async (foodId, is_available) => {
    return await api.put(`/foods/${foodId}/status`, { status: is_available });
};

export const createFood = async (data) => {
    return await api.post("/foods", data);
};
export const updateFood = async (foodId, data) => {
    return await api.put(`/foods/${foodId}`, data);
};