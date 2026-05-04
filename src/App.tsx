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
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hi! I'm your **NITT Assistant**. How can I help you today? You can ask about admissions, placements, campus life, or any specific department." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithGemini(userMessage, messages.map(m => ({
        role: m.role,
        content: m.content
      })));
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F4F7F6] font-sans text-slate-800 overflow-hidden text-[14px]">
      {/* Sidebar - Visible on md and up */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col p-6 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/10">
            N
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">NITT AI</h1>
            <p className="text-xs text-slate-400 font-medium">Institute Assistant</p>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
              <Database size={10} /> Dataset Info
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold text-slate-600">Assistant Status</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Online</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-none mt-2">200+</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-tighter font-medium">Questions Indexed</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={10} /> Experience
            </p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-100 text-slate-900 rounded-lg font-bold text-left transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              Main Console
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all text-left font-medium">
              <Building2 size={16} /> Admissions
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all text-left font-medium">
              <Trophy size={16} /> Placements
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all text-left font-medium">
              <Coffee size={16} /> Campus Life
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all text-left font-medium">
              <MapPin size={16} /> Contact Us
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 mt-auto">
          <div className="bg-slate-50 p-4 rounded-xl space-y-3">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#003366] flex items-center justify-center text-white text-[10px] font-bold">
                    UA
                </div>
                <div className="flex-1 text-[11px]">
                  <p className="font-bold text-slate-700 leading-none">NITT Student</p>
                  <p className="text-slate-400 mt-0.5">Joined via Portal</p>
                </div>
             </div>
             <p className="text-[10px] text-blue-600 font-bold bg-blue-50 p-2 rounded-lg text-center uppercase tracking-tighter">
                Accredited Knowledge Base
             </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 md:px-10 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 bg-[#003366] rounded-md flex items-center justify-center text-white font-bold text-sm">N</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
                <span className="font-bold text-slate-800 text-sm tracking-tight">NITT Assistant Console</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">AI-Powered University Guide</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600">
               <Database size={14} /> Training Data
            </button>
            <button className="px-5 py-2 text-xs font-bold bg-[#003366] text-white rounded-xl shadow-lg shadow-blue-900/20 hover:scale-105 transition-all active:scale-95">
                New Session
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-10 py-8 md:py-12 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
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
                    <div className={`prose prose-sm max-w-none ${message.role === 'bot' ? 'prose-invert' : 'prose-slate'}`}>
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-0 leading-relaxed text-[13.5px] font-medium">{children}</p>,
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
                  <Loader2 className="animate-spin w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Analyzing Dataset...</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Footer */}
        <div className="p-8 pt-0 shrink-0 bg-gradient-to-t from-[#F4F7F6] via-[#F4F7F6]/80 to-transparent">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Quick Suggestions */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-fade-right">
              {SUGGESTED_QUESTIONS.map((q, i) => (
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
                placeholder="Query the NITT Knowledge Base (200 questions indexed)..." 
                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4.5 pr-32 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-600 transition-all font-medium placeholder:font-normal"
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
              Developed for National Institute of Technology, Tiruchirappalli
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

