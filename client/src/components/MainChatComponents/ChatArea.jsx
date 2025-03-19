import React, { useState, useRef, useEffect } from "react";
import { Copy, Volume2, VolumeX } from "lucide-react";
import WelcomeMessage from "./WelcomeMessage";

const ChatArea = ({ messages, isLoading, messagesEndRef }) => {
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const [animatedMessages, setAnimatedMessages] = useState({});

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.type === "bot") {
      let words = lastMessage.content.split(" ");
      let tempMessage = "";
      let index = 0;

      const interval = setInterval(() => {
        if (index < words.length) {
          tempMessage += words[index] + " ";
          setAnimatedMessages((prev) => ({
            ...prev,
            [lastMessage.id]: tempMessage,
          }));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
    }
  }, [messages]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const speakText = (text, messageId) => {
    synthesisRef.current.cancel();
    if (speakingMessageId === messageId) {
      setSpeakingMessageId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeakingMessageId(messageId);
    utterance.onend = () => setSpeakingMessageId(null);

    synthesisRef.current.speak(utterance);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, animatedMessages]);

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
                  ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
                  }
                  transition-transform duration-200 hover:scale-[1.02]
                  animate-fade-in
                `}
              >
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                  {msg.type === "bot"
                    ? animatedMessages[msg.id] || ""
                    : msg.content}
                </p>

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
                        className={`transition ${
                          speakingMessageId === msg.id
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
