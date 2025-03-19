import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const ModelDropdown = ({ handleModelChange }) => {
  const [selectedModel, setSelectedModel] = useState('Gemini');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const models = [
    {
      name: 'Claude',
      company: 'Anthropic',
      description: 'Advanced reasoning & ethical AI',
      color: 'bg-purple-100',
      textColor: 'text-purple-700',
      lightColor: 'bg-purple-50',
      accentColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-50'
    },
    {
      name: 'GPT-4',
      company: 'OpenAI',
      description: 'Powerful language understanding',
      color: 'bg-blue-100',
      textColor: 'text-blue-700',
      lightColor: 'bg-blue-50',
      accentColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-50'
    },
    {
      name: 'Gemini',
      company: 'Google',
      description: 'Multimodal AI capabilities',
      color: 'bg-green-100',
      textColor: 'text-green-700',
      lightColor: 'bg-green-50',
      accentColor: 'border-green-200',
      hoverColor: 'hover:bg-green-50'
    },
    {
      name: 'Mistral',
      company: 'Mistral AI',
      description: 'Efficient open-source model',
      color: 'bg-orange-100',
      textColor: 'text-orange-700',
      lightColor: 'bg-orange-50',
      accentColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-50'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (model) => {
    setSelectedModel(model.name);
    setDropdownOpen(false);
    handleModelChange(model.name); // Notify parent component
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setDropdownOpen((prev) => !prev);
    }
  };

  const selectedModelData = models.find(m => m.name === selectedModel);

  return (
    <div ref={dropdownRef} className="relative w-full max-w-[250px]">
      {/* Dropdown Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onKeyDown={handleKeyDown}
        role="button"
        aria-expanded={dropdownOpen}
        className={`
          w-full flex items-center justify-between px-4 py-3
          border ${selectedModelData.accentColor} rounded-xl
          bg-white shadow-sm transition-all duration-200
          hover:shadow-md focus:outline-none
          ${dropdownOpen ? 'ring-2 ring-gray-200' : ''}
        `}
      >
        {/* Left side with model info */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${selectedModelData.color} flex items-center justify-center shadow-sm`}>
            <span className={`text-sm font-bold ${selectedModelData.textColor}`}>
              {selectedModel.substring(0, 1)}
            </span>
          </div>
          
          <div className="flex flex-col text-left">
            <span className={`font-semibold text-sm ${selectedModelData.textColor}`}>{selectedModel}</span>
            <span className="text-xs text-gray-500">{selectedModelData.company}</span>
          </div>
        </div>
        
        {/* Chevron icon */}
        <div className={`${selectedModelData.lightColor} p-1.5 rounded-full transition-colors`}>
          <ChevronDown 
            size={16} 
            className={`${selectedModelData.textColor} transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          role="listbox"
          className="absolute z-20 w-full mt-2 py-1 bg-white border rounded-xl shadow-xl overflow-hidden"
          style={{
            transform: 'translateY(4px)',
            animation: 'dropdown-fade 0.2s ease-out forwards'
          }}
        >
          {models.map((model) => (
            <div
              key={model.name}
              role="option"
              onClick={() => handleSelect(model)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(model)}
              tabIndex={0}
              className={`
                flex items-center px-4 py-2.5 cursor-pointer
                transition-colors duration-150
                ${selectedModel === model.name ? model.lightColor : model.hoverColor}
              `}
            >
              {/* Model icon */}
              <div className={`w-8 h-8 rounded-lg ${model.color} flex items-center justify-center mr-3 shadow-sm`}>
                <span className={`text-sm font-bold ${model.textColor}`}>
                  {model.name.substring(0, 1)}
                </span>
              </div>
              
              {/* Model details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${model.textColor}`}>{model.name}</span>
                  {selectedModel === model.name && (
                    <div className={`rounded-full ${model.color} p-1`}>
                      <Check size={14} className={model.textColor} />
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 truncate block">{model.company} - {model.description}</span>
              </div>
            </div>
          ))}

          {/* Footer with subtle divider */}
          <div className="mt-1 pt-1 border-t border-gray-100 px-4 py-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Model Selection</span>
              <span className="text-xs text-gray-400">{models.length} models</span>
            </div>
          </div>
        </div>
      )}

      {/* Adding animation keyframes with style tag */}
      <style jsx>{`
        @keyframes dropdown-fade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ModelDropdown;