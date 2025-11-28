import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Icons (Inline SVGs for reliability) ---
const Icons = {
  Leaf: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
  ),
  CloudRain: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>
  ),
  Camera: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
  ),
  WifiOff: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
  ),
  Share: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
  ),
  ShoppingBag: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  Thermometer: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
  ),
  Droplet: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2.69l5.74 5.88a6 6 0 0 1-8.48 8.48A6 6 0 0 1 5.56 8.57L12 2.69z"/></svg>
  ),
  Wind: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
  ),
  Clock: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  ArrowLeft: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
  ),
  Google: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg>
  ),
  AlertCircle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
  ),
  Plus: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  ),
  Trash: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
  ),
  Edit: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  ),
  X: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
  HelpCircle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
  )
};

// --- Types ---
interface LogEntry {
    date: string;
    title: string;
    description: string;
    type: 'info' | 'warning' | 'success';
}

interface Bin {
  id: number;
  name: string;
  status: string;
  phase: string;
  day: number;
  estHarvest: number;
  logs: LogEntry[];
}

// --- Screens ---

const SplashScreen = ({ onNext }: { onNext: () => void }) => (
  <div className="h-screen w-full bg-sage-400 flex flex-col items-center justify-center relative overflow-hidden" onClick={onNext}>
    {/* Organic Pattern Background */}
    <div className="absolute inset-0 opacity-10">
       <svg width="100%" height="100%">
         <circle cx="10%" cy="10%" r="50" fill="white"/>
         <circle cx="80%" cy="80%" r="80" fill="white"/>
         <path d="M0,50 Q50,0 100,50 T200,50" fill="none" stroke="white" strokeWidth="5"/>
       </svg>
    </div>

    <div className="z-10 flex flex-col items-center text-white animate-fade-in-up p-8">
      <div className="bg-white p-4 rounded-full mb-6 shadow-xl">
        <Icons.Leaf className="w-16 h-16 text-sage-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">Eco-Formulator AI</h1>
      <p className="text-lg font-light mb-8 text-center opacity-90">"Ubah Limbah Jadi Rupiah"</p>
      
      <p className="text-sm opacity-70 animate-pulse mt-12">Ketuk layar untuk mulai</p>
    </div>
  </div>
);

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="h-screen w-full bg-white flex flex-col p-8 justify-center">
    <div className="mb-10 text-center">
      <div className="inline-block bg-sage-100 p-4 rounded-full mb-4">
        <Icons.Leaf className="w-12 h-12 text-sage-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Selamat Datang</h2>
      <p className="text-gray-500 mt-2">Bergabung bersama FoodAIRescue untuk menyelamatkan pangan dan lingkungan.</p>
    </div>

    <div className="space-y-4">
      <button 
        onClick={onLogin}
        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
      >
        <Icons.Google className="w-5 h-5" />
        Masuk dengan Google
      </button>

      <button 
        onClick={onLogin}
        className="w-full bg-sage-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-sage-700 transition-all"
      >
        Lanjut sebagai Tamu
      </button>
    </div>

    <p className="mt-8 text-xs text-center text-gray-400">
      Dengan masuk, Anda menyetujui Syarat & Ketentuan FoodAIRescue.
    </p>
  </div>
);

const EditNameModal = ({ isOpen, currentName, onSave, onClose }: { isOpen: boolean, currentName: string, onSave: (name: string) => void, onClose: () => void }) => {
    const [name, setName] = useState(currentName);
    useEffect(() => { setName(currentName); }, [currentName, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-fade-in-up">
                <h3 className="text-lg font-bold mb-4">Ubah Nama Tong</h3>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl p-3 mb-6 focus:ring-2 focus:ring-sage-400 outline-none text-gray-800"
                    autoFocus
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-bold">Batal</button>
                    <button onClick={() => { onSave(name); onClose(); }} className="flex-1 py-3 bg-sage-600 rounded-xl text-white font-bold">Simpan</button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ isOpen, binName, onConfirm, onClose }: { isOpen: boolean, binName: string, onConfirm: () => void, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-fade-in-up">
                <h3 className="text-lg font-bold mb-2 text-red-600">Hapus Tong Kompos?</h3>
                <p className="text-gray-500 mb-6">Anda akan menghapus "{binName}". Data monitoring akan hilang.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-bold">Batal</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-bold border border-red-200">Hapus</button>
                </div>
            </div>
        </div>
    );
};

const TroubleshootingModal = ({ isOpen, type, onClose, onSolve }: { isOpen: boolean, type: string | null, onClose: () => void, onSolve: (note: string) => void }) => {
    const [customIssue, setCustomIssue] = useState("");
    if (!isOpen || !type) return null;

    const solutions: any = {
        "Bau": {
            title: "Kompos Berbau Busuk",
            solution: "Ini tanda kekurangan oksigen (anaerob) atau terlalu banyak air. Tambahkan material coklat (daun kering/sekam) dan aduk rata agar sirkulasi udara lancar."
        },
        "Lalat": {
            title: "Banyak Lalat / Belatung",
            solution: "Sampah makanan terekspos. Tutup rapat tong dan taburkan lapisan tanah atau kapur di bagian atas tumpukan untuk mencegah lalat bertelur."
        },
        "Lama": {
            title: "Proses Terurai Lama",
            solution: "Bakteri kurang aktif. Potong bahan organik lebih kecil dan tambahkan aktivator (seperti Petro Gladiator) atau air gula merah untuk memicu bakteri."
        },
        "Lainnya": {
            title: "Masalah Lain",
            solution: "Jelaskan masalah Anda, AI akan mencatatnya di riwayat dan menganalisis dampaknya."
        }
    };

    const content = solutions[type] || solutions["Lainnya"];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-fade-in-up">
                <div className="flex justify-between items-start mb-4">
                     <h3 className="text-lg font-bold text-orange-700 flex items-center gap-2">
                         <Icons.AlertTriangle className="w-5 h-5" /> {content.title}
                     </h3>
                     <button onClick={onClose}><Icons.X className="w-5 h-5 text-gray-400" /></button>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6 text-sm text-gray-700 leading-relaxed">
                    {content.solution}
                </div>

                {type === "Lainnya" && (
                    <textarea 
                        className="w-full border border-gray-300 rounded-xl p-3 mb-4 text-sm focus:ring-2 focus:ring-sage-400 outline-none"
                        placeholder="Tuliskan masalah yang Anda hadapi..."
                        rows={3}
                        value={customIssue}
                        onChange={(e) => setCustomIssue(e.target.value)}
                    ></textarea>
                )}

                <button 
                    onClick={() => {
                        const note = type === "Lainnya" ? customIssue : `Mengatasi masalah ${type}`;
                        onSolve(note || "Pencatatan masalah manual");
                        onClose();
                        setCustomIssue("");
                    }} 
                    className="w-full bg-sage-600 text-white py-3 rounded-xl font-bold shadow-lg"
                >
                    Terapkan Solusi & Catat
                </button>
            </div>
        </div>
    );
};

const Dashboard = ({ 
    bins, 
    onScan, 
    onViewDetail, 
    onDeleteBin, 
    onRenameBin 
}: { 
    bins: Bin[], 
    onScan: () => void, 
    onViewDetail: (bin: Bin) => void,
    onDeleteBin: (id: number) => void,
    onRenameBin: (id: number, newName: string) => void
}) => {
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [deletingBin, setDeletingBin] = useState<Bin | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-sage-400 p-6 rounded-b-3xl shadow-md text-white relative">
        <div className="flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-bold">Halo, Budi!</h2>
              <p className="text-sage-100 text-sm">Petani Kota Level 1</p>
           </div>
           <div className="bg-white/20 p-2 rounded-full">
              <Icons.Leaf className="w-6 h-6 text-white" />
           </div>
        </div>
        
        {/* SDG Summary Widget */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center justify-between">
           <div>
             <p className="text-xs text-sage-50">Total Dampak</p>
             <p className="text-xl font-bold">12.5 kg CO2e</p>
           </div>
           <Icons.CloudRain className="w-8 h-8 opacity-80" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        <h3 className="font-bold text-gray-700">Kompos Aktif</h3>

        {/* Dynamic List of Compost Bins */}
        {bins.length === 0 ? (
             <div className="text-center py-8 opacity-50">
                 <p className="text-gray-500 italic">Belum ada tong kompos.</p>
             </div>
        ) : bins.map((bin) => (
          <div key={bin.id} onClick={() => onViewDetail(bin)} className="bg-white rounded-2xl p-5 shadow-lg border border-sage-100 relative overflow-hidden cursor-pointer active:scale-95 transition-transform mb-4 group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{bin.name}</h3>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{bin.status}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Fase: {bin.phase}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                 <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">Hari ke-{bin.day}</span>
                 {/* Action Buttons */}
                 <div className="flex gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setEditingBin(bin)} 
                        className="p-1.5 bg-gray-100 rounded-full hover:bg-sage-100 text-gray-500 hover:text-sage-600 transition-colors"
                        aria-label="Edit Name"
                    >
                        <Icons.Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setDeletingBin(bin)} 
                        className="p-1.5 bg-gray-100 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Delete Bin"
                    >
                        <Icons.Trash className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
            
            {/* Progress Circle visual */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div 
                className="absolute top-0 left-0 h-full bg-sage-500 rounded-full" 
                style={{ width: `${Math.min((bin.day / 14) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
              <span>Estimasi Panen: {bin.estHarvest} Hari lagi</span>
              <span className="text-sage-600 font-bold flex items-center gap-1">
                Lihat Detail <Icons.ArrowLeft className="w-3 h-3 rotate-180" />
              </span>
            </div>
          </div>
        ))}

        {/* Add New Bin Button */}
        <button 
          onClick={onScan}
          className="w-full border-2 border-dashed border-sage-300 bg-sage-50 rounded-2xl p-6 flex flex-col items-center justify-center text-sage-500 hover:bg-sage-100 hover:border-sage-400 transition-all cursor-pointer group active:scale-95"
        >
           <div className="bg-white p-3 rounded-full mb-2 group-hover:scale-110 transition-transform shadow-sm">
              <Icons.Plus className="w-6 h-6 text-sage-600" />
           </div>
           <p className="text-sm font-bold text-sage-700">Tambah Tong Baru</p>
           <p className="text-xs text-sage-400 mt-1">Mulai siklus pengomposan baru</p>
        </button>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-xs font-bold text-sage-700 bg-white/80 px-2 py-1 rounded-full shadow-sm animate-bounce">Pindai Limbah</span>
        <button 
          onClick={onScan}
          className="bg-sage-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-sage-700 transition-colors ring-4 ring-white"
          aria-label="Scan Limbah"
        >
          <Icons.Camera className="w-8 h-8" />
        </button>
      </div>

      {/* Modals */}
      <EditNameModal 
        isOpen={!!editingBin} 
        currentName={editingBin?.name || ""} 
        onClose={() => setEditingBin(null)} 
        onSave={(newName) => editingBin && onRenameBin(editingBin.id, newName)}
      />
      
      <DeleteConfirmModal 
        isOpen={!!deletingBin}
        binName={deletingBin?.name || ""}
        onClose={() => setDeletingBin(null)}
        onConfirm={() => deletingBin && onDeleteBin(deletingBin.id)}
      />
    </div>
  );
};

const SmartScanner = ({ onAnalyze, onBack }: { onAnalyze: (img: string) => void, onBack: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const capture = () => {
    setLoading(true);
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        // Simulate "Gemini Processing" delay
        setTimeout(() => {
            onAnalyze(imageData);
        }, 1500);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-gray-900 overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* AR Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-sage-400 opacity-30 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-sage-400 shadow-[0_0_15px_rgba(141,163,153,1)] animate-scan"></div>
          </div>
          
          <div className="absolute top-10 left-10 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
          <div className="absolute top-10 right-10 w-16 h-16 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
          <div className="absolute bottom-24 left-10 w-16 h-16 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
          <div className="absolute bottom-24 right-10 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-xl"></div>
        </div>

        <div className="absolute top-1/2 left-0 w-full text-center transform -translate-y-1/2">
             <p className="text-white font-mono text-sm bg-black/50 inline-block px-4 py-2 rounded animate-pulse">
                {loading ? "Gemini AI sedang menganalisis..." : "Arahkan ke Limbah Pangan"}
             </p>
        </div>
      </div>

      <div className="h-32 bg-black flex items-center justify-center relative">
        <button onClick={onBack} className="absolute left-6 text-white text-sm">Kembali</button>
        <button 
          onClick={capture}
          disabled={loading}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
        >
           <div className="w-16 h-16 bg-white rounded-full"></div>
        </button>
      </div>
    </div>
  );
};

// Updated Analysis Page with "Food Rescue" Logic
const AnalysisPage = ({ image, aiResponse, onNext, onRescue }: { image: string, aiResponse: any, onNext: () => void, onRescue: () => void }) => {
    const data = aiResponse || {
        items: ["Sisa Sayuran"],
        ratio: 0.2,
        advice: "Limbah Anda butuh unsur Coklat!",
        is_edible: false
    };

    const isEdible = data.is_edible;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
            <div className="relative h-64 bg-gray-900">
                <img src={image} alt="Scanned" className="w-full h-full object-cover opacity-80" />
            </div>

            <div className="flex-1 p-6 -mt-6 bg-white rounded-t-3xl z-10 shadow-up">
                {/* Header Result */}
                <div className="flex justify-between items-start mb-4">
                   <div>
                     <h2 className="text-2xl font-bold text-gray-800">Hasil Deteksi</h2>
                     <p className="text-gray-500">{data.items.join(", ")}</p>
                   </div>
                   {isEdible ? (
                       <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                         Layak Makan
                       </span>
                   ) : (
                       <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                         Limbah Organik
                       </span>
                   )}
                </div>

                {isEdible ? (
                    /* Rescue Flow */
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl mb-6">
                        <div className="flex items-start gap-3">
                           <Icons.AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                           <div>
                             <h3 className="text-blue-800 font-bold text-lg">Penyelamatan Pangan!</h3>
                             <p className="text-blue-700 text-sm mt-1">
                               AI mendeteksi makanan ini masih layak konsumsi. Sesuai misi FoodAIRescue, sebaiknya didonasikan.
                             </p>
                           </div>
                        </div>
                        <button onClick={onRescue} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow hover:bg-blue-700">
                           Salurkan ke Mitra Donasi
                        </button>
                        <button onClick={onNext} className="mt-2 w-full text-blue-600 text-sm font-medium hover:underline">
                           Lanjut jadikan Kompos (Kondisi Rusak)
                        </button>
                    </div>
                ) : (
                    /* Compost Flow */
                    <>
                        <div className="mb-6">
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span className="text-green-600">Nitrogen (Hijau)</span>
                                <span className="text-stone-600">Karbon (Coklat)</span>
                            </div>
                            <div className="h-6 w-full bg-gradient-to-r from-green-500 via-yellow-300 to-stone-500 rounded-full relative">
                                <div 
                                    className="absolute -top-2 w-1 h-10 bg-black border-2 border-white shadow-md transform -translate-x-1/2 transition-all duration-1000"
                                    style={{ left: `${Math.min(Math.max(data.ratio * 100, 0), 100)}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium text-gray-600 bg-gray-100 py-2 rounded-lg">
                                {data.advice}
                            </div>
                        </div>
                        
                        <button onClick={onNext} className="w-full bg-sage-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-sage-700">
                            Buat Resep Kompos
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const RecipePage = ({ onFinish }: { onFinish: (name: string) => void }) => {
    const [binName, setBinName] = useState("");
    const [dateStr] = useState(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));

    // Auto-generate a name suggestion
    useEffect(() => {
        setBinName(`Kompos ${dateStr}`);
    }, [dateStr]);

    return (
        <div className="min-h-screen bg-white p-6 pb-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Formulasi Resep</h2>

            {/* Stepper */}
            <div className="space-y-8 relative mb-8">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                {/* Step 1 */}
                <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center text-white font-bold z-10">1</div>
                    <h3 className="font-bold text-lg text-gray-800">Bahan Penyeimbang</h3>
                    <div className="mt-3 bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-center gap-4">
                        <div className="bg-stone-200 p-3 rounded-full">
                            <Icons.Leaf className="text-stone-600" />
                        </div>
                        <div>
                            <p className="font-bold text-stone-700">2 Genggam</p>
                            <p className="text-sm text-stone-500">Daun Kering / Sekam</p>
                        </div>
                    </div>
                </div>

                {/* Step 2 - Native Ad */}
                <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold z-10">2</div>
                    <h3 className="font-bold text-lg text-gray-800">Aktivator Pengurai</h3>
                    
                    <div className="mt-4 bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                        <div className="flex gap-4">
                           <div className="w-20 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-center text-xs transform rotate-3 border-b-4 border-orange-800">
                                Petro<br/>Gladiator
                           </div>
                           <div className="flex-1">
                               <h4 className="font-bold text-orange-800">Petro Gladiator Cair</h4>
                               <p className="text-sm text-gray-600 mt-1 mb-3">Tuangkan 1 tutup botol (10ml) untuk mempercepat urai.</p>
                               <button onClick={() => window.open('https://pupuk-indonesia.co.id', '_blank')} className="bg-orange-600 text-white text-sm font-bold py-2 px-4 rounded-lg shadow hover:bg-orange-700 w-full">
                                   + Keranjang
                               </button>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Beri Nama Tong Kompos</label>
                    <input 
                        type="text" 
                        value={binName} 
                        onChange={(e) => setBinName(e.target.value)} 
                        className="w-full border-2 border-sage-100 rounded-xl px-4 py-3 focus:border-sage-500 focus:outline-none bg-sage-50/50"
                        placeholder="Contoh: Kompos Dapur"
                    />
                </div>
                <button onClick={() => onFinish(binName)} className="w-full bg-sage-600 text-white py-4 rounded-xl font-bold shadow-lg text-lg hover:bg-sage-700 transition-colors">
                    Mulai Kompos
                </button>
            </div>
        </div>
    );
};

const HistoryPage = ({ bin, onBack }: { bin: Bin, onBack: () => void }) => {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="bg-white p-2 rounded-full shadow-sm">
                    <Icons.ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                   <h2 className="text-2xl font-bold text-gray-800">Riwayat Aktivitas</h2>
                   <p className="text-sm text-sage-600 font-medium">{bin.name}</p>
                </div>
            </div>

            <div className="space-y-4">
                {bin.logs.length === 0 ? (
                    <div className="text-center text-gray-400 py-10 italic">Belum ada riwayat tercatat.</div>
                ) : [...bin.logs].reverse().map((log, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                log.type === 'warning' ? 'bg-orange-100 text-orange-700' : 
                                log.type === 'success' ? 'bg-green-100 text-green-700' : 
                                'bg-gray-100 text-gray-600'
                            }`}>
                                {log.date}
                            </span>
                        </div>
                        <h4 className="font-bold text-gray-800">{log.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{log.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Replaces previous MonitoringPage to be more detailed "Detail Kompos"
const CompostDetailPage = ({ bin, onBack, onHarvestInstruction, onLogIssue, onOpenHistory }: { bin?: Bin, onBack: () => void, onHarvestInstruction: () => void, onLogIssue: (type: string, note: string) => void, onOpenHistory: () => void }) => {
    const [temp, setTemp] = useState<string | null>(null);
    const [moisture, setMoisture] = useState<string | null>(null);
    const [isAerated, setIsAerated] = useState(false);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [showIssueModal, setShowIssueModal] = useState<string | null>(null);
    
    // Fallback if no bin selected
    const binName = bin ? bin.name : "Tong Kompos";
    const binDay = bin ? bin.day : 1;

    // AI Logic for analysis button
    const handleAnalyze = async () => {
        setAiAdvice("Sedang menganalisis...");
        // Simulating AI delay
        setTimeout(() => {
             let advice = [];
             if (temp === 'Panas') advice.push("Suhu panas menandakan aktivitas mikroba sangat baik.");
             else if (temp === 'Dingin') advice.push("Suhu dingin. Perlu dicek apakah terlalu kering atau C/N rasio tidak seimbang.");
             
             if (moisture === 'Kering') advice.push("Terlalu kering menghambat penguraian.");
             else if (moisture === 'Basah') advice.push("Terlalu basah memicu bau busuk.");
             
             if (isAerated) advice.push("Pengadukan rutin sangat membantu oksigenasi.");
             else advice.push("Jangan lupa mengaduk agar tidak anaerob.");

             if (advice.length === 0) advice.push("Kondisi tampak stabil. Lanjutkan pemantauan rutin.");

             setAiAdvice(advice.join(" "));
        }, 1000);
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

            {/* Interactive Monitoring Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-6">
                
                {/* Temperature */}
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

                {/* Moisture */}
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

                {/* Aeration */}
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

            {/* Quick Actions / Troubleshooting */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                <button onClick={() => setShowIssueModal("Bau")} className="bg-orange-50 p-2 rounded-xl border border-orange-100 flex flex-col items-center gap-1 hover:bg-orange-100">
                    <Icons.AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span className="text-[9px] font-bold text-orange-700 text-center leading-tight">Bau Busuk</span>
                </button>
                <button onClick={() => setShowIssueModal("Lalat")} className="bg-orange-50 p-2 rounded-xl border border-orange-100 flex flex-col items-center gap-1 hover:bg-orange-100">
                    <Icons.AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span className="text-[9px] font-bold text-orange-700 text-center leading-tight">Ada Lalat</span>
                </button>
                 <button onClick={() => setShowIssueModal("Lama")} className="bg-orange-50 p-2 rounded-xl border border-orange-100 flex flex-col items-center gap-1 hover:bg-orange-100">
                    <Icons.Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-[9px] font-bold text-orange-700 text-center leading-tight">Lama Terurai</span>
                </button>
                <button onClick={() => setShowIssueModal("Lainnya")} className="bg-gray-100 p-2 rounded-xl border border-gray-200 flex flex-col items-center gap-1 hover:bg-gray-200">
                    <Icons.HelpCircle className="w-5 h-5 text-gray-600" />
                    <span className="text-[9px] font-bold text-gray-700 text-center leading-tight">Lainnya</span>
                </button>
            </div>

            {/* AI Analysis Section (Replacing History) */}
             <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-sage-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                        <Icons.Sparkles className="w-4 h-4 text-purple-500" /> Analisis AI
                    </h3>
                </div>
                
                {!aiAdvice ? (
                    <div className="text-center">
                        <p className="text-xs text-gray-400 mb-3">Dapatkan saran ahli berdasarkan data di atas.</p>
                        <button onClick={handleAnalyze} className="w-full bg-purple-50 text-purple-700 py-3 rounded-xl font-bold text-sm border border-purple-100 hover:bg-purple-100">
                            Analisis Kondisi Tong
                        </button>
                    </div>
                ) : (
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 animate-fade-in-up">
                        <p className="text-sm text-purple-900 leading-relaxed font-medium">
                            "{aiAdvice}"
                        </p>
                        <button onClick={() => setAiAdvice(null)} className="mt-3 text-xs text-purple-500 font-bold uppercase tracking-wider">
                            Reset Analisis
                        </button>
                    </div>
                )}
             </div>

            {/* Catalog Link */}
            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 mb-6 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-orange-900">Stok Habis?</h3>
                    <p className="text-xs text-orange-700">Beli aktivator di Katalog Resmi</p>
                </div>
                <button onClick={() => alert("Membuka Katalog Toko...")} className="bg-white text-orange-600 text-sm font-bold px-4 py-2 rounded-lg shadow-sm">
                    Lihat Katalog
                </button>
            </div>

            <div className="mt-8">
                 <button onClick={onHarvestInstruction} className="w-full bg-white border-2 border-sage-600 text-sage-600 py-3 rounded-xl font-bold hover:bg-sage-50">
                    Cek Kesiapan Panen (Hari 14)
                 </button>
            </div>

            {/* Modals */}
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

// New Page: Harvest Instructions (Before Result)
const HarvestInstructionPage = ({ onConfirmHarvest }: { onConfirmHarvest: () => void }) => (
    <div className="min-h-screen bg-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Instruksi Panen</h2>
        
        <div className="flex-1 space-y-6">
            <div className="flex gap-4">
                <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 font-bold shrink-0">1</div>
                <div>
                    <h4 className="font-bold text-gray-800">Cek Warna</h4>
                    <p className="text-sm text-gray-500">Kompos matang berwarna coklat tua hingga hitam, mirip tanah subur.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 font-bold shrink-0">2</div>
                <div>
                    <h4 className="font-bold text-gray-800">Cek Tekstur</h4>
                    <p className="text-sm text-gray-500">Remah dan tidak menggumpal keras. Bahan asal sudah tidak dikenali.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 font-bold shrink-0">3</div>
                <div>
                    <h4 className="font-bold text-gray-800">Cek Bau</h4>
                    <p className="text-sm text-gray-500">Berbau tanah segar, bukan bau busuk atau asam menyengat.</p>
                </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-4">
                <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Ayak kompos untuk memisahkan bagian kasar yang belum terurai sempurna (bisa dikomposkan ulang).
                </p>
            </div>
        </div>

        <button onClick={onConfirmHarvest} className="w-full bg-sage-600 text-white py-4 rounded-xl font-bold shadow-lg">
            Selesai Panen & Lihat Hasil
        </button>
    </div>
);

const HarvestResultPage = ({ onHome }: { onHome: () => void }) => {
    return (
        <div className="min-h-screen bg-sage-400 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Confetti */}
            <div className="absolute inset-0 pointer-events-none">
                 {[...Array(20)].map((_, i) => (
                     <div key={i} className="absolute w-2 h-4 bg-yellow-400 rounded" style={{
                         top: Math.random() * 100 + '%',
                         left: Math.random() * 100 + '%',
                         transform: `rotate(${Math.random() * 360}deg)`,
                         opacity: 0.8
                     }}></div>
                 ))}
            </div>

            <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center relative z-10 animate-bounce-in">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎉</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat!</h2>
                <p className="text-gray-500 mb-6">Anda telah menyelesaikan siklus FoodAIRescue.</p>
                
                <div className="bg-sage-50 border border-sage-200 rounded-xl p-6 mb-6">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Nilai Ekonomi Tercipta</p>
                    <p className="text-4xl font-bold text-sage-600">Rp 15.000</p>
                    <div className="mt-3 flex gap-2 justify-center">
                        <span className="text-[10px] bg-white px-2 py-1 rounded shadow-sm border text-gray-500">5kg Pupuk</span>
                        <span className="text-[10px] bg-white px-2 py-1 rounded shadow-sm border text-gray-500">-2.5kg CO2</span>
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow mb-3 flex items-center justify-center gap-2">
                    <Icons.Share className="w-4 h-4" /> Bagikan Pencapaian
                </button>
                <button onClick={onHome} className="text-gray-400 text-sm font-medium hover:text-gray-600">
                    Kembali ke Dasbor
                </button>
            </div>
        </div>
    );
};

// --- Main App Logic ---

const App = () => {
  // Screens: splash -> login -> dashboard -> scanner -> analysis -> recipe -> detail -> history -> harvest_instruct -> harvest_result
  const [screen, setScreen] = useState('splash'); 
  const [scannedImage, setScannedImage] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  
  // State for Managing Compost Bins with Logs
  const [bins, setBins] = useState<Bin[]>([
      { 
          id: 1, 
          name: "Tong Kompos 1", 
          status: "Aktif", 
          phase: "Termofilik (Suhu Naik)", 
          day: 5, 
          estHarvest: 9,
          logs: [
              { date: "10 Okt", title: "Pembuatan Awal", description: "Resep kompos dibuat.", type: "success" },
              { date: "12 Okt", title: "Cek Rutin", description: "Suhu naik, kelembaban pas.", type: "info" }
          ]
      }
  ]);
  const [selectedBin, setSelectedBin] = useState<Bin | undefined>(undefined);

  // Gemini Setup
  const analyzeImage = async (base64Image: string) => {
    setScannedImage(base64Image);
    
    try {
        if (!process.env.API_KEY) throw new Error("No API Key");
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: [{
                parts: [
                    { text: `
                        Analyze this image of food/waste. Return JSON:
                        {
                            "items": ["list", "of", "items"],
                            "is_edible": boolean, (true if it looks like good food for donation, false if scraps/waste)
                            "ratio": number 0-1 (for compost C/N ratio),
                            "advice": "short advice string"
                        }
                    ` },
                    { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
                ]
             }]
        });

        // Use direct property access '.text' instead of '.response.text()'
        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            setAiAnalysis(JSON.parse(jsonMatch[0]));
        } else {
             throw new Error("Invalid JSON");
        }
    } catch (e) {
        console.log("Gemini fallback used", e);
        setAiAnalysis({
            items: ["Sisa Sayur", "Nasi Basi"],
            ratio: 0.3,
            is_edible: false,
            advice: "Limbah basah, tambahkan sekam/daun kering."
        });
    }

    setScreen('analysis');
  };

  const handleFinishRecipe = (name: string) => {
      // Create a new bin when recipe is finished
      const newBin: Bin = {
          id: Date.now(), // Unique ID based on timestamp
          name: name || `Tong Kompos ${bins.length + 1}`,
          status: "Aktif",
          phase: "Mesofilik (Awal)",
          day: 1,
          estHarvest: 14,
          logs: [{
              date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
              title: "Kompos Dimulai",
              description: "Resep berhasil dibuat.",
              type: "success"
          }]
      };
      
      setBins(prev => [...prev, newBin]);
      setSelectedBin(newBin);
      setScreen('detail');
  };

  const handleDeleteBin = (id: number) => {
      setBins(prev => prev.filter(b => b.id !== id));
  };

  const handleRenameBin = (id: number, newName: string) => {
      setBins(prev => prev.map(b => b.id === id ? { ...b, name: newName } : b));
  };

  const handleLogIssue = (type: string, note: string) => {
      if (!selectedBin) return;
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const newLog: LogEntry = {
          date: today,
          title: "Laporan Masalah",
          description: note,
          type: "warning"
      };

      const updatedBin = { ...selectedBin, logs: [...selectedBin.logs, newLog] };
      setSelectedBin(updatedBin);
      setBins(prev => prev.map(b => b.id === selectedBin.id ? updatedBin : b));
  };

  return (
    <div className="font-sans text-gray-900 max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
      {screen === 'splash' && <SplashScreen onNext={() => setScreen('login')} />}
      
      {screen === 'login' && <LoginScreen onLogin={() => setScreen('dashboard')} />}

      {screen === 'dashboard' && (
          <Dashboard 
            bins={bins}
            onScan={() => setScreen('scanner')} 
            onViewDetail={(bin) => { setSelectedBin(bin); setScreen('detail'); }}
            onDeleteBin={handleDeleteBin}
            onRenameBin={handleRenameBin}
          />
      )}
      
      {screen === 'scanner' && (
          <SmartScanner 
            onAnalyze={analyzeImage} 
            onBack={() => setScreen('dashboard')} 
          />
      )}
      
      {screen === 'analysis' && (
          <AnalysisPage 
             image={scannedImage} 
             aiResponse={aiAnalysis} 
             onNext={() => setScreen('recipe')}
             onRescue={() => alert("Mengarahkan ke halaman Donasi Mitra...")} 
          />
      )}

      {screen === 'recipe' && (
          <RecipePage onFinish={handleFinishRecipe} />
      )}

      {screen === 'detail' && (
          <CompostDetailPage 
            bin={selectedBin}
            onBack={() => setScreen('dashboard')}
            onOpenHistory={() => setScreen('history')}
            onLogIssue={handleLogIssue}
            onHarvestInstruction={() => setScreen('harvest_instruct')} 
          />
      )}

      {screen === 'history' && selectedBin && (
          <HistoryPage 
            bin={selectedBin}
            onBack={() => setScreen('detail')}
          />
      )}

      {screen === 'harvest_instruct' && (
          <HarvestInstructionPage onConfirmHarvest={() => setScreen('harvest_result')} />
      )}

      {screen === 'harvest_result' && (
          <HarvestResultPage onHome={() => setScreen('dashboard')} />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);