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
      textColor: 'text-purple-700'
    },
    { 
      name: 'GPT-4', 
      company: 'OpenAI',
      description: 'Powerful language understanding',
      color: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    { 
      name: 'Gemini', 
      company: 'Google',
      description: 'Multimodal AI capabilities',
      color: 'bg-green-100',
      textColor: 'text-green-700'
    },
    { 
      name: 'Mistral', 
      company: 'Mistral AI',
      description: 'Efficient open-source model',
      color: 'bg-orange-100',
      textColor: 'text-orange-700'
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
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onKeyDown={handleKeyDown}
        role="button"
        aria-expanded={dropdownOpen}
        className={`
          w-full flex items-center justify-between px-4 py-2
          border rounded-lg shadow-sm bg-white transition-all
          ${selectedModelData.textColor} hover:bg-gray-50
        `}
      >
        <div className="flex flex-col text-left">
          <span className="font-medium text-sm">{selectedModel}</span>
          <span className="text-xs text-gray-500">{selectedModelData.company}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div 
          role="listbox"
          className="absolute z-20 w-full mt-2 bg-white border rounded-lg shadow-lg overflow-hidden"
        >
          {models.map((model) => (
            <div 
              key={model.name}
              role="option"
              onClick={() => handleSelect(model)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(model)}
              tabIndex={0}
              className="
                flex flex-col px-4 py-2 cursor-pointer hover:bg-gray-100 transition-all
              "
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${model.textColor}`}>{model.name}</span>
                {selectedModel === model.name && <Check size={16} className={`${model.textColor}`} />}
              </div>
              <span className="text-xs text-gray-500">{model.company} - {model.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelDropdown;
