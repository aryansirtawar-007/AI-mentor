import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Brain, Sparkles, Loader2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../lib/api';

interface Message {
  id?: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await api.chat.getHistory();
        setMessages(history);
      } catch (e) {
        console.error(e);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Optimistic update
    const tempUserMsg: Message = { role: 'user', text: userMessage, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await api.chat.sendMessage(userMessage);
      const aiMsg: Message = { role: 'model', text: response.text, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (confirm('Are you sure you want to clear your chat history?')) {
      try {
        await api.chat.clearHistory();
        setMessages([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-6 flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 glass p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-purple flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold">AI Career Mentor</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar"
      >
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-neon-purple" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">How can I help you today?</h3>
            <p className="text-slate-400 max-w-xs">
              Ask me about resume tips, interview prep, or how to switch careers.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id || idx}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-neon-blue' : 'bg-neon-purple'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Brain className="w-5 h-5 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-neon-blue/10 border border-neon-blue/20 text-slate-200' 
                    : 'glass-dark border border-white/10 text-slate-300'
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-neon-purple flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="glass-dark p-4 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-neon-purple animate-spin" />
                <span className="text-sm text-slate-400">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your career mentor anything..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white shadow-lg hover:shadow-neon-purple/25 transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
