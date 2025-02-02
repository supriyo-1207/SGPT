import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatArea from '../components/MainChatComponents/ChatArea';
import InputArea from '../components/MainChatComponents/InputArea';
import SideBar from '../components/SideBarComponents/SideBar';
import NavBar from '../components/MainChatComponents/NavBar';
import Title from '../components/CommonComponents/Title';
import { toast } from 'react-toastify';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await api.get('/chat');
      setIsAuthenticated(true);
      toast.success('Connected to chat');
    } catch (error) {
      console.error('Auth check failed:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to access the chat');
        // navigate('/');
      } else {
        toast.error('Connection error. Please try again later.');
      }
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !isAuthenticated) return;

    const userMessage = {
      id: Date.now(),
      text,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { message: text });
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.message,
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status when component mounts
  useEffect(() => {
    checkAuth();
    
    // Cleanup function
    return () => {
      setMessages([]);
      setIsAuthenticated(false);
    };
  }, [navigate]);

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Checking authentication...</div>
    </div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Title titleName="Chat" />
      
      <div className="flex flex-1 min-h-0">
        <SideBar 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        
        <main className="flex flex-col flex-1 min-w-0">
          <NavBar toggleSidebar={toggleSidebar} />
          
          <div className="flex-1 flex flex-col min-h-0">
            <ChatArea 
              messages={messages} 
              isLoading={isLoading}
            />
            <InputArea 
              onSendMessage={handleSendMessage}
              disabled={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;