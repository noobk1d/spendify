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

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:3000/spendify/api/wallet/67cf12a40004818c2916"
        );
        const data = await response.json();

        // Parse the allocations string into an object
        const allocations = JSON.parse(data.allocations);

        setWalletDistribution(allocations);
        setEditValues(allocations);
        setTotalBalance(data.totalBalance);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
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
      // First update the UI
      setWalletDistribution({ ...editValues });
      setIsEditing(false);

      // Then send the API request
      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/wallet/67cf12a40004818c2916",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            allocations: JSON.stringify(editValues),
            totalBalance: Object.values(editValues).reduce((a, b) => a + b, 0),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update wallet data");
      }

      // Refresh the wallet data to ensure we have the latest state
      const data = await response.json();
      const allocations = JSON.parse(data.allocations);
      setWalletDistribution(allocations);
      setEditValues(allocations);
      setTotalBalance(data.totalBalance);
    } catch (error) {
      console.error("Error updating wallet data:", error);
      // Revert the UI changes if the API call fails
      setWalletDistribution({ ...walletDistribution });
      setEditValues({ ...walletDistribution });
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
    </div>
  );
}

export default ProfileDashboard;
