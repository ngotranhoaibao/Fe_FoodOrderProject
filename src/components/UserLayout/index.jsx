import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import AuthContext from "@/contexts/authContext"; 

const UserLayout = () => {
  const { userInfo, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Đang tải giao diện...
      </div>
    );
  }

  const user = userInfo?.user || {};
  const userName = user.name || "Khách";
  const avatarSrc = user.avatar || "/default-avatar.png";
  const email = user.email || "guest@example.com";
  return (
    <div className="flex flex-col h-screen">
      <Header userName={userName} avatarSrc={avatarSrc} email={email} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;