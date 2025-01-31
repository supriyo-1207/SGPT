import React, { useState } from 'react'

function ChatArea() {
    const [message, setMessage] = useState('');
  
  const chatHistory = [
    { id: 1, message: 'Hello! How can I help you today?', type: 'bot' },
    { id: 2, message: 'I need help with React', type: 'user' },
    { id: 3, message: 'Sure! What specific help do you need with React?', type: 'bot' },
  ];
  return (
    <>
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-xl shadow-sm
                  ${chat.type === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-white text-gray-800'
                  }
                `}
              >
                {chat.message}
              </div>
            </div>
          ))}
        </div>

    </>
  )
}

export default ChatArea
