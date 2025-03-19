import React, { useState } from "react";
import { PlusCircle, Loader2, Trash2 } from "lucide-react";

function ChatHistory({
  chatSessions = [],
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  currentSessionId,
  isLoading,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const truncateMessage = (message, wordLimit = 8) => {
    if (!message) return "New Chat";
    const words = message.split(" ");
    if (words.length <= wordLimit) return message;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = (e, sessionId) => {
    e.stopPropagation(); // Prevent triggering the session selection
    onDeleteSession(sessionId);
  };

  return (
    <div className="h-[calc(100%-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="p-4 space-y-4 bg-gray-50 shadow-md rounded-lg">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center gap-2 px-5 py-3
            bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg 
            transition-all duration-300 font-medium shadow-md
            ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-blue-600 hover:to-blue-800 hover:shadow-lg active:scale-95"
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
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg px-3 py-2 rounded-md shadow-sm">
          <span className="text-sm font-semibold text-gray-700">
            Recent Chats ({chatSessions.length})
          </span>
        </div>

        {/* Chat List */}
        <div className="divide-y divide-gray-200">
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
                  relative group cursor-pointer transition-all duration-300
                  border-l-4 rounded-md p-3 flex items-center justify-between
                  ${
                    session._id === currentSessionId
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-transparent hover:bg-gradient-to-r hover:from-gray-100 hover:to-transparent hover:shadow-sm"
                  }
                `}
              >
                <div
                  className={`flex-grow transition-transform duration-300 ${
                    hoveredIndex === i ? "translate-x-2" : ""
                  }`}
                >
                  <p
                    className={`text-sm font-medium truncate transition-all duration-300 ${
                      session._id === currentSessionId
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    {truncateMessage(session.session_name)}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(session.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Message Count Badge */}
                  {session.message_count > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full shadow-sm">
                      {session.message_count} messages
                    </span>
                  )}
                  
                  {/* Delete Button - Only visible on hover */}
                  <button
                    onClick={(e) => handleDelete(e, session._id)}
                    className={`
                      p-1.5 rounded-full transition-all duration-300
                      ${hoveredIndex === i ? "opacity-100" : "opacity-0"}
                      hover:bg-red-100 text-red-500 hover:text-red-600
                    `}
                    aria-label="Delete chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Left Hover Indicator */}
                <div
                  className={`absolute left-0 top-0 w-1 h-full transition-all duration-300 ${
                    hoveredIndex === i || session._id === currentSessionId
                      ? "bg-blue-600 scale-y-100"
                      : "bg-transparent scale-y-0"
                  }`}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;