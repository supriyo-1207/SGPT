import React from "react";
import { X } from "lucide-react";

function SideBarHeader({ toggleSidebar }) {
  return (
    <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
      {/* Logo and Title (Always Visible) */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        {/*  Ensure SGPTChat is visible */}
        <span className="font-semibold text-gray-800">SGPTChat</span>
      </div>

      {/* Sidebar Toggle Button (Visible on Mobile) */}
      <button
        onClick={toggleSidebar}
        aria-label="Close Sidebar"
        className="md:hidden p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 hover:rotate-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <X size={20} className="text-gray-600 transition-colors duration-200 hover:text-gray-800" />
      </button>
    </div>
  );
}

export default SideBarHeader;
