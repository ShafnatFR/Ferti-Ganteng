
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Bin, LogEntry } from '../types';

interface AddLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, desc: string, type: 'info' | 'warning' | 'success') => void;
}

const AddLogModal: React.FC<AddLogModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState<'info' | 'warning' | 'success'>('info');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Tambah Catatan</h3>
                    <button onClick={onClose}><Icons.X className="w-5 h-5 text-gray-400" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Judul Aktivitas</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Aduk Kompos"
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Keterangan</label>
                        <textarea 
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Catatan tambahan..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Tipe</label>
                        <div className="flex gap-2">
                            {/* Blue removed, replaced with Gray/Neutral */}
                            <button onClick={() => setType('info')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${type === 'info' ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-gray-50 text-gray-500'}`}>Info</button>
                            <button onClick={() => setType('warning')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${type === 'warning' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>Masalah</button>
                            <button onClick={() => setType('success')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${type === 'success' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-gray-50 text-gray-500'}`}>Proses</button>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        if (title) {
                            onSave(title, desc, type);
                            setTitle(''); setDesc(''); setType('info');
                            onClose();
                        }
                    }}
                    className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl mt-6 hover:bg-primary-700 shadow-lg shadow-primary-600/30"
                >
                    Simpan Catatan
                </button>
            </div>
        </div>
    );
};

export const HistoryPage = ({ bin, onBack, onAddLog }: { bin: Bin, onBack: () => void, onAddLog: (t: string, d: string, type: 'info'|'warning'|'success') => void }) => {
    const [filter, setFilter] = useState<'all' | 'warning' | 'success'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Filter Logs
    const filteredLogs = bin.logs.filter(log => filter === 'all' || log.type === filter);
    
    // Reverse logs to show newest first for the timeline
    const reversedLogs = [...filteredLogs].reverse();

    const groupedLogs = reversedLogs.reduce((acc, log) => {
        const parts = log.date.split(' '); // e.g., ["10", "Okt"]
        const monthKey = parts.length > 1 ? parts[1] : 'Umum';
        
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(log);
        return acc;
    }, {} as Record<string, LogEntry[]>);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-20">
                <button onClick={onBack} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                    <Icons.ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                   <h2 className="text-lg font-bold text-gray-800">Timeline Aktivitas</h2>
                   <p className="text-xs text-gray-500 font-medium">{bin.name}</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1 bg-primary-600 text-white px-3 py-2 rounded-full text-xs font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20"
                >
                    <Icons.Plus className="w-4 h-4" /> Catat
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white px-4 pb-4 flex gap-2 border-b border-gray-100">
                <button 
                    onClick={() => setFilter('all')} 
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                    Semua
                </button>
                <button 
                    onClick={() => setFilter('warning')} 
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${filter === 'warning' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-500'}`}
                >
                    <Icons.AlertTriangle className="w-3 h-3" /> Masalah
                </button>
                <button 
                    onClick={() => setFilter('success')} 
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${filter === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'}`}
                >
                    <Icons.Check className="w-3 h-3" /> Proses
                </button>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {Object.keys(groupedLogs).length === 0 ? (
                    <div className="text-center py-10 opacity-50 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <Icons.Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 italic">Belum ada aktivitas tercatat.</p>
                    </div>
                ) : (
                    Object.keys(groupedLogs).map((month) => (
                        <div key={month} className="mb-8 relative">
                            <h3 className="sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10 py-2 text-sm font-bold text-gray-400 mb-4 pl-2 uppercase tracking-wider border-b border-gray-200 w-full">
                                {month}
                            </h3>
                            
                            <div className="space-y-0 relative">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-gray-200"></div>

                                {groupedLogs[month].map((log, idx) => (
                                    <div key={idx} className="relative pl-12 pb-8 group last:pb-0">
                                        {/* Timeline Dot/Icon - Blue removed, using Gray for Info */}
                                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-50 z-10 shadow-sm ${
                                            log.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                                            log.type === 'success' ? 'bg-green-100 text-green-600' : 
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {log.type === 'warning' ? <Icons.AlertTriangle className="w-5 h-5" /> : 
                                             log.type === 'success' ? <Icons.Check className="w-5 h-5" /> : 
                                             <Icons.Edit className="w-4 h-4" />}
                                        </div>

                                        {/* Content Card */}
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group-hover:border-primary-200 transition-colors relative">
                                            {/* Left Colored Border */}
                                            <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${
                                                log.type === 'warning' ? 'bg-orange-400' : 
                                                log.type === 'success' ? 'bg-green-400' : 
                                                'bg-gray-400'
                                            }`}></div>

                                            <div className="flex justify-between items-start mb-1 ml-2">
                                                <h4 className="font-bold text-gray-800 text-sm">{log.title}</h4>
                                                <span className="text-[10px] font-mono text-gray-400">{log.date}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 ml-2 leading-relaxed">{log.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AddLogModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={onAddLog}
            />
        </div>
    );
}
