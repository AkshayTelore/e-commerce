import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 font-bold text-2xl border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          <Link to="/admin" className="block hover:text-blue-400">
            Dashboard
          </Link>
          {/* More links can be added here */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        {/* Top bar */}
        <div className="h-16 bg-white shadow flex items-center justify-between px-6 relative">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
            Admin Dashboard
          </h1>
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
