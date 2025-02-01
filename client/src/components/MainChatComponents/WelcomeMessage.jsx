import React from 'react'
import {  Bot, Sparkles } from 'lucide-react';

const WelcomeMessage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4 space-y-6 text-center">
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur opacity-75 animate-pulse" />
                <div className="relative bg-white p-4 rounded-full">
                    <Bot size={40} className="text-blue-600" />
                </div>
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 animate-fade-in">
                    Welcome to SGPT
                </h1>
                <p className="text-gray-600 text-sm sm:text-base max-w-md animate-fade-in-delay">
                    Your intelligent assistant ready to help with any questions or tasks.
                </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 animate-fade-in-delay-2">
                <Sparkles size={16} className="text-blue-500" />
                Start by typing your message below
            </div>
        </div>
    );
};


export default WelcomeMessage
