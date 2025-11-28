
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Bin, ChatMessage } from '../types';
import { TroubleshootingModal } from '../components/Modals';
import { geminiService } from '../services/GeminiService';

export const CompostDetailPage = ({ bin, onBack, onHarvestInstruction, onLogIssue, onOpenHistory }: { bin?: Bin, onBack: () => void, onHarvestInstruction: () => void, onLogIssue: (type: string, note: string) => void, onOpenHistory: () => void }) => {
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

    // Menggunakan GeminiService untuk logika chat
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
        <div className="min-h-screen bg-slate-50 p-6 pb-24 relative">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm">
                    <Icons.ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                   <h2 className="text-2xl font-bold text-gray-800">Detail Kompos</h2>
                   <p className="text-sm text-sage-600 font-medium">{binName} • Hari ke-{binDay}</p>
                </div>
                <button onClick={onOpenHistory} className="bg-white p-2 rounded-full shadow-sm relative">
                    <Icons.Clock className="w-6 h-6 text-sage-600" />
                    {bin?.logs && bin.logs.length > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
                </button>
            </div>

            {/* Monitoring Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-6">
                <div>
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                        <Icons.Thermometer className="w-4 h-4 text-red-500" /> Suhu Tumpukan
                    </h3>
                    <div className="flex gap-2">
                        {['Dingin', 'Hangat', 'Panas'].map((t) => (
                            <button key={t} onClick={() => setTemp(t)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${temp === t ? 'bg-red-50 border-red-200 text-red-600 ring-1 ring-red-400' : 'bg-gray-50 border-transparent text-gray-500'}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                        <Icons.Droplet className="w-4 h-4 text-blue-500" /> Kelembaban
                    </h3>
                    <div className="flex gap-2">
                        {['Kering', 'Lembab', 'Basah'].map((m) => (
                            <button key={m} onClick={() => setMoisture(m)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${moisture === m ? 'bg-blue-50 border-blue-200 text-blue-600 ring-1 ring-blue-400' : 'bg-gray-50 border-transparent text-gray-500'}`}>{m}</button>
                        ))}
                    </div>
                </div>
                <div>
                     <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                        <Icons.Wind className="w-4 h-4 text-sage-500" /> Aerasi (Udara)
                    </h3>
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isAerated ? 'bg-sage-50 border-sage-300' : 'bg-gray-50 border-transparent'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isAerated ? 'bg-sage-600 border-sage-600' : 'bg-white border-gray-300'}`}>
                            {isAerated && <Icons.Check className="w-3 h-3 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={isAerated} onChange={(e) => setIsAerated(e.target.checked)} />
                        <span className="text-sm text-gray-600 font-medium">Sudah diaduk hari ini?</span>
                    </label>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                <button onClick={() => setShowIssueModal("Bau")} className="bg-orange-50 p-2 rounded-xl border border-orange-100 flex flex-col items-center gap-1 hover:bg-orange-100"><Icons.AlertTriangle className="w-5 h-5 text-orange-500" /><span className="text-[9px] font-bold text-orange-700 text-center leading-tight">Bau Busuk</span></button>
                <button onClick={() => setShowIssueModal("Lalat")} className="bg-orange-50 p-2 rounded-xl border border-orange-100 flex flex-col items-center gap-1 hover:bg-orange-100"><Icons.AlertTriangle className="w-5 h-5 text-orange-500" /><span className="text-[9px] font-bold text-orange-700 text-center leading-tight">Ada Lalat</span></button>
                <button onClick={() => setShowIssueModal("Lama")} className="bg-orange-50 p-2 rounded-xl border border-orange-100 flex flex-col items-center gap-1 hover:bg-orange-100"><Icons.Clock className="w-5 h-5 text-orange-500" /><span className="text-[9px] font-bold text-orange-700 text-center leading-tight">Lama Terurai</span></button>
                <button onClick={() => setShowIssueModal("Lainnya")} className="bg-gray-100 p-2 rounded-xl border border-gray-200 flex flex-col items-center gap-1 hover:bg-gray-200"><Icons.HelpCircle className="w-5 h-5 text-gray-600" /><span className="text-[9px] font-bold text-gray-700 text-center leading-tight">Lainnya</span></button>
            </div>

            {/* Chat Interface */}
             <div className={`${isChatFullscreen ? 'fixed inset-0 z-50 bg-white p-0 flex flex-col' : 'bg-white rounded-2xl p-6 shadow-sm mb-6 border border-sage-100 relative'}`}>
                <div className={`flex items-center justify-between ${isChatFullscreen ? 'p-6 bg-sage-50 border-b border-sage-100' : 'mb-4'}`}>
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm"><Icons.Sparkles className="w-4 h-4 text-purple-500" /> Analisis & Konsultasi AI</h3>
                    <button onClick={() => setIsChatFullscreen(!isChatFullscreen)} className="text-gray-400 hover:text-sage-600 transition-colors p-1">
                        {isChatFullscreen ? <Icons.Minimize className="w-5 h-5" /> : <Icons.Maximize className="w-5 h-5" />}
                    </button>
                </div>
                
                <div className={`flex flex-col ${isChatFullscreen ? 'flex-1 overflow-hidden' : 'h-64'}`}>
                    {chatHistory.length === 0 ? (
                        <div className={`${isChatFullscreen ? 'flex-1 flex flex-col items-center justify-center p-6' : 'text-center flex-1 flex flex-col justify-center'}`}>
                            <p className="text-xs text-gray-400 mb-3">Isi data monitoring di atas, lalu minta analisis AI.</p>
                            <button onClick={handleStartAnalysis} className="w-full bg-purple-50 text-purple-700 py-3 rounded-xl font-bold text-sm border border-purple-100 hover:bg-purple-100">Mulai Analisis</button>
                        </div>
                    ) : (
                         <>
                             <div className={`flex-1 overflow-y-auto space-y-3 pr-1 ${isChatFullscreen ? 'p-6' : 'mb-3'}`}>
                                 {chatHistory.map((msg, idx) => (
                                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                         <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-sage-100 text-sage-800 rounded-tr-none' : 'bg-purple-50 text-purple-900 border border-purple-100 rounded-tl-none'}`}>{msg.text}</div>
                                     </div>
                                 ))}
                                 {isLoadingAI && <div className="flex justify-start"><div className="bg-purple-50 text-purple-400 p-3 rounded-2xl rounded-tl-none text-xs italic animate-pulse">Sedang mengetik...</div></div>}
                             </div>
                             <div className={`flex gap-2 items-center border-t border-gray-100 ${isChatFullscreen ? 'p-6 bg-white shrink-0' : 'pt-2 shrink-0'}`}>
                                 <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Tanya solusi, resep, produk..." className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"/>
                                 <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoadingAI} className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50"><Icons.Send className="w-4 h-4" /></button>
                             </div>
                         </>
                    )}
                </div>
             </div>

            {!isChatFullscreen && (
                <div className="mt-8">
                     <button onClick={onHarvestInstruction} className="w-full bg-white border-2 border-sage-600 text-sage-600 py-3 rounded-xl font-bold hover:bg-sage-50">Cek Kesiapan Panen (Hari 14)</button>
                </div>
            )}

            <TroubleshootingModal 
                isOpen={!!showIssueModal} 
                type={showIssueModal} 
                onClose={() => setShowIssueModal(null)} 
                onSolve={(note) => {
                    onLogIssue(showIssueModal || "Masalah", note);
                    setShowIssueModal(null);
                }} 
            />
        </div>
    );
};
