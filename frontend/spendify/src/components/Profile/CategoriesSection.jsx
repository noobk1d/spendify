"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Profile/card";
import { Button } from "../ui/Profile/button";
import { Input } from "../ui/Profile/input";
import { Label } from "../ui/Profile/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Profile/select";
import { Badge } from "../ui/Profile/badge";
import { Plus, X, Tag } from "lucide-react";

function CategoriesSection() {
  const [categories, setCategories] = useState([
    "New Users",
    "Online Sales",
    "Daily Sales",
    "Digital Product",
    "Physical Product",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setIsAdding(false);
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
    if (selectedCategory === category) {
      setSelectedCategory("");
    }
  };

  // Generate random pastel colors for categories
  const getCategoryColor = (category) => {
    const hash = category.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your performance categories</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Select Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isAdding && (
          <div className="flex items-center gap-2 p-4 border rounded-md bg-muted/50">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
              className="flex-1"
              autoFocus
            />
            <Button onClick={handleAddCategory} size="sm">
              Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNewCategory("");
              }}>
              Cancel
            </Button>
          </div>
        )}

        <div>
          <Label className="mb-3 block">All Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="flex items-center gap-1 py-1.5 px-3 text-sm"
                style={{
                  backgroundColor: getCategoryColor(category),
                  color: "#000",
                }}>
                {category}
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-1 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-200 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CategoriesSection;
