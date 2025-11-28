
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { ChatSession, ChatMessage } from '../types';
import { geminiService } from '../services/GeminiService';

export const GlobalChatPage = ({ onBack, sessions, onUpdateSessions }: { onBack: () => void, sessions: ChatSession[], onUpdateSessions: (sessions: ChatSession[]) => void }) => {
    const [view, setView] = useState<'list' | 'chat'>('list');
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const activeSession = sessions.find(s => s.id === activeSessionId);
    const chatHistory = activeSession ? activeSession.messages : [];

    const startNewChat = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: "Percakapan Baru",
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            messages: []
        };
        onUpdateSessions([newSession, ...sessions]);
        setActiveSessionId(newId);
        setView('chat');
    };

    const openChat = (id: string) => { setActiveSessionId(id); setView('chat'); };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !activeSessionId) return;
        const userMsg = inputMessage;
        setInputMessage("");

        // Update local state immediately
        const updatedSessions = sessions.map(s => {
            if (s.id === activeSessionId) {
                const newMessages = [...s.messages, { role: 'user', text: userMsg } as ChatMessage];
                const newTitle = s.messages.length === 0 ? (userMsg.substring(0, 20) + (userMsg.length > 20 ? "..." : "")) : s.title;
                return { ...s, title: newTitle, messages: newMessages };
            }
            return s;
        });
        onUpdateSessions(updatedSessions);
        
        // Call AI Service
        setIsLoadingAI(true);
        const prompt = "Jawab pertanyaan umum seputar kompos/pangan. JANGAN pakai bintang (**). Gunakan list (-) jika perlu.";
        const responseText = await geminiService.chat(userMsg, chatHistory, prompt);
        
        // Update with response
        const finalSessions = updatedSessions.map(s => {
            if (s.id === activeSessionId) {
                return { ...s, messages: [...s.messages, { role: 'model', text: responseText } as ChatMessage] };
            }
            return s;
        });
        onUpdateSessions(finalSessions);
        setIsLoadingAI(false);
    };

    // --- RENDER LIST VIEW ---
    if (view === 'list') {
        return (
             <div className="h-screen bg-slate-50 flex flex-col">
                <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-10">
                    <button onClick={onBack} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><Icons.ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                    <div><h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Icons.MessageSquare className="w-5 h-5 text-purple-600" /> Riwayat Chat</h2><p className="text-xs text-gray-500">Daftar percakapan Anda dengan AI</p></div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <button onClick={startNewChat} className="w-full bg-purple-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 mb-4 hover:bg-purple-700 transition-all"><Icons.Plus className="w-6 h-6" /><span className="font-bold">Mulai Percakapan Baru</span></button>
                    {sessions.length === 0 ? <div className="text-center text-gray-400 py-10 italic">Belum ada riwayat chat.</div> : sessions.map((session) => (
                        <button key={session.id} onClick={() => openChat(session.id)} className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-start gap-1 hover:border-purple-200 transition-all text-left">
                            <div className="flex justify-between w-full"><h3 className="font-bold text-gray-800 truncate pr-4">{session.title}</h3><span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">{session.date}</span></div>
                            <p className="text-xs text-gray-500 line-clamp-1 w-full">{session.messages.length > 0 ? session.messages[session.messages.length - 1].text : "..."}</p>
                        </button>
                    ))}
                </div>
             </div>
        );
    }

    // --- RENDER CHAT VIEW ---
    return (
        <div className="h-screen bg-slate-50 flex flex-col">
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-10">
                <button onClick={() => setView('list')} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><Icons.ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                <div className="flex-1 overflow-hidden"><h2 className="text-lg font-bold text-gray-800 truncate">{activeSession?.title || "Chat AI"}</h2><p className="text-xs text-gray-500">Asisten FoodAIRescue</p></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 && <div className="flex flex-col items-center justify-center h-full text-center opacity-50 px-8"><Icons.Bot className="w-16 h-16 text-gray-300 mb-4" /><p className="text-sm text-gray-500">Halo! Saya siap membantu Anda.</p></div>}
                {chatHistory.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-sage-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>{msg.text}</div></div>
                 ))}
                 {isLoadingAI && <div className="flex justify-start"><div className="bg-white text-gray-400 p-3 rounded-2xl rounded-tl-none text-xs italic shadow-sm animate-pulse">Asisten sedang mengetik...</div></div>}
            </div>
            <div className="bg-white p-4 border-t border-gray-100 flex gap-2 items-center">
                 <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ketik pertanyaan..." className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"/>
                 <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoadingAI} className="bg-sage-600 text-white p-3 rounded-full hover:bg-sage-700 disabled:opacity-50 shadow-lg"><Icons.Send className="w-5 h-5" /></button>
            </div>
        </div>
    );
};
