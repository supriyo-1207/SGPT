import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Square } from 'lucide-react';

const InputArea = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Check if speech recognition is supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Change this to support different languages
      
      // Handle speech recognition results
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update message with final transcript
        if (finalTranscript) {
          setMessage(prev => prev + finalTranscript);
        }
      };
      
      // Handle speech recognition end
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      // Handle speech recognition errors
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Show user-friendly error messages
        switch (event.error) {
          case 'no-speech':
            alert('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            alert('Microphone not available. Please check your microphone settings.');
            break;
          case 'not-allowed':
            alert('Microphone access denied. Please allow microphone access and try again.');
            break;
          default:
            alert('Speech recognition error. Please try again.');
        }
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Start listening
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Could not start voice recognition. Please try again.');
      }
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening... Speak now" : "Type your message or click the mic to speak..."}
              rows="1"
              disabled={isLoading}
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 max-h-[150px] min-h-[48px]
                ${isListening 
                  ? 'border-red-300 bg-red-50 placeholder-red-400' 
                  : 'border-gray-200 bg-white'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
            {isListening && (
              <div className="absolute right-3 top-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600 font-medium">Recording</span>
                </div>
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className="bg-blue-600 text-white px-3 py-3 rounded-full
              hover:bg-blue-700 active:bg-blue-800
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center justify-center
              min-w-[48px] h-[48px]"
          >
            <Send size={18} />
          </button>
          
          {/* Voice Recognition Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading || !speechSupported}
            className={`px-3 py-3 rounded-full transition-all duration-200 
              flex items-center justify-center min-w-[48px] h-[48px]
              ${isListening 
                ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 active:bg-gray-400'
              }
              ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title={
              !speechSupported 
                ? 'Speech recognition not supported' 
                : isListening 
                  ? 'Stop recording' 
                  : 'Start voice input'
            }
          >
            {isListening ? <Square size={18} /> : <Mic size={18} />}
          </button>
        </div>
        
        {/* Status indicators */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {!speechSupported && (
            <span className="text-orange-600">
              Voice input not supported in this browser
            </span>
          )}
          {isListening && (
            <span className="text-red-600 animate-pulse">
              🔴 Listening... Click the microphone to stop
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputArea;