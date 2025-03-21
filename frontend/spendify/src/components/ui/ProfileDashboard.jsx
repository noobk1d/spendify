"use client"

import { useState } from "react"
import { Edit2, Check, CreditCard, Wallet, Building } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"
import { Input } from "../components/ui/input"
import ProfileSection from "../components/ProfileSection"
import CategoriesSection from "../components/CategoriesSection"
import BillsDebtSection from "../components/BillsDebtSection"
import ToolsSection from "../components/ToolsSection"

function Dashboard() {
  const [isEditing, setIsEditing] = useState(false)
  const [walletDistribution, setWalletDistribution] = useState({
    cash: 280.5,
    bank: 850.0,
    creditCard: 150.0,
  })

  const [editValues, setEditValues] = useState({ ...walletDistribution })

  const totalBalance = walletDistribution.cash + walletDistribution.bank + walletDistribution.creditCard

  const handleEditChange = (key, value) => {
    setEditValues({
      ...editValues,
      [key]: Number.parseFloat(value) || 0,
    })
  }

  const handleSaveEdit = () => {
    setWalletDistribution({ ...editValues })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditValues({ ...walletDistribution })
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <div className="flex items-center gap-4">
            <Tabs defaultValue="week" className="hidden md:block">
              <TabsList>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container px-4 space-y-6">
          {/* Wallet Balance Card - Full Width */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1"
              >
                {isEditing ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
                <p className="text-sm text-green-500 mt-1">+$250.00 this month</p>
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
                      {!isEditing && <span className="font-semibold">${walletDistribution.cash.toFixed(2)}</span>}
                    </div>
                    {isEditing ? (
                      <div className="mt-2">
                        <Input
                          type="number"
                          value={editValues.cash}
                          onChange={(e) => handleEditChange("cash", e.target.value)}
                          className="h-8"
                        />
                      </div>
                    ) : (
                      <Progress value={(walletDistribution.cash / totalBalance) * 100} className="h-2 bg-green-100" />
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
                      {!isEditing && <span className="font-semibold">${walletDistribution.bank.toFixed(2)}</span>}
                    </div>
                    {isEditing ? (
                      <div className="mt-2">
                        <Input
                          type="number"
                          value={editValues.bank}
                          onChange={(e) => handleEditChange("bank", e.target.value)}
                          className="h-8"
                        />
                      </div>
                    ) : (
                      <Progress value={(walletDistribution.bank / totalBalance) * 100} className="h-2 bg-blue-100" />
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
                      {!isEditing && <span className="font-semibold">${walletDistribution.creditCard.toFixed(2)}</span>}
                    </div>
                    {isEditing ? (
                      <div className="mt-2">
                        <Input
                          type="number"
                          value={editValues.creditCard}
                          onChange={(e) => handleEditChange("creditCard", e.target.value)}
                          className="h-8"
                        />
                      </div>
                    ) : (
                      <Progress
                        value={(walletDistribution.creditCard / totalBalance) * 100}
                        className="h-2 bg-purple-100"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Income Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">$</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,450.00</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>

            {/* Monthly Expenses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">$</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,890.50</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
          </div>

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
  )
}

export default Dashboard

