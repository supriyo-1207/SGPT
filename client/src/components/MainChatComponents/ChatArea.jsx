import React, {useRef, useEffect } from 'react';
import WelcomeMessage from './WelcomeMessage';
const ChatArea = ({ messages }) => {
    const messagesEndRef = useRef(null);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl 
                    ${msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                    }
                    transform transition-all duration-200 hover:scale-[1.02]
                    animate-fade-slide-in
                  `}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                  <span className={`
                    text-xs mt-1 block
                    ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'}
                  `}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    );
  };

export default ChatArea
