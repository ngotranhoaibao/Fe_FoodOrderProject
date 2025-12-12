import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import  AppSidebar  from "../AppSidebar";
const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
