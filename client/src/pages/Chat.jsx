import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatArea from '../components/MainChatComponents/ChatArea';
import InputArea from '../components/MainChatComponents/InputArea';
import SideBar from '../components/SideBarComponents/SideBar';
import NavBar from '../components/MainChatComponents/NavBar';
import Title from '../components/CommonComponents/Title';
import { toast } from 'react-toastify';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState({});
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Load chat sessions from the server
  const loadChatSessions = async () => {
    try {
      const response = await api.get('/chat/sessions');
      setChatSessions(response.data.sessions);
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      toast.error('Failed to load chat history');
    }
  };

  // Load messages for a specific chat session
  const loadChatSession = async (sessionId) => {
    try {
      const response = await api.get(`/chat/sessions/${sessionId}`);
      setMessages(response.data.messages);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error('Failed to load chat session:', error);
      toast.error('Failed to load chat messages');
    }
  };

  // Create a new chat session
  const createNewSession = async () => {
    try {
      const response = await api.post('/chat/sessions');
      const newSession = response.data.session;
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create new session:', error);
      toast.error('Failed to create new chat');
    }
  };

  const checkAuth = async () => {
    try {
      const response = await api.get('/chat');
      setProfile(response.data.user);
      setIsAuthenticated(true);
      await loadChatSessions();
      toast.success('Connected to chat');
    } catch (error) {
      console.error('Auth check failed:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to access the chat');
        navigate('/');
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
      const response = await api.post(`/chat/sessions/${currentSessionId}/messages`, {
        message: text
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.message,
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update chat session preview in the sidebar
      setChatSessions(prev => {
        const updatedSessions = [...prev];
        const sessionIndex = updatedSessions.findIndex(s => s.id === currentSessionId);
        if (sessionIndex !== -1) {
          updatedSessions[sessionIndex] = {
            ...updatedSessions[sessionIndex],
            lastMessage: text,
            updatedAt: new Date()
          };
        }
        return updatedSessions;
      });
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

  useEffect(() => {
    checkAuth();

    return () => {
      setMessages([]);
      setIsAuthenticated(false);
      setChatSessions([]);
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
          profile={profile}
          chatSessions={chatSessions}
          onSessionSelect={loadChatSession}
          onNewChat={createNewSession}
          currentSessionId={currentSessionId}
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
              disabled={isLoading || !currentSessionId}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;