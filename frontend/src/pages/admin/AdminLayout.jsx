import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  UserPlus,
  PlusCircle,
  User,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Stores", to: "/admin/stores", icon: Store },
  { label: "Add User", to: "/admin/add-user", icon: UserPlus },
  { label: "Add Store", to: "/admin/add-store", icon: PlusCircle },
  { label: "Profile", to: "/admin/profile", icon: User },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        items={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Admin Panel" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
