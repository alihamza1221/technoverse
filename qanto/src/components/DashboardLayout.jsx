import { useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  MapPin,
  Plus,
  FileText,
  Vote,
  TrendingUp,
  Menu,
  LogOut,
  Settings,
  User,
  Bell,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function DashboardLayout({ children }) {
  const { user } = useContext(UserDataContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;

  const navigation = [
    { name: "Overview", href: "/", icon: TrendingUp },
    { name: "Report Issue", href: "/report", icon: Plus },
    { name: "My Issues", href: "/my-issues", icon: FileText },
    { name: "Proposals", href: "/proposals", icon: Vote },
    { name: "City Map", href: "/map", icon: MapPin },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const onLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Logout failed with status ${res.status}`);

      const data = await res.json();
      console.log(data.message); // "Logged out"

      // Optionally redirect or update UI after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div
            className={`flex items-center ${
              !sidebarOpen && "justify-center w-full"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
              SC
            </div>
            {sidebarOpen && (
              <span className="ml-3 font-semibold text-lg">Smart City</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={!sidebarOpen ? "hidden" : ""}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } ${!sidebarOpen && "justify-center"}`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive ? "text-blue-700" : "text-gray-500"
                      }`}
                    />
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer with user info */}
        <div className="border-t p-4">
          <div
            className={`flex items-center ${!sidebarOpen && "justify-center"}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImage || ""} />
              <AvatarFallback>
                {getInitials(user?.name || "User")}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700"
                >
                  {user?.role}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10 h-16">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 ml-2">
                Smart City Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user?.profileImage || ""} />
                      <AvatarFallback>
                        {getInitials(user?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      onClick={() => onLogout()}
                      className="flex items-center w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
