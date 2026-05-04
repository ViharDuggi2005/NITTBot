/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2, MessageSquare, GraduationCap, Building2, Trophy, Coffee, MapPin, ChevronRight, LayoutDashboard, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { chatWithGemini } from './services/geminiService';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "How to get admission for B.Tech?",
  "What is the average package for CSE?",
  "Tell me about Festember.",
  "How are the hostel facilities?",
  "What is Octagon?",
  "NIRF Ranking of NITT"
];

export default function App() {
  const [activeChatId, setActiveChatId] = useState<string>('main');
  const [chats, setChats] = useState<Record<string, Message[]>>({
    main: [
      { role: 'bot', content: "Hi! I'm your **NITT Bot**. How can I help you today? You can ask about admissions, placements, campus life, or any specific department." }
    ],
    admissions: [
      { role: 'bot', content: "Welcome to the **Admissions Desk**. I can help with JoSAA, B.Tech eligibility, PG gate scores, or NRI admissions." }
    ],
    placements: [
      { role: 'bot', content: "This is the **Placement Portal Analyst**. Ask me about salary packages, top recruiters, or training for specific branches." }
    ],
    campus: [
      { role: 'bot', content: "Explore **NITT Campus Life**. Ask about fests like Festember, hostel facilities, or student clubs!" }
    ],
    contact: [
      { role: 'bot', content: "How can I help you reach us? I can provide **Contact Numbers**, Location details, or transport info." }
    ]
  });

  const messages = chats[activeChatId] || [];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChatId]);

  const handleSend = async (text: string = input, chatId: string = activeChatId) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    if (chatId === activeChatId) setInput('');
    
    // Update the specific chat's history
    setChats(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), { role: 'user', content: userMessage }]
    }));
    
    setIsLoading(true);

    try {
      const response = await chatWithGemini(userMessage, chats[chatId].map(m => ({
        role: m.role,
        content: m.content
      })));
      
      setChats(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), { role: 'bot', content: response }]
      }));
    } catch (error) {
      console.error(error);
      setChats(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), { role: 'bot', content: "Sorry, I encountered an error. Please try again later." }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const switchChat = (newId: string) => {
    setActiveChatId(newId);
  };

  return (
    <div className="flex h-screen w-full bg-[#F4F7F6] font-sans text-slate-800 overflow-hidden text-[14px]">
      {/* Sidebar - Visible on md and up */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col p-6 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden border border-slate-100 transition-transform hover:scale-110 cursor-pointer" onClick={() => switchChat('main')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/NITT_logo.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="NITT Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">NITT Bot</h1>
            <p className="text-xs text-slate-400 font-medium">Institute Bot</p>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <nav className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={10} /> Chat History
            </p>
            <button 
              onClick={() => switchChat('main')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-left transition-all ${
                activeChatId === 'main' ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeChatId === 'main' ? 'bg-blue-400 animate-pulse' : 'bg-slate-300'}`}></div>
              Main Console
            </button>
            <button 
              onClick={() => switchChat('admissions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left font-bold ${
                activeChatId === 'admissions' ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Building2 size={16} /> Admissions
            </button>
            <button 
              onClick={() => switchChat('placements')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left font-bold ${
                activeChatId === 'placements' ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Trophy size={16} /> Placements
            </button>
            <button 
              onClick={() => switchChat('campus')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left font-bold ${
                activeChatId === 'campus' ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Coffee size={16} /> Campus Life
            </button>
            <button 
              onClick={() => switchChat('contact')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left font-bold ${
                activeChatId === 'contact' ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <MapPin size={16} /> Contact Us
            </button>
          </nav>
        </div>


      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 md:px-10 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 bg-white border border-slate-100 rounded-md flex items-center justify-center p-1 shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/NITT_logo.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="NITT Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
                <span className="font-bold text-slate-800 text-sm tracking-tight capitalize">{activeChatId} Bot</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600">
               <Database size={14} /> Knowledge Graph
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-10 py-8 md:py-12 scroll-smooth bg-white/40"
        >
          <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={`${activeChatId}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'bot' && (
                    <div className="w-8 h-8 rounded-lg bg-[#003366] shrink-0 flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                      AI
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] md:max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-white px-5 py-3.5 rounded-2xl rounded-tr-none shadow-sm border border-slate-100 text-slate-700' 
                      : 'bg-[#003366] text-white px-5 py-3.5 rounded-2xl rounded-tl-none shadow-xl border border-blue-900/10'
                  }`}>
                    <div className={`prose prose-sm max-w-none ${message.role === 'bot' ? 'prose-invert font-light' : 'prose-slate font-medium'}`}>
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-0 leading-relaxed text-[13.5px]">{children}</p>,
                          ul: ({ children }) => <ul className="mt-2 space-y-1 mb-0 border-t border-white/10 pt-2">{children}</ul>,
                          li: ({ children }) => <li className="text-[12px] opacity-90"><span className="mr-2 opacity-50">•</span>{children}</li>,
                          strong: ({ children }) => <strong className="font-bold text-white border-b border-white/20">{children}</strong>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-500 text-xs shadow-sm">
                      U
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-[#003366] shrink-0 flex items-center justify-center text-white text-[10px] font-bold">
                  AI
                </div>
                <div className="bg-[#003366]/5 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generating Analyst Insights...</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Footer */}
        <div className="p-8 pt-0 shrink-0 bg-gradient-to-t from-[#F4F7F6] via-[#F4F7F6] to-transparent sticky bottom-0">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Quick Suggestions */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
              {(activeChatId === 'main' ? SUGGESTED_QUESTIONS : []).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="flex-shrink-0 px-4 py-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-full text-[11px] font-bold text-slate-600 hover:text-blue-700 transition-all shadow-sm active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Field */}
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask the ${activeChatId} desk...`}
                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4.5 pr-32 shadow-2xl shadow-blue-900/5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 transition-all font-medium placeholder:font-normal"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <span className="hidden sm:block text-[10px] text-slate-400 font-bold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">ENTER</span>
                <button 
                  disabled={isLoading || !input.trim()}
                  onClick={() => handleSend()}
                  className="bg-slate-900 hover:bg-black text-white p-2.5 rounded-xl transition-all shadow-lg active:scale-90 disabled:opacity-50 disabled:active:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Engineering Excellence • NIT Trichy
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


