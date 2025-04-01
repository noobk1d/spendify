"use client";

import { useState, useEffect } from "react";
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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categoryType, setCategoryType] = useState("expense");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/categories/67cf12a40004818c2916"
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await fetch(
          "http://127.0.0.1:3000/spendify/api/categories/67cf12a40004818c2916",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newCategory.trim(),
              type: categoryType,
            }),
          }
        );
        await response.json();
        // Fetch updated categories after adding new one
        fetchCategories();
        setNewCategory("");
        setCategoryType("expense");
        setIsAdding(false);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setCategories(categories.filter((c) => c.$id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory("");
    }
  };

  // Generate random pastel colors for categories
  const getCategoryColor = (categoryName) => {
    const hash = categoryName.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Loading categories...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <SelectItem key={category.$id} value={category.$id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isAdding && (
          <div className="space-y-4 p-4 border rounded-md bg-muted/50">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="flex-1"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="type" className="w-16">
                Type:
              </Label>
              <Select value={categoryType} onValueChange={setCategoryType}>
                <SelectTrigger id="type" className="flex-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={handleAddCategory} size="sm">
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategory("");
                  setCategoryType("expense");
                }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div>
          <Label className="mb-3 block">All Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.$id}
                variant="outline"
                className="flex items-center gap-1 py-1.5 px-3 text-sm"
                style={{
                  backgroundColor: getCategoryColor(category.name),
                  color: "#000",
                }}>
                {category.name}
                <button
                  onClick={() => handleRemoveCategory(category.$id)}
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
