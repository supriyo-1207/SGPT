import React, { useState } from 'react';

function ChatHistory({ chatSessions = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Function to truncate text and get first few meaningful words
  const truncateMessage = (message, wordLimit = 8) => {
    const words = message.split(' ');
    if (words.length <= wordLimit) return message;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <>
    {/* chat history */}
      <div className="h-[calc(100%-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="p-3 space-y-4">
          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-3 py-2">
            <span className="text-sm font-medium text-gray-600">Recent Chats</span>
          </div>

          {/* Chat List */}
          <div className="divide-y divide-gray-100">
            {chatSessions.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No chat history yet. Start a new conversation!
              </div>
            ) : (
              chatSessions.map((chat, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent cursor-pointer transition-all duration-300 ease-in-out border-l-4 border-transparent"
                >
                  <div className={`p-4 transition-all duration-300 ${
                    hoveredIndex === i ? 'translate-x-2' : ''
                  }`}>
                    <p className={`text-sm font-medium transition-all duration-300 ${
                      hoveredIndex === i ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {truncateMessage(chat.initialPrompt)}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute left-0 top-0 w-1 h-full transition-all duration-300 transform
                    ${hoveredIndex === i ? 'bg-blue-600 scale-y-100' : 'bg-transparent scale-y-0'}`}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatHistory;