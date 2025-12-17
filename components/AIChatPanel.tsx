import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Zap, BrainCircuit, RefreshCw } from 'lucide-react';
import { ChatMessage, FileNode, AnalysisMode } from '../types';
import { createChatSession, sendMessageStream, generateCodeAnalysis } from '../services/geminiService';
import { Chat } from "@google/genai";

interface AIChatPanelProps {
  currentFile: FileNode | null;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ currentFile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your Gemini-powered coding assistant. I can help you analyze, refactor, or explain your Remix project. Select a file to get started.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSession) {
      try {
        const session = createChatSession();
        setChatSession(session);
      } catch (e) {
        console.error("Failed to init chat", e);
      }
    }
  }, [chatSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: modelMsgId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isThinking: true
    }]);

    // Include context about current file if available
    let fullPrompt = input;
    if (currentFile) {
      fullPrompt = `[Context: User is currently viewing file: ${currentFile.name}]\n\n${input}`;
    }

    let accumulatedText = '';

    await sendMessageStream(chatSession, fullPrompt, (chunk) => {
      accumulatedText += chunk;
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, text: accumulatedText, isThinking: false } 
          : msg
      ));
    });

    setIsLoading(false);
  };

  const handleQuickAction = async (action: 'explain' | 'refactor' | 'bugs') => {
    if (!currentFile || !currentFile.content) return;

    const actionPrompts = {
      explain: "Explain this file's purpose and key logic in simple terms.",
      refactor: "Suggest a refactoring for this code to improve readability or performance.",
      bugs: "Identify potential bugs or security risks in this code."
    };

    const prompt = `[File: ${currentFile.name}]\n\`\`\`${currentFile.language}\n${currentFile.content}\n\`\`\`\n\n${actionPrompts[action]}`;
    
    // Simulate user typing the quick action
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: actionPrompts[action],
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // We can use the generic chat for this to maintain context
    if (chatSession) {
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now(),
        isThinking: true
      }]);

      let accumulatedText = '';
      await sendMessageStream(chatSession, prompt, (chunk) => {
        accumulatedText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, text: accumulatedText, isThinking: false } 
            : msg
        ));
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#151515] border-l border-remix-border w-96">
      {/* Header */}
      <div className="p-4 border-b border-remix-border bg-[#1A1A1A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-remix-accent" />
          <h2 className="font-semibold text-gray-200">Gemini Assistant</h2>
        </div>
        <div className="flex gap-1">
          <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700">
             2.5 Flash
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-remix-primary' : 'bg-remix-accent'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-remix-primary/20 text-gray-100 rounded-tr-none border border-remix-primary/30' 
                : 'bg-[#252525] text-gray-300 rounded-tl-none border border-remix-border'
            }`}>
              {msg.isThinking ? (
                <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                  <BrainCircuit className="w-3 h-3 animate-spin" />
                  Thinking...
                </div>
              ) : (
                <div className="whitespace-pre-wrap markdown-body">
                  {msg.text}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Actions (Only if file selected) */}
      {currentFile && !isLoading && (
        <div className="px-4 py-2 bg-[#1A1A1A] border-t border-remix-border flex gap-2 overflow-x-auto">
          <button 
            onClick={() => handleQuickAction('explain')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#333] border border-remix-border rounded-full text-xs text-gray-300 transition-colors whitespace-nowrap"
          >
            <Bot size={12} /> Explain
          </button>
          <button 
            onClick={() => handleQuickAction('refactor')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#333] border border-remix-border rounded-full text-xs text-gray-300 transition-colors whitespace-nowrap"
          >
            <RefreshCw size={12} /> Refactor
          </button>
          <button 
            onClick={() => handleQuickAction('bugs')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-[#333] border border-remix-border rounded-full text-xs text-gray-300 transition-colors whitespace-nowrap"
          >
            <Zap size={12} /> Find Bugs
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-[#1A1A1A] border-t border-remix-border">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={currentFile ? `Ask about ${currentFile.name}...` : "Ask anything about the project..."}
            className="w-full bg-[#121212] border border-remix-border rounded-lg pl-3 pr-10 py-3 text-sm text-gray-200 focus:outline-none focus:border-remix-primary focus:ring-1 focus:ring-remix-primary resize-none h-12 min-h-[48px] max-h-32"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bottom-2.5 p-1.5 bg-remix-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};