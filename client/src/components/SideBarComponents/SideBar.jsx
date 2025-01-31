import React, { useState } from 'react'
import SideBarFooter from './SideBarFooter';
import SideBarHeader from './SiderBarHeader';

function SideBar({isSidebarOpen, toggleSidebar}) {
  return (
    <>
      {/* Sidebar backdrop - only visible on mobile when sidebar is open */}
      <div 
        onClick={toggleSidebar}
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden
          transition-opacity duration-300 ease-in-out
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Sidebar */}
      <aside className={`
        fixed md:relative w-72 h-full bg-white shadow-lg
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-20
      `}>
        {/* Logo Header */}
       <SideBarHeader toggleSidebar={toggleSidebar} />
        {/* Chat History */}
        <div className="h-[calc(100%-8rem)] overflow-y-auto">
          <div className="p-3">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">Recent Chats</div>
            <div className="space-y-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                >
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Chat Session {i + 1}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">Last message from this conversation...</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Footer */}
       <SideBarFooter/>
      </aside>

    </>
  )
}

export default SideBar
