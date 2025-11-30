
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { ChatSession, ChatMessage } from '../types';
import { geminiService } from '../services/GeminiService';
import { EditNameModal, DeleteConfirmModal } from '../components/Modals';

export const GlobalChatPage = ({ onBack, sessions, onUpdateSessions }: { onBack: () => void, sessions: ChatSession[], onUpdateSessions: (sessions: ChatSession[]) => void }) => {
    // view state is mostly for mobile. Desktop shows both.
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
    // If no active session selected on desktop, maybe select first? Or show placeholder.
    const chatHistory = activeSession ? activeSession.messages : [];

    // --- ACTIONS ---

    const startNewChat = () => {
        const newId = Date.now().toString();
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
        if (activeSessionId === id) setActiveSessionId(null);
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
        if (filter === 'recent') return true; 
        return true;
    });

    const sortedSessions = [...filteredSessions].sort((a, b) => {
        if (filter === 'all') {
             if (a.isPinned && !b.isPinned) return -1;
             if (!a.isPinned && b.isPinned) return 1;
        }
        return (b.id > a.id) ? 1 : -1; 
    });

    const SessionList = () => (
        <div className="flex flex-col h-full bg-slate-50 border-r border-gray-200">
             <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-10 md:hidden">
                <button onClick={onBack} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><Icons.ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                <div><h2 className="text-lg font-bold text-gray-800">Riwayat Chat</h2></div>
            </div>
            
            {/* Desktop Header for List */}
            <div className="hidden md:block p-4 bg-white border-b border-gray-100">
                 <h2 className="text-xl font-bold text-gray-800">Chat AI Global</h2>
            </div>

            <div className="bg-white px-4 pb-2 pt-2 flex gap-2 overflow-x-auto border-b border-gray-100 scrollbar-hide shrink-0">
                <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'all' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>Semua</button>
                <button onClick={() => setFilter('pinned')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'pinned' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}><Icons.Pin className="w-3 h-3 inline mr-1" /> Pin</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <button onClick={startNewChat} className="w-full bg-primary-600 text-white p-4 rounded-xl shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 mb-4 hover:bg-primary-700 transition-all"><Icons.Plus className="w-5 h-5" /><span className="font-bold">Chat Baru</span></button>
                
                {sortedSessions.length === 0 ? (
                    <div className="text-center text-gray-400 py-10 italic text-sm">Belum ada chat.</div> 
                ) : sortedSessions.map((session) => (
                    <div key={session.id} className="relative group">
                        <div 
                            onClick={() => openChat(session.id)} 
                            className={`w-full bg-white p-4 rounded-xl border shadow-sm flex flex-col items-start gap-1 transition-all text-left cursor-pointer ${activeSessionId === session.id ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50' : session.isPinned ? 'border-primary-200 bg-primary-50/30' : 'border-gray-100 hover:border-primary-200'}`}
                        >
                            <div className="flex justify-between w-full pr-6">
                                <h3 className="font-bold text-gray-800 truncate flex items-center gap-2 text-sm">
                                    {session.isPinned && <Icons.Pin className="w-3 h-3 text-primary-600 rotate-45" />}
                                    {session.title}
                                </h3>
                                <span className="text-[10px] text-gray-400 shrink-0">{session.date}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1 w-full">{session.messages.length > 0 ? session.messages[session.messages.length - 1].text : "..."}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === session.id ? null : session.id); }} className="absolute top-4 right-2 p-1 text-gray-400 hover:text-gray-600"><Icons.MoreVertical className="w-4 h-4" /></button>
                        {activeMenuId === session.id && (
                            <div className="absolute top-8 right-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-30 overflow-hidden">
                                <button onClick={(e) => { e.stopPropagation(); handlePin(session.id, !!session.isPinned); }} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50">{session.isPinned ? "Unpin" : "Pin"}</button>
                                <button onClick={(e) => { e.stopPropagation(); setSessionToRename(session); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50">Rename</button>
                                <button onClick={(e) => { e.stopPropagation(); setSessionToDelete(session); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const ChatWindow = () => (
        <div className="h-full flex flex-col bg-white">
             {activeSession ? (
                 <>
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                         <button onClick={() => setView('list')} className="md:hidden bg-gray-100 p-2 rounded-full"><Icons.ArrowLeft className="w-4 h-4" /></button>
                         <div>
                             <h2 className="font-bold text-gray-800">{activeSession.title}</h2>
                             <p className="text-xs text-gray-500">Asisten FoodAIRescue</p>
                         </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatHistory.length === 0 && <div className="h-full flex flex-col items-center justify-center opacity-40"><Icons.Bot className="w-16 h-16 mb-4" /><p>Mulai percakapan...</p></div>}
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>{msg.text}</div>
                            </div>
                        ))}
                        {isLoadingAI && <div className="flex justify-start"><div className="bg-gray-100 text-gray-500 p-3 rounded-2xl rounded-tl-none text-xs italic animate-pulse">Mengetik...</div></div>}
                    </div>
                    <div className="p-4 border-t border-gray-100 flex gap-2">
                         <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ketik pesan..." className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"/>
                         <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoadingAI} className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 shadow-lg disabled:opacity-50"><Icons.Send className="w-5 h-5" /></button>
                    </div>
                 </>
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400">
                     <Icons.MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                     <p>Pilih percakapan untuk memulai chat.</p>
                 </div>
             )}
        </div>
    );

    return (
        <div className="h-screen bg-white md:bg-gray-50 w-full">
            {/* Mobile: Switch Views */}
            <div className="md:hidden h-full">
                {view === 'list' ? <SessionList /> : <ChatWindow />}
            </div>

            {/* Desktop: Split View */}
            <div className="hidden md:grid md:grid-cols-[320px_1fr] h-full border-l border-gray-200 shadow-sm max-w-7xl mx-auto bg-white rounded-l-2xl overflow-hidden my-0 md:my-4 md:h-[calc(100vh-2rem)]">
                <SessionList />
                <ChatWindow />
            </div>

            <EditNameModal isOpen={!!sessionToRename} currentName={sessionToRename?.title || ""} onClose={() => setSessionToRename(null)} onSave={(newName) => sessionToRename && handleRename(sessionToRename.id, newName)} />
            <DeleteConfirmModal isOpen={!!sessionToDelete} binName={sessionToDelete?.title || "Chat"} onClose={() => setSessionToDelete(null)} onConfirm={() => sessionToDelete && handleDelete(sessionToDelete.id)} />
        </div>
    );
};
