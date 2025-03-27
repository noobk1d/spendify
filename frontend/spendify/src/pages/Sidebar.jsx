import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Receipt,
  LineChart,
  PiggyBank,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/Profile/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/Dashboard/avatar";

export default function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Analytics", href: "/analytics", icon: LineChart },
    { name: "Budget", href: "/budget", icon: PiggyBank },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r">
      <div className="flex h-20 items-center border-b px-4">
        <img
          src="/Spendify-removebg-preview.png"
          alt="Spendify Logo"
          className="h-14 w-auto transition-transform hover:scale-105"
        />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}>
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
            <AvatarFallback>GP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Gillian P.</span>
            <span className="text-xs text-gray-500">gillian.p@example.com</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
