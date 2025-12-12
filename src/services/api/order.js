import api from "@/services/api";
export const getAllOrders = async () => {
    return await api.get("/orders/all");
};
export const updateOrderStatus = async (orderId, status) => {
    return await api.put(`/orders/${orderId}/status`, { status });
};

export const createOrder = async (orderData) => {
    return await api.post("/orders", orderData);
};