import React, { useRef, useEffect, useState } from "react";
import { Copy, Volume2, VolumeX } from "lucide-react";
import WelcomeMessage from "./WelcomeMessage";

const ChatArea = ({ messages, isLoading, messagesEndRef }) => {
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const synthesisRef = useRef(window.speechSynthesis);

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Speak text using speech synthesis
  const speakText = (text, messageId) => {
    synthesisRef.current.cancel();
    if (speakingMessageId === messageId) {
      setSpeakingMessageId(null);
      return;
    }

    // Strip HTML tags before speech synthesis
    const cleanText = stripHtmlTags(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeakingMessageId(messageId);
    utterance.onend = () => setSpeakingMessageId(null);

    synthesisRef.current.speak(utterance);
  };

  // Copy text to clipboard
  const handleCopy = (text) => {
    // Strip HTML tags before copying
    const cleanText = stripHtmlTags(text);
    navigator.clipboard.writeText(cleanText).catch(err => console.error('Failed to copy text: ', err));
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      synthesisRef.current.cancel();
    };
  }, []);

  // Scroll to the bottom of the chat area when messages or loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl
                  ${msg.type === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
                  }
                  transition-transform duration-200 hover:scale-[1.02]
                `}
              >
                <p
                  className="text-sm sm:text-base whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
                <div className="flex items-center justify-end gap-2 text-xs mt-2">
                  {msg.type === "bot" && (
                    <>
                      <button
                        className="text-gray-400 hover:text-gray-600 transition"
                        onClick={() => handleCopy(msg.content)}
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        className={`transition ${speakingMessageId === msg.id
                            ? "text-blue-600"
                            : "text-gray-400 hover:text-gray-600"
                          }`}
                        onClick={() => speakText(msg.content, msg.id)}
                      >
                        {speakingMessageId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </>
                  )}
                  <span className={`${msg.type === "user" ? "text-blue-100" : "text-gray-400"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="relative max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatArea;