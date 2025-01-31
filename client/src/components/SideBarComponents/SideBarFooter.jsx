import React, { useState } from 'react';
import { Settings, User, LogOut, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SideBarFooter() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Profile Footer */}
      <div className="h-16 border-t border-gray-100 flex items-center px-4 relative">
        <div 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors w-full"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <User size={20} className="text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">User Name</p>
            <p className="text-xs text-gray-500 truncate">user@example.com</p>
          </div>
          <Settings size={18} className="text-gray-500" />
        </div>
        
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 left-4 bg-white border border-gray-200 rounded-lg shadow-lg w-48 overflow-hidden"
            >
              <motion.button 
                whileHover={{ backgroundColor: '#f3f4f6' }}
                className="w-full text-left px-4 py-2 flex items-center gap-2"
              >
                <User size={16} /> Profile
              </motion.button>
              <motion.button 
                whileHover={{ backgroundColor: '#f3f4f6' }}
                className="w-full text-left px-4 py-2 flex items-center gap-2"
              >
                <Moon size={16} /> Dark Mode
              </motion.button>
              <motion.button 
                whileHover={{ backgroundColor: '#fee2e2' }}
                className="w-full text-left px-4 py-2 flex items-center gap-2 text-red-500"
              >
                <LogOut size={16} /> Logout
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default SideBarFooter;