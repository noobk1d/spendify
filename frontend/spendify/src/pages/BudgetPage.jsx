import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Settings } from "lucide-react";
import { Button } from "../components/ui/Dashboard/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Dashboard/card";
import { Input } from "../components/ui/Dashboard/input";
import { Progress } from "../components/ui/Dashboard/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/Dashboard/dialog";
import TransactionStatusAnimation from "../components/TransactionStatusAnimation";
import Sidebar from "./Sidebar";
import { BudgetPieChart } from "../components/budget/BudgetPieChart";
import { CategoryList } from "../components/budget/CategoryList";
import { CategoryForm } from "../components/budget/CategoryForm";

export default function BudgetPage() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showStatusAnimation, setShowStatusAnimation] = useState(false);
  const [statusAnimation, setStatusAnimation] = useState({
    status: "",
    message: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch budget data
  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/budget/total/67cf12a40004818c2916"
      );
      const data = await response.json();
      if (data.status === "success") {
        setTotalBudget(data.data.totalBudget);
        setTotalSpent(data.data.totalSpent);
        setRemainingBudget(data.data.remainingBudget);
        setCategoryBudgets(data.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching budget data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  // Update total budget
  const handleUpdateTotalBudget = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/budget/total/67cf12a40004818c2916",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ totalBudget: Number(totalBudget) }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setStatusAnimation({
          status: "success",
          message: "Total budget updated successfully!",
        });
        setShowStatusAnimation(true);
        setTimeout(() => {
          setShowStatusAnimation(false);
        }, 3000);
      }
    } catch (error) {
      setStatusAnimation({
        status: "error",
        message: "Failed to update total budget",
      });
      setShowStatusAnimation(true);
      setTimeout(() => {
        setShowStatusAnimation(false);
      }, 3000);
    }
  };

  // Add category budget
  const handleAddCategory = async (newCategory) => {
    try {
      setShowStatusAnimation(true);
      setStatusAnimation({
        status: "success",
        message: "Category budget added successfully!",
      });
      setShowAddCategory(false);
      fetchBudgetData();
      setTimeout(() => {
        setShowStatusAnimation(false);
      }, 3000);
    } catch (error) {
      setStatusAnimation({
        status: "error",
        message: "Failed to add category budget",
      });
      setShowStatusAnimation(true);
      setTimeout(() => {
        setShowStatusAnimation(false);
      }, 3000);
    }
  };

  // Update category budget
  const handleUpdateCategory = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/budget/update/category/67cf12a40004818c2916",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: editingCategory.category,
            limit: Number(editingCategory.limit),
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setStatusAnimation({
          status: "success",
          message: "Category budget updated successfully!",
        });
        setShowStatusAnimation(true);
        setShowEditCategory(false);
        setEditingCategory(null);
        fetchBudgetData();
        setTimeout(() => {
          setShowStatusAnimation(false);
        }, 3000);
      }
    } catch (error) {
      setStatusAnimation({
        status: "error",
        message: "Failed to update category budget",
      });
      setShowStatusAnimation(true);
      setTimeout(() => {
        setShowStatusAnimation(false);
      }, 3000);
    }
  };

  // Delete category budget
  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/spendify/api/budget/delete/${categoryId}/67cf12a40004818c2916`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setStatusAnimation({
          status: "success",
          message: "Category budget deleted successfully!",
        });
        setShowStatusAnimation(true);
        fetchBudgetData();
        setTimeout(() => {
          setShowStatusAnimation(false);
        }, 3000);
      }
    } catch (error) {
      setStatusAnimation({
        status: "error",
        message: "Failed to delete category budget",
      });
      setShowStatusAnimation(true);
      setTimeout(() => {
        setShowStatusAnimation(false);
      }, 3000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="mb-4 text-2xl sm:text-3xl font-bold">
            Budget Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 space-y-4">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Budget Overview</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBudgetModal(true)}
                      className="hover:bg-purple-100">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] flex items-center justify-center">
                    <BudgetPieChart
                      totalBudget={totalBudget}
                      totalSpent={totalSpent}
                      remainingBudget={remainingBudget}
                      categories={categoryBudgets}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="md:col-span-5 overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Categories</CardTitle>
                  <Button
                    onClick={() => setShowAddCategory(true)}
                    className="h-8 text-sm gap-1">
                    <Plus className="h-3 w-3" />
                    Add Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CategoryList
                  categories={categoryBudgets}
                  onEditCategory={(category) => {
                    setEditingCategory(category);
                    setShowEditCategory(true);
                  }}
                  onDeleteCategory={handleDeleteCategory}
                />
              </CardContent>
            </Card>
          </div>

          {/* Budget Modal */}
          <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Total Budget</DialogTitle>
                <DialogDescription>
                  Set your monthly budget limit
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="Enter total budget"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowBudgetModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateTotalBudget();
                    setShowBudgetModal(false);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white">
                  Update Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Category Dialog */}
          <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category Budget</DialogTitle>
                <DialogDescription>
                  Set a budget limit for a new category
                </DialogDescription>
              </DialogHeader>
              <CategoryForm
                onSubmit={(newCategory) => {
                  if (newCategory) {
                    handleAddCategory(newCategory);
                  } else {
                    setShowAddCategory(false);
                  }
                }}
                onCancel={() => setShowAddCategory(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category Budget</DialogTitle>
                <DialogDescription>
                  Update the budget limit for this category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Category name"
                  value={editingCategory?.category || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      category: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Budget limit"
                  value={editingCategory?.limit || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      limit: e.target.value,
                    })
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowEditCategory(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCategory}
                  className="bg-purple-600 hover:bg-purple-700 text-white">
                  Update Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Status Animation */}
          <TransactionStatusAnimation
            status={statusAnimation.status}
            message={statusAnimation.message}
            isVisible={showStatusAnimation}
          />
        </div>
      </main>
    </div>
  );
}
