
import React, { useState, useContext } from "react";
import LoginCard from "@/components/LoginCard";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/contexts/authContext";
import { toast } from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../src/firebase";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginContext: googleLoginContext } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      toast.loading("Đang xác thực tài khoản...", { id: "google-auth" });

      await googleLoginContext(idToken);

      toast.success("Đăng nhập Google thành công!", { id: "google-auth" });
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      const errorMessage = error.message || "Đăng nhập Google thất bại."; 
      const backendError = error?.response?.data?.message || null;

      toast.error(backendError || errorMessage, { id: "google-auth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="relative w-full h-full bg-[lightgray]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
          <LoginCard
            loading={loading}
            handleGoogleSignIn={handleGoogleSignIn}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
