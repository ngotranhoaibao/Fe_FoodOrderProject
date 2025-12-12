import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

function DialogCreateFood({
  open,
  setOpen,
  isEditing,
  isSubmitting,

  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  category,
  setCategory,
  imageUrl,
  setImageUrl,
  isAvailable,
  setIsAvailable,
  handleCreateFood,
  handleUpdateFood,
}) {
  const dialogTitle = isEditing ? "Edit Food" : "Add New Food";
  const buttonText = isEditing ? "Save Changes" : "Add Food";
  const isSaveDisabled = isSubmitting || !name || price <= 0 || !category;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="border-b p-6">
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 py-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <Label htmlFor="food-name">Name *</Label>
            <Input
              id="food-name"
              placeholder="Food name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="food-description">Description</Label>
            <Textarea
              id="food-description"
              placeholder="Food description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="food-price">Price ($) *</Label>
              <Input
                id="food-price"
                step="0.01"
                placeholder="0.00"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="food-category">Category *</Label>
              <Input
                id="food-category"
                placeholder="Category (e.g., Main, Dessert)"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="food-image">Image URL</Label>
            <Input
              id="food-image"
              placeholder="https://... (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="food-available"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
            <Label htmlFor="food-available">Available for order</Label>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSaveDisabled}
            onClick={() => {
              if (isEditing) {
                handleUpdateFood();
              } else {
                handleCreateFood();
              }
            }}
          >
            {isSubmitting ? "Saving..." : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogCreateFood;
