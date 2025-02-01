import React, { useState } from 'react';
import ChatArea from '../components/MainChatComponents/ChatArea';
import InputArea from '../components/MainChatComponents/InputArea';
import SideBar from '../components/SideBarComponents/SideBar';
import NavBar from '../components/MainChatComponents/NavBar';
import Title from '../components/CommonComponents/Title'



const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (text) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text,
      type: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response (replace with actual backend call)
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: `I received your message: "${text}"`,
        type: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  


    // Simulate bot response (replace with actual backend call)
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: `I received your message: "${text}"`,
        type: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };


  return (
    <>
      <Title titleName="Chat" />
      <div className="flex h-screen bg-gray-50">
        {/* Side Bar */}
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Navbar */}
          <NavBar toggleSidebar={toggleSidebar} />

          {/* Chat Area */}
          <ChatArea messages={messages} />
          {/* Input Area */}
          <InputArea onSendMessage={handleSendMessage} />
        </main>
      </div>
    </>
  );
};
// Add these styles to your CSS
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes fade-in-delay {
    0%, 50% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes fade-in-delay-2 {
    0%, 75% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes fade-slide-in {
    0% { 
      opacity: 0;
      transform: translateY(10px);
    }
    100% { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }

  .animate-fade-in-delay {
    animation: fade-in-delay 1s ease-out forwards;
  }

  .animate-fade-in-delay-2 {
    animation: fade-in-delay-2 1.4s ease-out forwards;
  }

  .animate-fade-slide-in {
    animation: fade-slide-in 0.3s ease-out forwards;
  }
`;

document.head.appendChild(style);
export default Chat;