import React, { useState } from 'react'
import SideBarFooter from './SideBarFooter';
import SideBarHeader from './SiderBarHeader';
import ChatHistory from './ChatHistory';
function SideBar({
  isSidebarOpen,
  toggleSidebar,
  profile,
  sessions,
  currentSession,
  onSessionSelect,
  onNewChat  // Add this prop
}) {
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
        <SideBarHeader toggleSidebar={toggleSidebar} />
        <ChatHistory
          chatSessions={sessions}
          onSessionSelect={onSessionSelect}
          onNewChat={onNewChat}  // Pass it through
          currentSessionId={currentSession}
        />
        <SideBarFooter profile={profile} />
      </aside>
    </>
  );
}

export default SideBar
