import React, { useState } from 'react'
import { Send } from 'lucide-react';
function InputArea() {
    const [message, setMessage] = useState('');
  return (
    <>
    {/* Input Area */}
      <div className="border-t border-gray-100 bg-white p-4">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200"
            />
            <button className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2.5 
              rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-2">
              <span className="hidden sm:inline">Send</span>
              <Send size={18} />
            </button>
          </div>
        </div>
    </>
  )
}

export default InputArea
