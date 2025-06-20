import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatArea from '../components/MainChatComponents/ChatArea';
import InputArea from '../components/MainChatComponents/InputArea';
import SideBar from '../components/SideBarComponents/SideBar';
import NavBar from '../components/MainChatComponents/NavBar';
import Title from '../components/CommonComponents/Title';
import { toast } from 'react-toastify';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sgpt-backend.vercel.app',
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
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const messagesEndRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState('Gemini');
  const [isStreaming, setIsStreaming] = useState(false);
  const navigate = useNavigate();
  const [isHistoricalSession, setIsHistoricalSession] = useState(false);
  
  // Toggle sidebar visibility 
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check authentication status 
  const checkAuth = async () => {
    try {
      const response = await api.get('/chat');
      setProfile(response.data.user);
      setIsAuthenticated(true);
      fetchSessions();
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

  // Handle new chat session 
  const handleNewChat = async () => {
    setCurrentSession(null);
    setMessages([]);
    setIsHistoricalSession(false); // Reset historical session flag
  };

  // Fetch user's sessions
  const fetchSessions = async () => {
    try {
      const response = await api.get('/chat/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load chat sessions');
    }
  };

  // Fetch messages for current session
  const fetchSessionMessages = async (sessionId, page = 1) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/chat/sessions/${sessionId}/messages`, {
        params: { page, limit: 50 }
      });

      const { messages: newMessages, totalPages } = response.data;

      const sortedMessages = newMessages.sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      if (page === 1) {
        setMessages(sortedMessages);
      } else {
        setMessages(prev => [...sortedMessages, ...prev]);
      }

      setHasMoreMessages(page < totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new session
  const createSession = async (text) => {
    try {
      const maxChars = 15;
      let sessionName = text.length <= maxChars ? text : text.slice(0, maxChars).trim() + "...";

      const response = await api.post('/chat/sessions', {
        userId: profile._id,
        sessionName: sessionName
      });

      const newSession = {
        _id: response.data.sessionId,
        session_name: sessionName,
        message_count: 0
      };

      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(response.data.sessionId);
      return response.data.sessionId;

    } catch (error) {
      console.error('Session creation failed:', error);
      toast.error('Failed to create new chat session');
      return null;
    }
  };

  // Handle model selection change
  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  // Handle sending message
  const handleSendMessage = async (text) => {
    if (!text.trim() || !isAuthenticated) return;

    let sessionId = currentSession;

    if (!sessionId) {
      sessionId = await createSession(text);
      if (!sessionId) return;
    }

    // When sending a new message, we're no longer in a historical session
    setIsHistoricalSession(false);

    const userMessage = {
      id: Date.now(),
      content: text,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post('/chat/messages', {
        sessionId,
        message: text,
        model: selectedModel
      });

      const botMessage = {
        id: Date.now() + 1,
        content: response.data.message,
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setSessions(prev => prev.map(session =>
        session._id === sessionId
          ? { ...session, message_count: session.message_count + 2 }
          : session
      ));

      return response; // Return response for any additional functionality if needed

    } catch (error) {
      console.error('Message send error:', error);
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

  // Handle session selection
  const handleSessionSelect = async (sessionId) => {
    setCurrentSession(sessionId);
    setCurrentPage(1);
    setHasMoreMessages(true);
    setIsHistoricalSession(true); // Set historical session flag when selecting a session
    await fetchSessionMessages(sessionId, 1);
  };

  // Handle session deletion
  const handleDeleteSession = async (sessionId) => {
    try {
      setIsLoading(true);

      // API call to delete the session
      await api.delete(`/chat/sessions/${sessionId}`);

      // If the current session is being deleted, clear messages and session
      if (currentSession === sessionId) {
        setCurrentSession(null);
        setMessages([]);
        setIsHistoricalSession(false); // Reset historical session flag
      }

      // Remove the session from the list
      setSessions(prev => prev.filter(session => session._id !== sessionId));

      toast.success('Chat session deleted successfully');
    } catch (error) {
      console.error('Session deletion failed:', error);
      toast.error('Failed to delete chat session');
    } finally {
      setIsLoading(false);
    }
  };

  // Load more messages
  const handleLoadMore = async () => {
    if (!hasMoreMessages || !currentSession) return;
    await fetchSessionMessages(currentSession, currentPage + 1);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle continuous mode
  const toggleContinuousMode = (mode) => {
    setIsContinuousMode(mode);
  };

  useEffect(() => {
    checkAuth();

    return () => {
      setMessages([]);
      setIsAuthenticated(false);
      setSessions([]);
    };
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Title titleName="Chat" />

      <div className="flex flex-1 min-h-0">
        <SideBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          profile={profile}
          sessions={sessions}
          currentSession={currentSession}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          isLoading={isLoading}
        />

        <main className="flex flex-col flex-1 min-w-0">
          <NavBar
            toggleSidebar={toggleSidebar}
            handleModelChange={handleModelChange}
          />

          <div className="flex-1 flex flex-col min-h-0">
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
              hasMore={hasMoreMessages}
              messagesEndRef={messagesEndRef}
              isHistoricalSession={isHistoricalSession}
            />
            <InputArea
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onToggleContinuousMode={toggleContinuousMode}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;