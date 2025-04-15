
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} />}
        <main className={`flex-1 ${isAuthenticated ? (isSidebarOpen ? "md:ml-64" : "") : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
