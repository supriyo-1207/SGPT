import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';

function ChatHistory({
  chatSessions = [],
  onSessionSelect,
  onNewChat,
  currentSessionId,
  isLoading
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const truncateMessage = (message, wordLimit = 8) => {
    if (!message) return "New Chat";
    const words = message.split(' ');
    if (words.length <= wordLimit) return message;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-[calc(100%-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
      <div className="p-3 space-y-4">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2 
            bg-blue-600 text-white rounded-lg transition-all duration-200
            ${isLoading 
              ? 'opacity-70 cursor-not-allowed' 
              : 'hover:bg-blue-700 hover:shadow-md active:scale-98'
            }
          `}
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <PlusCircle size={20} />
          )}
          <span>New Chat</span>
        </button>

        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-3 py-2">
          <span className="text-sm font-medium text-gray-600">
            Recent Chats ({chatSessions.length})
          </span>
        </div>

        {/* Chat List */}
        <div className="divide-y divide-gray-100">
          {chatSessions.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              No chat history yet. Start a new conversation!
            </div>
          ) : (
            chatSessions.map((session, i) => (
              <div
                key={session._id}
                onClick={() => onSessionSelect(session._id)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  group relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent
                  cursor-pointer transition-all duration-300 ease-in-out border-l-4
                  ${session._id === currentSessionId ? 'border-blue-600 bg-blue-50' : 'border-transparent'}
                `}
              >
                <div className={`p-4 transition-all duration-300 ${
                  hoveredIndex === i ? 'translate-x-2' : ''
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm font-medium transition-all duration-300 ${
                      session._id === currentSessionId ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {truncateMessage(session.session_name)}
                    </p>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">
                        {formatDate(session.updatedAt)}
                      </span>
                      {session.message_count > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          {session.message_count} messages
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className={`
                  absolute left-0 top-0 w-1 h-full transition-all duration-300 transform
                  ${hoveredIndex === i || session._id === currentSessionId 
                    ? 'bg-blue-600 scale-y-100' 
                    : 'bg-transparent scale-y-0'}
                `} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;