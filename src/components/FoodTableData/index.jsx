// File: src/components/FoodTableData.jsx

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const FoodTableData = ({ data, onToggleAvailability, onEdit, onDelete }) => {
  const columns = [
    "image_url",
    "name",
    "price",
    "category",
    "description",
    "is_available",
  ];

  const columnNames = {
    image_url: "Image",
    name: "Name",
    price: "Price",
    category: "Category", 
    description: "Description",
    is_available: "Available",
  };

  return (
    <div className="rounded-md border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            {columns.map((col) => (
              <TableHead
                key={col}
                className={col === "description" ? "hidden md:table-cell" : ""}
              >
                {columnNames[col]}
              </TableHead>
            ))}
            <TableHead className="text-right w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data && data.length > 0 ? ( 
            data.map((item, index) => (
              <TableRow
                key={item._id} 
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* Cột ID */}
                <TableCell className="font-mono text-xs text-gray-500">
                  {index + 1}
                </TableCell>

                {columns.map((col) => {
                  if (col === "image_url") {
                    return (
                      <TableCell key={col}>
                        <img
                          src={item[col] || "/placeholder-food.png"}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                      </TableCell>
                    );
                  }

                  if (col === "price") {
                    return (
                      <TableCell
                        key={col}
                        className="font-semibold text-primary"
                      >
                        ${item[col]?.toFixed(2)}
                      </TableCell>
                    );
                  }

                  if (col === "is_available") {
                    return (
                      <TableCell key={col}>
                        <Switch
                          checked={item[col]}
                          onCheckedChange={(isChecked) =>
                            onToggleAvailability(item._id, isChecked)
                          }
                        />
                      </TableCell>
                    );
                  }

                  if (col === "description") {
                    return (
                      <TableCell
                        key={col}
                        className="hidden md:table-cell text-gray-500 max-w-[200px] truncate"
                      >
                        {item[col]}
                      </TableCell>
                    );
                  }

                  // Cột Name và các cột khác
                  return (
                    <TableCell key={col} className="font-medium">
                      {item[col]}
                    </TableCell>
                  );
                })}

                {/* Cột Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* GÁN HANDLER CHO EDIT */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50/50"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-50/50 hover:text-red-700"
                      onClick={() => onDelete(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1} 
                className="h-24 text-center text-gray-500"
              >
                No food items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FoodTableData;