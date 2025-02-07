import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const InputArea = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      if (isSpeaking) return;
      
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .trim();
      
      setMessage(transcript);
      
      if (event.results[event.results.length - 1].isFinal) {
        handleVoiceMessage(transcript);
      }
    };

    recognitionRef.current.onend = () => {
      if (isListening && !isSpeaking) {
        recognitionRef.current.start();
      }
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [isListening, isSpeaking]);

  const handleVoiceMessage = async (transcript) => {
    if (!transcript.trim()) return;
    
    try {
      recognitionRef.current?.stop();
      const response = await onSendMessage(transcript);
      setMessage('');
      
      if (response?.data?.message) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(response.data.message);
        
        utterance.onend = () => {
          setIsSpeaking(false);
          if (isListening) {
            recognitionRef.current?.start();
          }
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error handling voice message:', error);
      setIsSpeaking(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            placeholder={isListening ? (isSpeaking ? 'Bot is speaking...' : 'Listening...') : 'Type your message...'}
            rows="1"
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 max-h-[150px]"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-blue-600 text-white px-3 py-3 rounded-full 
              hover:bg-blue-700 active:bg-blue-800
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={isLoading || isSpeaking}
            className={`relative px-3 py-3 rounded-full transition-all duration-200 flex items-center justify-center
              ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 active:bg-gray-400'}
              ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <>
                <MicOff size={18} />
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
              </>
            ) : (
              <Mic size={18} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;