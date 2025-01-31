import React from 'react'
import { X, MessageSquare } from 'lucide-react';
function SiderBarHeader({toggleSidebar}) {
  return (
    <>
       {/* Logo Header */}
       <div className="h-16 px-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare size={20} className="text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SGPT Chat
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

    </>
  )
}

export default SiderBarHeader
