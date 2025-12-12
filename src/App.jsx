
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LayoutUser from "./components/UserLayout";
import FoodManagementPage from "./pages/FoodManagementPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./contexts/authContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderManagementPage from "./pages/OrderManagement";
import HomePage from "./pages/HomePage";
import Cartpage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Toaster toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute role="admin">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<FoodManagementPage />} />

            <Route path="orders" element={<OrderManagementPage />} />
          </Route>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <LayoutUser />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="/home/cart" element={<Cartpage />} />
            <Route path="/home/order-history" element={<OrderHistoryPage />} />
          </Route>

          <Route path="/sign-in" element={<LoginPage />} />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
