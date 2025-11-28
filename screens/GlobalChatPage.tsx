
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { ChatSession, ChatMessage } from '../types';
import { geminiService } from '../services/GeminiService';
import { EditNameModal, DeleteConfirmModal } from '../components/Modals';

export const GlobalChatPage = ({ onBack, sessions, onUpdateSessions }: { onBack: () => void, sessions: ChatSession[], onUpdateSessions: (sessions: ChatSession[]) => void }) => {
    const [view, setView] = useState<'list' | 'chat'>('list');
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    
    // Filter State
    const [filter, setFilter] = useState<'all' | 'pinned' | 'recent'>('all');

    // Menu & Modal State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [sessionToRename, setSessionToRename] = useState<ChatSession | null>(null);
    const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);

    const activeSession = sessions.find(s => s.id === activeSessionId);
    const chatHistory = activeSession ? activeSession.messages : [];

    // --- ACTIONS ---

    const startNewChat = () => {
        const newId = Date.now().toString();
        // Gunakan format ISO untuk sorting date yang lebih akurat
        const newSession: ChatSession = {
            id: newId,
            title: "Percakapan Baru",
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            messages: []
        };
        onUpdateSessions([newSession, ...sessions]);
        setActiveSessionId(newId);
        setView('chat');
    };

    const openChat = (id: string) => { 
        setActiveSessionId(id); 
        setView('chat'); 
    };

    const handlePin = (id: string, currentPinStatus: boolean) => {
        const updated = sessions.map(s => s.id === id ? { ...s, isPinned: !currentPinStatus } : s);
        onUpdateSessions(updated);
        setActiveMenuId(null);
    };

    const handleRename = (id: string, newName: string) => {
        const updated = sessions.map(s => s.id === id ? { ...s, title: newName } : s);
        onUpdateSessions(updated);
        setSessionToRename(null);
    };

    const handleDelete = (id: string) => {
        const updated = sessions.filter(s => s.id !== id);
        onUpdateSessions(updated);
        setSessionToDelete(null);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !activeSessionId) return;
        const userMsg = inputMessage;
        setInputMessage("");

        const updatedSessions = sessions.map(s => {
            if (s.id === activeSessionId) {
                const newMessages = [...s.messages, { role: 'user', text: userMsg } as ChatMessage];
                const newTitle = s.messages.length === 0 ? (userMsg.substring(0, 20) + (userMsg.length > 20 ? "..." : "")) : s.title;
                return { ...s, title: newTitle, messages: newMessages };
            }
            return s;
        });
        onUpdateSessions(updatedSessions);
        
        setIsLoadingAI(true);
        const prompt = "Jawab pertanyaan umum seputar kompos/pangan. JANGAN pakai bintang (**). Gunakan list (-) jika perlu.";
        const responseText = await geminiService.chat(userMsg, chatHistory, prompt);
        
        const finalSessions = updatedSessions.map(s => {
            if (s.id === activeSessionId) {
                return { ...s, messages: [...s.messages, { role: 'model', text: responseText } as ChatMessage] };
            }
            return s;
        });
        onUpdateSessions(finalSessions);
        setIsLoadingAI(false);
    };

    // Filter Logic
    const filteredSessions = sessions.filter(session => {
        if (filter === 'pinned') return session.isPinned;
        if (filter === 'recent') {
            // Simplified recent check (assumes sorting does the heavy lifting for "recent" concept in this MVP)
            return true; 
        }
        return true;
    });

    // Sort sessions: Pinned first, then by date (assuming id is timestamp-ish or just stable)
    const sortedSessions = [...filteredSessions].sort((a, b) => {
        if (filter === 'all') {
             if (a.isPinned && !b.isPinned) return -1;
             if (!a.isPinned && b.isPinned) return 1;
        }
        return (b.id > a.id) ? 1 : -1; 
    });

    // --- RENDER LIST VIEW ---
    if (view === 'list') {
        return (
             <div className="h-screen bg-slate-50 flex flex-col relative" onClick={() => setActiveMenuId(null)}>
                <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-10">
                    <button onClick={onBack} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><Icons.ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                    <div><h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Icons.MessageSquare className="w-5 h-5 text-purple-600" /> Riwayat Chat</h2><p className="text-xs text-gray-500">Daftar percakapan Anda dengan AI</p></div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white px-4 pb-2 flex gap-2 overflow-x-auto border-b border-gray-100 scrollbar-hide">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${filter === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => setFilter('pinned')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${filter === 'pinned' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                        <Icons.Pin className="w-3 h-3" /> Pinned
                    </button>
                    <button 
                        onClick={() => setFilter('recent')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${filter === 'recent' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                        <Icons.Calendar className="w-3 h-3" /> Terbaru
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <button onClick={startNewChat} className="w-full bg-purple-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 mb-4 hover:bg-purple-700 transition-all"><Icons.Plus className="w-6 h-6" /><span className="font-bold">Mulai Percakapan Baru</span></button>
                    
                    {sessions.length === 0 ? (
                        <div className="text-center text-gray-400 py-10 italic">Belum ada riwayat chat.</div> 
                    ) : sortedSessions.length === 0 ? (
                        <div className="text-center text-gray-400 py-10 italic">Tidak ada chat sesuai filter.</div>
                    ) : sortedSessions.map((session) => (
                        <div key={session.id} className="relative group">
                            <div 
                                onClick={() => openChat(session.id)} 
                                className={`w-full bg-white p-4 rounded-xl border shadow-sm flex flex-col items-start gap-1 transition-all text-left cursor-pointer ${session.isPinned ? 'border-purple-300 bg-purple-50/50' : 'border-gray-100 hover:border-purple-200'}`}
                            >
                                <div className="flex justify-between w-full pr-8">
                                    <h3 className="font-bold text-gray-800 truncate flex items-center gap-2">
                                        {session.isPinned && <Icons.Pin className="w-3 h-3 text-purple-600 rotate-45" />}
                                        {session.title}
                                    </h3>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">{session.date}</span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-1 w-full">{session.messages.length > 0 ? session.messages[session.messages.length - 1].text : "..."}</p>
                            </div>

                            {/* Menu Trigger */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === session.id ? null : session.id);
                                }}
                                className="absolute top-4 right-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            >
                                <Icons.MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === session.id && (
                                <div className="absolute top-10 right-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handlePin(session.id, !!session.isPinned); }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                                    >
                                        <Icons.Pin className="w-4 h-4" /> {session.isPinned ? "Lepas Pin" : "Pin Chat"}
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setSessionToRename(session); setActiveMenuId(null); }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Icons.Edit className="w-4 h-4" /> Ganti Nama
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setSessionToDelete(session); setActiveMenuId(null); }}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                                    >
                                        <Icons.Trash className="w-4 h-4" /> Hapus
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Modals */}
                <EditNameModal 
                    isOpen={!!sessionToRename} 
                    currentName={sessionToRename?.title || ""} 
                    onClose={() => setSessionToRename(null)} 
                    onSave={(newName) => sessionToRename && handleRename(sessionToRename.id, newName)} 
                />
                <DeleteConfirmModal 
                    isOpen={!!sessionToDelete} 
                    binName={sessionToDelete?.title || "Percakapan"} 
                    onClose={() => setSessionToDelete(null)} 
                    onConfirm={() => sessionToDelete && handleDelete(sessionToDelete.id)} 
                />
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
