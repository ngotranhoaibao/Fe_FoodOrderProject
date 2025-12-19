import React, { useState, useEffect, useCallback } from "react";
import HeaderSection from "@/components/HeaderSection";
import { getAllOrders, updateOrderStatus } from "../../services/api/order";
import OrderTableData from "@/components/OrderTableData";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { adminSocket } from "../../socket/adminSocket";
const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const columns = ["customer", "items", "total", "paymentMethod", "status"];
  const [pendingChanges, setPendingChanges] = useState({});

  const ORDER_STATUSES = [
    "pending",
    "paid",
    "processing",
    "completed",
    "cancelled",
    "preparing",
  ];

  useEffect(() => {
    adminSocket.on("new_order", (order) => {
      toast.success(`Đơn hàng mới #${order.orderId.substring(0, 8)}`);

      setHasNewOrders(true);
      setNewOrderCount((prev) => prev + 1);
    });

    return () => {
      adminSocket.off("new_order");
    };
  }, []);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    getAllOrders()
      .then((res) => {
        setOrders(res.data.data || []);
        setPendingChanges({});
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        toast.error("Không thể tải danh sách đơn hàng.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    const originalOrders = orders;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(
        `Cập nhật trạng thái đơn hàng ${orderId.substring(
          0,
          8
        )} sang ${newStatus} thành công.`
      );
    } catch (error) {
      console.error("Update status failed:", error);
      toast.error("Cập nhật trạng thái thất bại. Đang tải lại dữ liệu...");
      setOrders(originalOrders);
      fetchOrders();
    }
  };

  const handleSelectChange = (orderId, newStatus) => {
    const currentOrder = orders.find((o) => o._id === orderId);

    if (currentOrder && currentOrder.status !== newStatus) {
      setPendingChanges((prev) => ({ ...prev, [orderId]: newStatus }));
    } else {
      setPendingChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[orderId];
        return newChanges;
      });
    }
  };

  const handleSave = (orderId) => {
    const newStatus = pendingChanges[orderId];
    if (newStatus) {
      handleStatusChange(orderId, newStatus);
      setPendingChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[orderId];
        return newChanges;
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Đang tải dữ liệu đơn hàng...
      </div>
    );
  }

  return (
    <>
      <HeaderSection
        title="Order Management"
        description="Manage and update customer orders"
      />

      {hasNewOrders && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              fetchOrders();
              setHasNewOrders(false);
              setNewOrderCount(0);
            }}
            className="bg-primary text-white px-4 py-2 rounded shadow"
          >
            {newOrderCount} đơn hàng mới – Refresh
          </button>
        </div>
      )}

      <Card className="bg-white shadow-lg rounded-lg border-none">
        <CardContent>
          <OrderTableData
            data={orders}
            statuses={ORDER_STATUSES}
            pendingChanges={pendingChanges}
            onSelectChange={handleSelectChange}
            onSave={handleSave}
            columns={columns}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default OrderManagementPage;
