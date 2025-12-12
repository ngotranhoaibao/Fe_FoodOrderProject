import React, { createContext, useState, useEffect } from "react";
import { googleLogin, getMe, logoutUser } from "../services/api/auth.js";
import {
  getAccessToken,
  removeAuthTokens,
  setAccessToken,
} from "../services/api/index.js"; // 🎯 Đảm bảo có setAccessToken nếu cần

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const initialUserInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = getAccessToken();
    const storedUserInfo = localStorage.getItem("userInfo");

    if (!token || !storedUserInfo) {
      setUserInfo(null);
      setLoading(false);
      return;
    }

    try {
      const resData = await getMe();

      const userData = resData.user;

      const finalUserInfo = { user: userData };
      setUserInfo(finalUserInfo);
      localStorage.setItem("userInfo", JSON.stringify(finalUserInfo));
    } catch (error) {
      console.error(
        "Xác thực thất bại khi khởi động (Token hết hạn/Không hợp lệ):",
        error
      );
      removeAuthTokens();
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const googleLoginContext = async (idToken) => {
    try {
      setLoading(true);

      const response = await googleLogin(idToken);
      const loginResData = response.data; 

      const token = loginResData.accessToken;
      const userData = loginResData.user;

      if (!token || !userData) {
        throw new Error("Missing authentication data from API");
      }

      setAccessToken(token);
      const finalUserInfo = { user: userData };
      setUserInfo(finalUserInfo);
      localStorage.setItem("userInfo", JSON.stringify(finalUserInfo));

      toast.success(`Chào mừng ${userData.name}! Đăng nhập thành công.`);

      if (userData.role === "admin") {
        navigate("/", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }

      setLoading(false);
      return finalUserInfo;
    } catch (error) {
      console.error("Google Login error:", error);
      toast.error(
        error?.response?.data?.message || "Đăng nhập Google thất bại."
      );
      removeAuthTokens();
      setUserInfo(null);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Lỗi khi logout trên server:", e);
    }

    setUserInfo(null);
    removeAuthTokens();
    toast.success("Đã đăng xuất.");
    navigate("/sign-in", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        userInfo: {
          ...userInfo,
          isAuthenticated: !!userInfo?.user && !!getAccessToken(),
        },
        loading,
        loginContext: googleLoginContext,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
