import React, { useState } from 'react';
import { Menu,} from 'lucide-react';
import ModelDropdown from './ModelDropdown';
function NavBar({ toggleSidebar }) {
  

  return (
    <nav className="h-16 bg-white border-b border-gray-100 flex items-center gap-2 px-4 shadow-sm relative">
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors transform hover:scale-110"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1">
       
        <ModelDropdown/>

      </div>

      {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors transform hover:scale-110">
        <Settings size={20} className="text-gray-600" />
      </button> */}
    </nav>
  );
}

export default NavBar;


