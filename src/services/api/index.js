import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const setAccessToken = (token) =>
  localStorage.setItem("accessToken", token);
export const removeAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
};

const API_BASE = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const redirectToSignIn = () => {
  const signInPath = "/sign-in";
  if (window.location.pathname !== signInPath) {
    window.location.assign(signInPath);
  } else {
    window.location.reload();
  }
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!originalRequest || !status) return Promise.reject(error);

    const url = originalRequest.url || "";
    const isAuthEndpoint = url.includes("/auth/refresh");

    if (status !== 401) return Promise.reject(error);

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshClient = axios.create({
        baseURL: API_BASE,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const refreshRes = await refreshClient.post("/auth/refresh");

      const newAccessToken =
        refreshRes?.data?.data?.accessToken || refreshRes?.data?.accessToken; // ... (Logic lưu token mới, resolve queue, và retry original request KHÔNG THAY ĐỔI)

      if (!newAccessToken) {
        throw new Error("Missing new access token from refresh response");
      }

      setAccessToken(newAccessToken);
      api.defaults.headers = api.defaults.headers || {};
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      try {
        removeAuthTokens();
      } catch (e) {
        console.error("Error removing auth tokens:", e);
      }

      redirectToSignIn();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
