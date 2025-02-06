import React from 'react';
import { Copy, Volume2 } from 'lucide-react';
import WelcomeMessage from './WelcomeMessage';

const ChatArea = ({ messages, isLoading, messagesEndRef }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl
                  ${msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                  }
                  transform transition-all duration-200 hover:scale-[1.02]
                  animate-fade-slide-in
                `}
              >
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                  {msg.content}
                </p>

                {/* Bottom Row: Copy, Sound, Timestamp */}
                <div className="flex items-center justify-end gap-2 text-xs mt-2">
                  {msg.type === 'bot' && (
                    <>
                      {/* Copy Icon */}
                      <button
                        className="text-gray-400 hover:text-gray-600 transition"
                        onClick={() => handleCopy(msg.content)}
                      >
                        <Copy size={14} />
                      </button>

                      {/* Sound Icon */}
                      <button
                        className="text-gray-400 hover:text-gray-600 transition"
                        onClick={() => console.log('Speak text logic here')}
                      >
                        <Volume2 size={14} />
                      </button>
                    </>
                  )}

                  {/* Timestamp */}
                  <span className={`${msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatArea;
