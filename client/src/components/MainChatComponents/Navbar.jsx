import React from 'react'
import { Settings,  Menu } from 'lucide-react';
function NavBar({toggleSidebar}) {
  return (
    <>
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-gray-100 flex items-center gap-2 px-4 shadow-sm">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 flex-1">Current Chat</h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-600" />
          </button>
        </nav>
    </>
  )
}

export default NavBar
