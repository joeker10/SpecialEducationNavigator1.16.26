import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, MapPin, RefreshCw, Activity, ShieldCheck } from 'lucide-react';
import { Message, Sender } from '../types';
import { sendMessageStream, initializeChatSession } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';
import { Button } from './Button';

interface ChatScreenProps {
  userState: string;
  onReset: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ userState, onReset }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'error'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize chat session on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      try {
        initializeChatSession(userState);
        setSystemStatus('online');
        
        // Add initial welcome message
        const welcomeMsg: Message = {
          id: 'init',
          sender: Sender.AI,
          text: `Welcome. I have calibrated my knowledge base for **${userState}** special education regulations (IDEA). \n\nI can help you navigate:\n*   IEP Timelines and Eligibility\n*   Dispute Resolution & Due Process\n*   Section 504 Plans\n\nHow can I assist you today?`,
          timestamp: new Date()
        };
        setMessages([welcomeMsg]);
      } catch (err) {
        setSystemStatus('error');
        console.error("Session Init Error:", err);
      }
      hasInitialized.current = true;
    }
  }, [userState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userText = inputValue.trim();
    setInputValue("");
    
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: Sender.USER,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    const aiMsgId = (Date.now() + 1).toString();
    const aiPlaceholder: Message = {
      id: aiMsgId,
      text: "...",
      sender: Sender.AI,
      timestamp: new Date(),
      isStreaming: true
    };
    setMessages(prev => [...prev, aiPlaceholder]);

    await sendMessageStream(
      userText,
      (textChunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, text: textChunk } : msg
        ));
      },
      (fullText, sources) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, text: fullText, isStreaming: false, groundingSources: sources } 
            : msg
        ));
        setIsThinking(false);
      },
      (error) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, text: "I encountered an error connecting to the knowledge base. Please ensure your environment is correctly authenticated.", isStreaming: false } 
            : msg
        ));
        setIsThinking(false);
        setSystemStatus('error');
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black font-sans">
      {/* Glass Header */}
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 py-4 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-900/20">
             <span className="text-xl">🧭</span>
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-zinc-100 leading-tight">Special Ed Navigator</h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <MapPin className="h-3 w-3 text-blue-500" />
              <span>Jurisdiction: <span className="text-zinc-200 font-medium">{userState}</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Diagnostic Status Indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
            systemStatus === 'online' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
            systemStatus === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
            'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
          }`}>
            <Activity className={`h-3 w-3 ${systemStatus === 'online' ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{systemStatus === 'online' ? 'Secure Link' : 'Sync Error'}</span>
          </div>

          <button 
            onClick={onReset}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all group"
            title="Change State"
          >
            <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-black scrollbar-hide">
        <div className="w-full mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {systemStatus === 'error' && (
            <div className="flex gap-3 p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-200 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-bold">Connection Authentication Error</p>
                <p className="opacity-80">The system is unable to connect to the knowledge base. This is often caused by an invalid API key or a session authentication failure with your host.</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 p-4 rounded-xl bg-blue-950/10 border border-blue-900/20 text-blue-200/60 text-xs md:text-sm mx-auto w-full mt-12">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-blue-500/50 mt-0.5" />
            <p>
              The Navigator provides guidance based on {userState} regulations. For legal representation, please contact a qualified education attorney or the local PTI linked in the responses.
            </p>
          </div>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-black via-black to-transparent relative z-20">
        <div className="w-full relative">
          <div className="relative flex items-end gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-2 shadow-2xl shadow-black/50 focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700/50 transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about specific rights, timelines, or dispute options..."
              className="flex-1 w-full bg-transparent border-none text-zinc-100 placeholder-zinc-500 text-sm md:text-base focus:ring-0 resize-none py-3.5 px-4 scrollbar-hide"
              rows={1}
              style={{ minHeight: '60px', maxHeight: '200px' }}
            />
            <Button 
              onClick={handleSend} 
              disabled={!inputValue.trim() || isThinking || systemStatus === 'error'}
              className="rounded-2xl h-10 w-10 md:h-12 md:w-12 !p-0 flex items-center justify-center flex-shrink-0 mb-1 mr-1"
            >
              <Send className="h-5 w-5 md:h-5 md:w-5 ml-0.5 mt-0.5" />
            </Button>
          </div>
          <div className="text-center mt-3 flex items-center justify-center gap-2">
             <ShieldCheck className="h-3 w-3 text-zinc-700" />
             <span className="text-[10px] text-zinc-600 font-medium tracking-wide">End-to-End Encrypted Knowledge Retrieval</span>
          </div>
        </div>
      </div>
    </div>
  );
};
