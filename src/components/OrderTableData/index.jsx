import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTotal } from "@/utils/formatTotal"; 

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
const OrderTableData = ({
  data,
  pendingChanges,
  onSelectChange,
  onSave,
  columns,
  statuses,
}) => {

  const columnNames = {
    customer: "Customer",
    items: "Items",
    total: "Total",
    paymentMethod: "Payment",
    status: "Status",
  };

  const formatItems = (items) => {
    if (!items || items.length === 0) return "N/A";
    const list = items
      .map((item) => {
        if (!item || !item.name) return "Món ăn lỗi";
        return `${item.name} x${item.quantity}`; 
      })
      .join(", ");

    return list.length > 50 ? list.substring(0, 47) + "..." : list;
  };

  return (
    <div className="rounded-md border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-20">Order ID</TableHead>
            {columns.map((col) => (
              <TableHead
                key={col}
                className={`${col === "items" ? "hidden md:table-cell" : ""} ${
                  col === "paymentMethod" ? "hidden sm:table-cell" : ""
                }`}
              >
                {columnNames[col]}
              </TableHead>
            ))}
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data && data.length > 0 ? (
            data.map((item) => {
              const displayStatus = pendingChanges[item._id] || item.status;
              const isStatusChanged = !!pendingChanges[item._id];
              return (
                <TableRow
                  key={item._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-mono text-sm">
                    {item.orderId || item._id.substring(0, 8)} 
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {item.user_id?.name || "Người dùng (Lỗi)"} 
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.user_id?.email || "N/A"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {formatItems(item.items)}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatTotal(item.total_amount)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className="text-xs font-medium w-fit whitespace-nowrap shrink-0 text-foreground border-gray-300 bg-gray-50"
                    >
                      {item.payment_method || "Cash"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-32">
                      <Select
                        value={displayStatus}
                        onValueChange={(newStatus) =>
                          onSelectChange(item._id, newStatus)
                        }
                      >
                        <SelectTrigger
                          className={`h-8 text-sm focus:ring-0 ${
                            isStatusChanged
                              ? " ring-2 ring-primary/50"
                              : ""
                          }`}
                        >
                           <SelectValue 
                              placeholder={
                                displayStatus.charAt(0).toUpperCase() +
                                displayStatus.slice(1)
                              }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s} className="text-sm">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    {isStatusChanged ? (
                      <Button
                        className="h-8 rounded-md px-3 gap-1"
                        variant="default"
                        size="sm"
                        onClick={() => onSave(item._id)}
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    ) : (
                      <Button
                        className="h-8 rounded-md px-3 gap-1 opacity-50 cursor-not-allowed"
                        variant="default"
                        size="sm"
                      > 
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 2}
                className="h-24 text-center text-gray-500"
              >
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTableData;