import { useState } from "react";
import {
  User,
  Home,
  CreditCard,
  BarChart3,
  Settings,
  Calculator,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../components/ui/Profile/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/Dashboard/avatar";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState("/");

  const routes = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },

    {
      title: "Transactions",
      href: "/transactions",
      icon: CreditCard,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },

    {
      title: "Budget",
      href: "/budget",
      icon: Settings,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        onClick={toggleSidebar}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed md:static inset-y-0 left-0 z-50 
        w-64 bg-white border-r border-gray-200 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="border-b border-gray-200 py-4">
          <div className="flex items-center px-4">
            <div className="flex items-center gap-2 font-semibold text-xl">
              <div className="bg-purple-600 h-8 w-8 rounded-md flex items-center justify-center text-white">
                F
              </div>
              <span>Finance</span>
            </div>
          </div>
        </div>

        <div className="flex-1 py-4 overflow-auto">
          <nav className="px-2 space-y-1">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = activePath === route.href;

              return (
                <a
                  key={route.href}
                  href={route.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePath(route.href);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                    ${
                      isActive
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}>
                  <Icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/placeholder.svg?height=36&width=36"
                alt="User"
              />
              <AvatarFallback>GP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Gillian P.</span>
              <span className="text-xs text-gray-500">
                gillian.p@example.com
              </span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
