import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, StopCircle } from 'lucide-react';
import { useChatStream } from '../hooks/useChatStream';
import { MessageBubble } from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatInterface() {
    const { messages, isLoading, sendMessage } = useChatStream();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const message = input;
        setInput('');

        // Reset height of textarea
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        await sendMessage(message);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Auto-resize
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
    };

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto p-2 md:p-6 relative">
            {/* Header */}
            <header className="flex items-center justify-between py-3 md:py-4 mb-2 md:mb-4 border-b border-white/10 px-2 md:px-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Sparkles className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">Sijo AI</h1>
                        <p className="text-[10px] md:text-xs text-zinc-400">Powered by LangChain & Groq</p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2 space-y-4 md:space-y-6 pb-4 px-1 md:px-0">
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full flex flex-col items-center justify-center text-center p-4 md:p-8 opacity-50"
                        >
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/5 flex items-center justify-center mb-4 md:mb-6 animate-pulse">
                                <Sparkles size={32} className="text-indigo-400 md:w-10 md:h-10" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">How can I help you?</h2>
                            <p className="text-sm md:text-base text-zinc-400 max-w-md">
                                Ask me about Sijo Sam's experience, skills, or projects. I can search through documents to find the best answer.
                            </p>
                        </motion.div>
                    ) : (
                        messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                role={msg.role}
                                content={msg.content}
                                timestamp={msg.timestamp}
                            />
                        ))
                    )}
                </AnimatePresence>

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex items-center gap-2 text-zinc-500 ml-14 animate-pulse">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-2 md:mt-4 relative z-10 px-1 md:px-0 pb-2 md:pb-0">
                <div className="relative glass rounded-2xl p-2 flex items-end gap-2 ring-1 ring-white/10 focus-within:ring-indigo-500/50 transition-all shadow-2xl shadow-black/50">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question..."
                        className="w-full bg-transparent border-0 focus:ring-0 resize-none max-h-[150px] md:max-h-[200px] min-h-[44px] py-3 px-3 md:px-4 text-sm md:text-base text-white placeholder:text-zinc-500 custom-scrollbar"
                        rows={1}
                    />
                    <button
                        onClick={() => handleSubmit()}
                        disabled={!input.trim() || isLoading}
                        className="p-2 md:p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white transition-colors shadow-lg shadow-indigo-600/20 mb-0.5 md:mb-1"
                    >
                        {isLoading ? <StopCircle size={18} className="md:w-5 md:h-5" /> : <Send size={18} className="md:w-5 md:h-5" />}
                    </button>
                </div>
                <div className="text-center mt-2 hidden md:block">
                    <p className="text-[10px] text-zinc-600">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
}
