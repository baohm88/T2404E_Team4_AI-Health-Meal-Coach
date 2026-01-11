'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { aiService } from '@/services/ai.service';
import { MOCK_CHAT_HISTORY, ChatMessage } from '@/lib/mock-data';

export default function AiCoachPage() {
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        const aiResponse = await aiService.sendMessage(inputValue);
        setIsTyping(false);
        setMessages((prev) => [...prev, aiResponse]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-120px)]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            {/* Avatar */}
                            {message.role === 'ai' && (
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div
                                className={`px-4 py-3 rounded-2xl ${message.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-sm'
                                        : 'bg-white text-slate-800 shadow-sm rounded-tl-sm'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                                <p
                                    className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-slate-400'
                                        }`}
                                >
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-cream pt-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-5 py-4 rounded-2xl bg-white shadow-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
