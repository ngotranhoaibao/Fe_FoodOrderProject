import api from "@/services/api/index.js";

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res;
};

export const googleLogin = async (idToken) => {
  const res = await api.post("/auth/google", { token: idToken });
  return res.data;
};
