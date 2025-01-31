import React, { useState } from 'react';
import { Settings, Menu, ChevronDown } from 'lucide-react';

function NavBar({ toggleSidebar }) {
  const [selectedModel, setSelectedModel] = useState('Gemini');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const models = ['Gemini', 'GPT-4', 'GPT-3.5', 'Claude', 'Mistral'];

  return (
    <nav className="h-16 bg-white border-b border-gray-100 flex items-center gap-2 px-4 shadow-sm relative">
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors transform hover:scale-110"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-lg font-semibold text-gray-800 flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-110"
        >
          {selectedModel}
          <ChevronDown size={18} />
        </button>

        {dropdownOpen && (
          <div
            className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ease-out opacity-0 transform scale-95"
            style={{ animation: 'fadeInDown 0.3s forwards' }}
          >
            {models.map((model) => (
              <button
                key={model}
                onClick={() => {
                  setSelectedModel(model);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors transform hover:scale-105"
              >
                {model}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors transform hover:scale-110">
        <Settings size={20} className="text-gray-600" />
      </button> */}
    </nav>
  );
}

export default NavBar;

// CSS for animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeInDown {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

document.head.appendChild(style);
