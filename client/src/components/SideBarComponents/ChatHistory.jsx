import React from 'react'

function ChatHistory() {
  return (
    <>
    {/* Chat History */}
       <div className="h-[calc(100%-8rem)] overflow-y-auto">
          <div className="p-3">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">Recent Chats</div>
            <div className="space-y-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                >
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Chat Session {i + 1}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">Last message from this conversation...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>
  )
}

export default ChatHistory
