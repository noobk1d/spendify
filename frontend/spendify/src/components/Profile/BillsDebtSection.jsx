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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Profile/table";
import { Edit2, Trash2, Plus, Check, X, AlertCircle } from "lucide-react";
import { Badge } from "../ui/Profile/badge";
import { Progress } from "../ui/Profile/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Profile/select";

function BillsDebtSection() {
  const [bills, setBills] = useState([
    {
      id: "1",
      name: "Electricity",
      amount: 120,
      dueDate: "2025-03-15",
      isPaid: false,
      category: "Utilities",
    },
    {
      id: "2",
      name: "Internet",
      amount: 75,
      dueDate: "2025-03-20",
      isPaid: true,
      category: "Utilities",
    },
    {
      id: "3",
      name: "Credit Card",
      amount: 350,
      dueDate: "2025-03-25",
      isPaid: false,
      category: "Debt",
    },
    {
      id: "4",
      name: "Rent",
      amount: 1200,
      dueDate: "2025-04-01",
      isPaid: false,
      category: "Housing",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newBill, setNewBill] = useState({
    name: "",
    amount: 0,
    dueDate: "",
    isPaid: false,
    category: "Other",
  });

  const [editForm, setEditForm] = useState(null);

  const handleAddBill = () => {
    if (newBill.name && newBill.amount > 0 && newBill.dueDate) {
      const id = Date.now().toString();
      setBills([...bills, { ...newBill, id }]);
      setNewBill({
        name: "",
        amount: 0,
        dueDate: "",
        isPaid: false,
        category: "Other",
      });
      setIsAdding(false);
    }
  };

  const handleEditBill = (bill) => {
    setEditingId(bill.id);
    setEditForm(bill);
  };

  const handleUpdateBill = () => {
    if (editForm) {
      setBills(
        bills.map((bill) => (bill.id === editForm.id ? editForm : bill))
      );
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleDeleteBill = (id) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  const handleTogglePaid = (id) => {
    setBills(
      bills.map((bill) =>
        bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
      )
    );
  };

  // Calculate total and paid amounts
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = bills
    .filter((bill) => bill.isPaid)
    .reduce((sum, bill) => sum + bill.amount, 0);
  const paymentProgress =
    totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  // Get upcoming bills (due in the next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingBills = bills
    .filter((bill) => !bill.isPaid && new Date(bill.dueDate) <= nextWeek)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Bills & Debt</CardTitle>
          <CardDescription>Manage your bills and debt</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Bill
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${totalAmount.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Total Bills</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${paidAmount.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payment Progress</span>
                  <span>{Math.round(paymentProgress)}%</span>
                </div>
                <Progress value={paymentProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {upcomingBills.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Upcoming Bills</h4>
              <p className="text-sm text-amber-700 mb-2">
                You have {upcomingBills.length} bills due in the next 7 days
              </p>
              <div className="flex flex-wrap gap-2">
                {upcomingBills.map((bill) => (
                  <Badge
                    key={bill.id}
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-200">
                    {bill.name}: ${bill.amount} (Due:{" "}
                    {new Date(bill.dueDate).toLocaleDateString()})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {isAdding && (
          <div className="mb-6 p-4 border rounded-md space-y-4 bg-muted/30">
            <h3 className="font-medium">Add New Bill</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-bill-name">Bill Name</Label>
                <Input
                  id="new-bill-name"
                  value={newBill.name}
                  onChange={(e) =>
                    setNewBill({ ...newBill, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-bill-amount">Amount</Label>
                <Input
                  id="new-bill-amount"
                  type="number"
                  value={newBill.amount || ""}
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
                      amount: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-bill-date">Due Date</Label>
                <Input
                  id="new-bill-date"
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) =>
                    setNewBill({ ...newBill, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-bill-category">Category</Label>
                <Select
                  value={newBill.category}
                  onValueChange={(value) =>
                    setNewBill({ ...newBill, category: value })
                  }>
                  <SelectTrigger id="new-bill-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Debt">Debt</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end space-x-2 md:col-span-2">
                <Button onClick={handleAddBill}>Add Bill</Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                {editingId === bill.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editForm?.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editForm?.category}
                        onValueChange={(value) =>
                          setEditForm({ ...editForm, category: value })
                        }>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Housing">Housing</SelectItem>
                          <SelectItem value="Debt">Debt</SelectItem>
                          <SelectItem value="Subscription">
                            Subscription
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={editForm?.amount || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            amount: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={editForm?.dueDate}
                        onChange={(e) =>
                          setEditForm({ ...editForm, dueDate: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={editForm?.isPaid ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            isPaid: !editForm?.isPaid,
                          })
                        }>
                        {editForm?.isPaid ? "Paid" : "Unpaid"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleUpdateBill}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{bill.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {bill.category}
                      </Badge>
                    </TableCell>
                    <TableCell>${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(bill.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={bill.isPaid ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTogglePaid(bill.id)}
                        className={
                          bill.isPaid ? "bg-green-600 hover:bg-green-700" : ""
                        }>
                        {bill.isPaid ? "Paid" : "Unpaid"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditBill(bill)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteBill(bill.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default BillsDebtSection;
