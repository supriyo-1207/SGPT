import React from 'react'
import { Settings,  User } from 'lucide-react';
function SideBarFooter() {
  return (
    <>
      {/* Profile Footer */}
      <div className="h-16 border-t border-gray-100 flex items-center px-4">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors w-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">User Name</p>
              <p className="text-xs text-gray-500 truncate">user@example.com</p>
            </div>
            <Settings size={18} className="text-gray-500" />
          </div>
        </div>
    </>
  )
}

export default SideBarFooter
