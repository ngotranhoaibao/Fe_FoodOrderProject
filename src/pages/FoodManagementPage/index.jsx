
import React, { useState, useEffect, useCallback } from "react";
import HeaderSection from "@/components/HeaderSection";
import FoodTableData from "@/components/FoodTableData";
import { Card, CardContent } from "@/components/ui/card";
import {
  getFoodList,
  updateStatus,
  deleteFood,
  createFood,
  updateFood, 
} from "../../services/api/food";
import { toast } from "react-hot-toast";
import DialogCreateFood from "@/components/DialogCreateFood";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const FoodManagementPage = () => {
  const [foodList, setFoodList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editingFood, setEditingFood] = useState({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const foodData = {
    name,
    description,
    price: Number(price),
    category,
    image_url: imageUrl,
    is_available: isAvailable,
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormStates = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setCategory("");
    setImageUrl("");
    setIsAvailable(true);
    setEditingFood({});
  };

  const handleCloseDialog = (openState) => {
    setIsDialogOpen(openState);
    if (!openState) {
      resetFormStates();
    }
  };

  useEffect(() => {
    if (isDialogOpen && isEditing) {
      setName(editingFood.name || "");
      setDescription(editingFood.description || "");
      setPrice(Number(editingFood.price) || 0);
      setCategory(editingFood.category || "");
      setImageUrl(editingFood.image_url || "");
      setIsAvailable(editingFood.is_available ?? true); 
    }
  }, [isDialogOpen, isEditing, editingFood]);

  const fetchFoods = useCallback(() => {
    getFoodList()
      .then((res) => {
        setFoodList(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch food list:", err);
        toast.error("Không thể tải danh sách món ăn.");
      });
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleToggleAvailability = async (foodId, isChecked) => {
    try {
      await updateStatus(foodId, isChecked);
      toast.success(`Cập nhật trạng thái món ăn thành công!`);
      fetchFoods();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Bạn có chắc chắn muốn ẩn món ăn này không?")) return;

    try {
      await deleteFood(foodId);
      toast.success("Món ăn đã được ẩn khỏi menu.");
      fetchFoods();
    } catch (error) {
      toast.error("Xóa/Ẩn món ăn thất bại.");
    }
  };

  const handleEditFood = (item) => {
    setEditingFood(item);
    setIsEditing(true);
    setIsDialogOpen(true);
    toast.info(`Mở form chỉnh sửa cho: ${item.name}`);
  };

  const handleCreateFood = async () => {
    setIsSubmitting(true);
    try {
      const res = await createFood(foodData);
      toast.success(`Tạo món ăn "${res.data.data.name}" thành công!`);
      handleCloseDialog(false);
      fetchFoods();
    } catch (error) {
      console.error("Create food failed:", error);
      toast.error("Tạo món ăn thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFood = async () => {
    const foodId = editingFood._id;
    if (!foodId) {
      toast.error("Không tìm thấy ID món ăn để cập nhật.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateFood(foodId, foodData);

      toast.success(`Cập nhật món ăn "${name}" thành công!`);
      handleCloseDialog(false);
      fetchFoods();
    } catch (error) {
      console.error("Update food failed:", error);
      toast.error("Cập nhật món ăn thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeaderSection
        title="Manage Foods"
        description="Manage your restaurant menu items"
      >
        <Button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            setIsEditing(false);
            resetFormStates();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add New Food
        </Button>
      </HeaderSection>

      <Card className="bg-white shadow-lg rounded-lg border-none">
        <CardContent>
          <FoodTableData
            data={foodList}
            onToggleAvailability={handleToggleAvailability}
            onEdit={handleEditFood}
            onDelete={handleDeleteFood}
          />
        </CardContent>
      </Card>

      <DialogCreateFood
        open={isDialogOpen}
        setOpen={handleCloseDialog}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        category={category}
        setCategory={setCategory}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        isAvailable={isAvailable}
        setIsAvailable={setIsAvailable}
        handleCreateFood={handleCreateFood}
        handleUpdateFood={handleUpdateFood}
      />
    </>
  );
};

export default FoodManagementPage;
