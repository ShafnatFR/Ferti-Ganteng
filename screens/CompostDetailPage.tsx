
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Bin, ChatMessage, IssueDetails } from '../types';
import { TroubleshootingModal } from '../components/Modals';
import { geminiService } from '../services/GeminiService';

export const CompostDetailPage = ({ bin, onBack, onHarvestInstruction, onLogIssue, onOpenHistory }: { bin?: Bin, onBack: () => void, onHarvestInstruction: () => void, onLogIssue: (type: string, note: string, details?: IssueDetails) => void, onOpenHistory: () => void }) => {
    const [temp, setTemp] = useState<string | null>(null);
    const [moisture, setMoisture] = useState<string | null>(null);
    const [isAerated, setIsAerated] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState<string | null>(null);
    
    // AI Chat State
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [isChatFullscreen, setIsChatFullscreen] = useState(false);
    
    const binName = bin ? bin.name : "Tong Kompos";
    const binDay = bin ? bin.day : 1;

    const handleStartAnalysis = async () => {
        if (!temp || !moisture) {
            alert("Mohon isi data Suhu dan Kelembaban terlebih dahulu.");
            return;
        }

        const logContext = bin?.logs.slice(-3).map(l => `- ${l.date}: ${l.title} (${l.description})`).join("\n") || "Tidak ada log terbaru.";
        
        const contextPrompt = `
            Anda adalah asisten ahli pengomposan.
            Data Tong:
            - Umur: ${binDay} Hari
            - Suhu: ${temp}
            - Kelembaban: ${moisture}
            - Aerasi: ${isAerated ? "Ya" : "Belum"}
            - Catatan Terakhir: ${logContext}

            INSTRUKSI OUTPUT:
            1. JANGAN gunakan bintang (**).
            2. Berikan analisis singkat dan rekomendasi.
            3. Gunakan poin-poin (-).
        `;

        setIsLoadingAI(true);
        setChatHistory([{ role: 'user', text: "Analisis kondisi tong kompos saya saat ini." }]);
        
        const response = await geminiService.chat("Berikan analisis berdasarkan data diatas.", [], contextPrompt);
        setChatHistory(prev => [...prev, { role: 'model', text: response }]);
        setIsLoadingAI(false);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        const userMsg = inputMessage;
        setInputMessage("");
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoadingAI(true);
        const prompt = "Jawab singkat, padat, solutif. JANGAN pakai bintang (**). Gunakan list (-) jika perlu.";
        const response = await geminiService.chat(userMsg, chatHistory, prompt);
        setChatHistory(prev => [...prev, { role: 'model', text: response }]);
        setIsLoadingAI(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-24 relative max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 md:hidden">
                    <Icons.ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                   <h2 className="text-2xl font-bold text-gray-800">Detail Kompos</h2>
                   <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                       {binName} 
                       <span className="bg-primary-100 text-primary-700 text-[10px] px-2 py-0.5 rounded-full">Hari ke-{binDay}</span>
                   </p>
                </div>
                <button onClick={onOpenHistory} className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    <Icons.Clock className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-bold text-gray-700 hidden md:inline">Riwayat</span>
                    {bin?.logs && bin.logs.length > 0 && <div className="w-2 h-2 bg-red-500 rounded-full md:hidden"></div>}
                </button>
            </div>

            {/* Main Content: Split Layout on Desktop */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Left Column: Monitoring & Controls */}
                <div className="flex-1 space-y-6">
                    {/* Monitoring Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 text-lg">Input Monitoring Harian</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Suhu</label>
                                <div className="flex gap-2">
                                    {['Dingin', 'Hangat', 'Panas'].map((t) => (
                                        <button key={t} onClick={() => setTemp(t)} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all border ${temp === t ? 'bg-red-50 border-red-200 text-red-600 ring-1 ring-red-400' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Kelembaban</label>
                                <div className="flex gap-2">
                                    {['Kering', 'Lembab', 'Basah'].map((m) => (
                                        <button key={m} onClick={() => setMoisture(m)} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all border ${moisture === m ? 'bg-sky-50 border-sky-200 text-sky-600 ring-1 ring-sky-400' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Aerasi</label>
                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isAerated ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isAerated ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
                                        {isAerated && <Icons.Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isAerated} onChange={(e) => setIsAerated(e.target.checked)} />
                                    <span className={`text-xs font-bold ${isAerated ? 'text-green-700' : 'text-gray-500'}`}>Sudah diaduk</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Quick Issues Grid */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-4 text-lg">Lapor Masalah</h3>
                         <div className="grid grid-cols-4 gap-3">
                            {[
                                { id: "Bau", label: "Bau Busuk", icon: Icons.AlertTriangle },
                                { id: "Lalat", label: "Ada Lalat", icon: Icons.AlertTriangle },
                                { id: "Lama", label: "Lama Terurai", icon: Icons.Clock },
                                { id: "Lainnya", label: "Lainnya", icon: Icons.HelpCircle }
                            ].map((issue) => (
                                <button key={issue.id} onClick={() => setShowIssueModal(issue.id)} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200 group transition-all">
                                    <issue.icon className="w-6 h-6 text-gray-400 group-hover:text-orange-500" />
                                    <span className="text-xs font-bold text-gray-600 group-hover:text-orange-700 text-center leading-tight">{issue.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button onClick={onHarvestInstruction} className="w-full bg-white border-2 border-primary-600 text-primary-600 py-4 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-sm">
                        Cek Panduan Panen
                    </button>
                </div>

                {/* Right Column: AI Chat Assistant */}
                <div className="lg:w-[400px] xl:w-[450px] shrink-0">
                    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-[500px] lg:h-[calc(100vh-140px)] sticky top-6 ${isChatFullscreen ? 'fixed inset-0 z-50 rounded-none h-full' : ''}`}>
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                                    <Icons.Sparkles className="w-4 h-4 text-primary-500" /> Analisis AI
                                </h3>
                                <p className="text-[10px] text-gray-500">Berdasarkan data input Anda</p>
                            </div>
                            <button onClick={() => setIsChatFullscreen(!isChatFullscreen)} className="text-gray-400 hover:text-gray-600 p-1">
                                {isChatFullscreen ? <Icons.Minimize className="w-5 h-5" /> : <Icons.Maximize className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <div className="flex-1 flex flex-col min-h-0 bg-white">
                            {chatHistory.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
                                    <div className="bg-primary-50 p-3 rounded-full mb-3">
                                        <Icons.Bot className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">Butuh saran ahli?</p>
                                    <p className="text-xs text-gray-400 mb-4">Isi data monitoring di sebelah kiri, lalu minta analisis.</p>
                                    <button onClick={handleStartAnalysis} className="px-6 py-2 bg-primary-600 text-white rounded-full font-bold text-xs shadow hover:bg-primary-700">
                                        Mulai Analisis
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'}`}>{msg.text}</div>
                                        </div>
                                    ))}
                                    {isLoadingAI && <div className="flex justify-start"><div className="bg-gray-50 text-gray-400 p-3 rounded-2xl rounded-tl-none text-xs italic animate-pulse">Sedang menganalisis...</div></div>}
                                </div>
                            )}
                            
                            <div className="p-3 border-t border-gray-100 bg-white">
                                <div className="flex gap-2 items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                                    <input 
                                        type="text" 
                                        value={inputMessage} 
                                        onChange={(e) => setInputMessage(e.target.value)} 
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                                        placeholder="Tanya..." 
                                        className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                                    />
                                    <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoadingAI} className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 w-8 h-8 flex items-center justify-center">
                                        <Icons.Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TroubleshootingModal 
                isOpen={!!showIssueModal} 
                type={showIssueModal} 
                onClose={() => setShowIssueModal(null)} 
                onSolve={(note, details) => {
                    onLogIssue(showIssueModal || "Masalah", note, details);
                    setShowIssueModal(null);
                }} 
            />
        </div>
    );
};
