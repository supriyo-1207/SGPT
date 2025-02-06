import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

const InputArea = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-gray-100 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows="1"
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 max-h-[150px]"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-blue-600 text-white px-3 py-3 rounded-full 
              hover:bg-blue-700 active:bg-blue-800
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-600 px-3 py-3 rounded-full 
              hover:bg-gray-300 active:bg-gray-400
              transition-all duration-200 flex items-center justify-center"
          >
            <Mic size={18} />
          </button>

        </div>
      </form>
    </div>
  );
};

export default InputArea;
