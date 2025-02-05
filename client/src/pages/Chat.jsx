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
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check authentication status 
  const checkAuth = async () => {
    try {
      const response = await api.get('/chat');
      setProfile(response.data.user);
      setIsAuthenticated(true);
      // After authentication, fetch user's sessions
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
  const handleNewChat = async () => {
    setCurrentSession(null); // Clear current session
    setMessages([]); // Clear messages
  };
  // Fetch user's sessions
  const fetchSessions = async () => {
    try {
      const response = await api.get('/chat/sessions');
      console.log('Fetched sessions:', response.data.sessions); // Debug line
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load chat sessions');
    }
  };

  // Fetch messages for current session
// Fetch messages for current session
const fetchSessionMessages = async (sessionId, page = 1) => {
  try {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`, {
      params: { page, limit: 50 }
    });
    
    const { messages: newMessages, totalPages } = response.data;
    
    // Sort messages by timestamp to ensure correct order
    const sortedMessages = newMessages.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    if (page === 1) {
      setMessages(sortedMessages);
    } else {
      // For pagination, add new messages at the beginning
      setMessages(prev => [...sortedMessages, ...prev]);
    }
    
    setHasMoreMessages(page < totalPages);
    setCurrentPage(page);
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Failed to load messages');
  }
};

  // Create new session
  // Create new session
const createSession = async (text) => {
  try {
    // Create a better session name from the first message
    const sessionName = text
      // Split into words
      .split(' ')
      // Take first 6 words
      .slice(0, 6)
      // Join them back
      .join(' ')
      // Add ellipsis if original text was longer
      .concat(text.length > 6 ? '...' : '')
      // Limit total length to 30 characters
      .slice(0, 30)
      // Add ellipsis if we had to cut it
      .concat(text.length > 30 ? '...' : '');

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

  // Handle sending message
  const handleSendMessage = async (text) => {
    if (!text.trim() || !isAuthenticated) return;

    let sessionId = currentSession;

    if (!sessionId) {
      sessionId = await createSession(text);
      if (!sessionId) return;
    }

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
        message: text
      });

      const botMessage = {
        id: Date.now() + 1,
        content: response.data.message,
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Update session message count
      setSessions(prev => prev.map(session =>
        session._id === sessionId
          ? { ...session, message_count: session.message_count + 2 }
          : session
      ));

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
    await fetchSessionMessages(sessionId, 1);
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
          onNewChat={handleNewChat}  // Add this prop
        />

        <main className="flex flex-col flex-1 min-w-0">
          <NavBar toggleSidebar={toggleSidebar} />

          <div className="flex-1 flex flex-col min-h-0">
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
              hasMore={hasMoreMessages}
              messagesEndRef={messagesEndRef}
            />
            <InputArea
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;