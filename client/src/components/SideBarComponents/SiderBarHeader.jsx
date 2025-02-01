import React from 'react';
import { X, MessageSquare } from 'lucide-react';

function SideBarHeader({ toggleSidebar }) {
  return (
    <>
      {/* Logo Header */}
      <div className="h-16 px-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
            <MessageSquare 
              size={20} 
              className="text-white transform transition-transform duration-300 group-hover:scale-110" 
            />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-900">
            SGPT Chat
          </span>
        </div>
        
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 ease-in-out hover:rotate-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <X 
            size={20}
            className="text-gray-600 transition-colors duration-200 hover:text-gray-800" 
          />
        </button>
      </div>
    </>
  );
}

export default SideBarHeader;