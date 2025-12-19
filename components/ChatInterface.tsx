
import React, { useState, useRef, useEffect } from 'react';
import { Supplier, ChatMessage } from '../types';
import { geminiService } from '../geminiService';

interface ChatInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
  availableSuppliers: Supplier[];
  recipient?: Supplier | null;
  initialMessage?: string | null;
  onExitDM?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isOpen, 
  onToggle, 
  availableSuppliers, 
  recipient,
  initialMessage,
  onExitDM
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages based on context (DM or Assistant)
  useEffect(() => {
    if (recipient) {
      setMessages([
        { 
          role: 'model', 
          text: `Hello! This is the Sales Team from ${recipient.name}. Thank you for reaching out. How can we assist you with our ${recipient.category} products today?` 
        }
      ]);
    } else {
      setMessages([
        { 
          role: 'model', 
          text: "Hello! I'm your Cambodian Sourcing Assistant. Tell me what you're looking for, and I'll find the best suppliers for you." 
        }
      ]);
    }
  }, [recipient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Handle auto-contact messages
  useEffect(() => {
    if (initialMessage && isOpen && recipient) {
      handleDirectMessage(initialMessage);
    }
  }, [initialMessage, isOpen, recipient]);

  const handleDirectMessage = async (text: string) => {
    if (!recipient) return;
    
    // Add user message if it's not already there (prevents duplicates if initialMessage changes)
    if (!messages.some(m => m.text === text && m.role === 'user')) {
      setMessages(prev => [...prev, { role: 'user', text }]);
    }
    
    setIsLoading(true);
    const responseText = await geminiService.getSupplierResponse(text, recipient);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    if (recipient) {
      // Direct message to owner (simulated)
      const responseText = await geminiService.getSupplierResponse(userMessage, recipient);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } else {
      // General AI assistant
      const aiResponse = await geminiService.getSupplierAdvice(userMessage, availableSuppliers);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse.text, links: aiResponse.links }]);
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all z-50 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[70vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              {recipient ? (
                <>
                  <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden shrink-0">
                    <img src={recipient.imageUrl} className="w-full h-full object-cover" alt={recipient.name} />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-sm truncate">{recipient.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Direct Message</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs shrink-0">
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Sourcing Assistant</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cambodia Concierge</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {recipient && onExitDM && (
                <button 
                  onClick={onExitDM}
                  className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                  title="Exit Direct Message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                </button>
              )}
              <button 
                onClick={onToggle}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Close Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-5 space-y-6 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Market Intelligence:</p>
                      {msg.links.map((link, lIdx) => (
                        <a 
                          key={lIdx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-xs text-blue-600 font-bold hover:underline flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-200 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                placeholder={recipient ? `Message ${recipient.name}...` : "Ask about sourcing from Cambodia..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-5 pr-14 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl transition-all outline-none text-sm font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-blue-600 disabled:bg-slate-200 transition-all shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatInterface;
