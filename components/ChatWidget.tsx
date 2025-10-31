import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { BotIcon, SendIcon } from '../constants';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chatRef.current) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a friendly and helpful support chatbot for FourFront IT, an MSP. Answer user questions about the company and its services concisely.',
                },
            });
            setMessages([{id: 1, text: "Hello! How can I help you with FourFront IT's services today?", sender: 'bot'}]);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: ChatMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!chatRef.current) throw new Error('Chat not initialized');
            const response = await chatRef.current.sendMessage({ message: input });
            const botMessage: ChatMessage = { id: Date.now() + 1, text: response.text, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot'};
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 animate-gentle-pulse"
                aria-label="Open chat widget"
            >
                <BotIcon className="w-8 h-8" />
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-5 w-80 h-[28rem] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col transition-opacity duration-300 animate-fade-in-up">
                    <div className="p-4 bg-gray-900 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-white">FourFront IT Support</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end animate-slide-in-right' : 'animate-slide-in-left'}`}>
                                {msg.sender === 'bot' && <BotIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />}
                                <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-end gap-2 animate-slide-in-left">
                                <BotIcon className="w-6 h-6 text-blue-400" />
                                <div className="px-3 py-2 bg-gray-700 rounded-lg">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-2 border-t border-gray-700 flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            className="flex-1 bg-gray-700 border-none rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none form-input-glow transition-shadow"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="ml-2 p-2 rounded-full text-blue-400 hover:bg-gray-700 disabled:text-gray-500">
                           <SendIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            )}
            <style jsx>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
            }
            `}</style>
        </>
    );
};

export default ChatWidget;
