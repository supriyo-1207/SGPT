import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

function ChatArea() {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hi! I am SGPT. How can I assist you today?', type: 'bot' }
    ]);
    
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-xl shadow-inner flex flex-col items-center justify-center">
            {messages.length === 1 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-lg text-gray-600 bg-white px-6 py-4 rounded-lg shadow-md max-w-md"
                >
                    {messages[0].text}
                </motion.div>
            )}
            {messages.length > 1 && messages.map((msg) => (
                <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.type === 'user' ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-xs px-4 py-2 rounded-lg text-white ${msg.type === 'user' ? 'ml-auto bg-blue-500' : 'mr-auto bg-gray-700'}`}
                >
                    {msg.text}
                </motion.div>
            ))}
        </div>
    );
}
export default ChatArea
