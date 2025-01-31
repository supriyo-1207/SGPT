import React, { useState } from 'react';
import ChatArea from '../components/MainChatComponents/ChatArea';
import InputArea from '../components/MainChatComponents/InputArea';
import SideBar from '../components/SideBarComponents/SideBar';
import NavBar from '../components/MainChatComponents/NavBar';
import { Helmet } from 'react-helmet'


const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Helmet>
        <title>Chat | SGPT</title>
      </Helmet>
      <div className="flex h-screen bg-gray-50">
        {/* Side Bar */}
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Navbar */}
          <NavBar toggleSidebar={toggleSidebar} />

          {/* Chat Area */}
          <ChatArea />
          {/* Input Area */}
          <InputArea />
        </main>
      </div>
    </>
  );
};

export default Chat;