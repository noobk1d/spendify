"use client";

import { useState, useEffect } from "react";
import { Edit2, Check, CreditCard, Wallet, Building } from "lucide-react";
import { Button } from "../components/ui/Profile/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Profile/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Profile/tabs";
import { Progress } from "../components/ui/Profile/progress";
import { Input } from "../components/ui/Profile/input";
import ProfileSection from "../components/Profile/ProfileSection";
import CategoriesSection from "../components/Profile/CategoriesSection";
import BillsDebtSection from "../components/Profile/BillsDebtSection";
import ToolsSection from "../components/Profile/ToolsSection";

function ProfileDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [walletDistribution, setWalletDistribution] = useState({
    cash: 0,
    bank: 0,
    creditCard: 0,
  });
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editValues, setEditValues] = useState({ ...walletDistribution });
  const [showStatusAnimation, setShowStatusAnimation] = useState(false);
  const [statusAnimation, setStatusAnimation] = useState({
    status: "success",
    message: "",
  });

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          "http://127.0.0.1:3000/spendify/api/wallet",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Accept: "application/json",
              Origin: window.location.origin,
            },
            mode: "cors",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }

        const data = await response.json();
        if (data.status === "success") {
          // Parse the allocations string to JSON
          const parsedAllocations = JSON.parse(data.data.allocations);
          setWalletDistribution(parsedAllocations);
          setEditValues(parsedAllocations);
          setTotalBalance(data.data.totalBalance);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setShowStatusAnimation(true);
        setStatusAnimation({
          status: "error",
          message: "Failed to fetch wallet data. Please try again.",
        });
        setTimeout(() => {
          setShowStatusAnimation(false);
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleEditChange = (key, value) => {
    setEditValues({
      ...editValues,
      [key]: Number.parseFloat(value) || 0,
    });
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/wallet",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            Accept: "application/json",
            Origin: window.location.origin,
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(editValues),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update wallet data");
      }

      const data = await response.json();
      if (data.status === "success") {
        // Parse the allocations string to JSON
        const parsedAllocations = JSON.parse(data.data.allocations);
        setWalletDistribution(parsedAllocations);
        setEditValues(parsedAllocations);
        setTotalBalance(data.data.totalBalance);
        setShowStatusAnimation(true);
        setStatusAnimation({
          status: "success",
          message: "Wallet updated successfully!",
        });
        setTimeout(() => {
          setShowStatusAnimation(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating wallet data:", error);
      setWalletDistribution({ ...walletDistribution });
      setEditValues({ ...walletDistribution });
      setShowStatusAnimation(true);
      setStatusAnimation({
        status: "error",
        message: "Failed to update wallet. Please try again.",
      });
      setTimeout(() => {
        setShowStatusAnimation(false);
      }, 3000);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditValues({ ...walletDistribution });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 py-3">
        <div className="container px-4 space-y-3">
          {/* Wallet Balance Card - Full Width */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Wallet Balance
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1">
                {isEditing ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-2xl font-bold">
                  ${totalBalance.toFixed(2)}
                </div>
                <p className="text-sm text-green-500 mt-1">
                  +$250.00 this month
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Cash */}
                <Card className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Wallet className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">Cash</span>
                      </div>
                      {!isEditing && (
                        <span className="font-semibold">
                          ${walletDistribution.cash.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="mt-2">
                        <Input
                          type="number"
                          value={editValues.cash}
                          onChange={(e) =>
                            handleEditChange("cash", e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                    ) : (
                      <Progress
                        value={(walletDistribution.cash / totalBalance) * 100}
                        className="h-2 bg-green-100"
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Bank */}
                <Card className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Building className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Bank</span>
                      </div>
                      {!isEditing && (
                        <span className="font-semibold">
                          ${walletDistribution.bank.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="mt-2">
                        <Input
                          type="number"
                          value={editValues.bank}
                          onChange={(e) =>
                            handleEditChange("bank", e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                    ) : (
                      <Progress
                        value={(walletDistribution.bank / totalBalance) * 100}
                        className="h-2 bg-blue-100"
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Credit Card */}
                <Card className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <CreditCard className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">Credit Card</span>
                      </div>
                      {!isEditing && (
                        <span className="font-semibold">
                          ${walletDistribution.creditCard.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="mt-2">
                        <Input
                          type="number"
                          value={editValues.creditCard}
                          onChange={(e) =>
                            handleEditChange("creditCard", e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                    ) : (
                      <Progress
                        value={
                          (walletDistribution.creditCard / totalBalance) * 100
                        }
                        className="h-2 bg-purple-100"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="bills">Bills & Debt</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <ProfileSection />
            </TabsContent>
            <TabsContent value="categories" className="space-y-4">
              <CategoriesSection />
            </TabsContent>
            <TabsContent value="bills" className="space-y-4">
              <BillsDebtSection />
            </TabsContent>
            <TabsContent value="tools" className="space-y-4">
              <ToolsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {showStatusAnimation && (
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div
            className={`p-4 rounded-lg ${
              statusAnimation.status === "success"
                ? "bg-green-100"
                : "bg-red-100"
            }`}>
            <p
              className={`text-sm ${
                statusAnimation.status === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }`}>
              {statusAnimation.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDashboard;
