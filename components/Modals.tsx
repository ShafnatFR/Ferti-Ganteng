
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { geminiService } from '../services/GeminiService';
import { IssueDetails } from '../types';

export const EditNameModal = ({ isOpen, currentName, onSave, onClose }: { isOpen: boolean, currentName: string, onSave: (name: string) => void, onClose: () => void }) => {
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
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl p-3 mb-6 focus:ring-2 focus:ring-primary-400 outline-none text-gray-800"
                    autoFocus
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-bold">Batal</button>
                    <button onClick={() => { onSave(name); onClose(); }} className="flex-1 py-3 bg-primary-600 rounded-xl text-white font-bold">Simpan</button>
                </div>
            </div>
        </div>
    );
};

export const DeleteConfirmModal = ({ isOpen, binName, onConfirm, onClose }: { isOpen: boolean, binName: string, onConfirm: () => void, onClose: () => void }) => {
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

export const TroubleshootingModal = ({ isOpen, type, onClose, onSolve }: { isOpen: boolean, type: string | null, onClose: () => void, onSolve: (note: string, details: IssueDetails) => void }) => {
    const [step, setStep] = useState<'form' | 'analysis'>('form');
    const [customIssue, setCustomIssue] = useState("");
    const [severity, setSeverity] = useState<'low' | 'medium' | 'critical'>('low');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSolution, setAiSolution] = useState("");

    useEffect(() => {
        if (isOpen) {
            setStep('form');
            setCustomIssue("");
            setSeverity('low');
            setAiSolution("");
        }
    }, [isOpen]);

    if (!isOpen || !type) return null;

    const handleDiagnose = async () => {
        setIsAnalyzing(true);
        setStep('analysis');
        
        // Call AI Service
        const solution = await geminiService.getTroubleshootingAdvice(
            type, 
            severity === 'low' ? 'Ringan' : severity === 'medium' ? 'Sedang' : 'Kritis (Parah)', 
            customIssue
        );
        
        setAiSolution(solution);
        setIsAnalyzing(false);
    };

    const handleSave = () => {
        const fullNote = `${type} (${severity === 'low' ? 'Ringan' : severity === 'medium' ? 'Sedang' : 'Kritis'}): ${customIssue}`;
        onSolve(customIssue ? fullNote : `${type} - ${severity}`, {
            severity,
            aiSolution,
            isResolved: false
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-0 overflow-hidden animate-fade-in-up shadow-2xl">
                {/* Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                         <div className={`p-2 rounded-full ${type === 'Lainnya' ? 'bg-gray-200' : 'bg-orange-100'}`}>
                             {type === 'Lainnya' ? <Icons.HelpCircle className="w-5 h-5 text-gray-600"/> : <Icons.AlertTriangle className="w-5 h-5 text-orange-600" />}
                         </div>
                         Diagnosa: {type}
                    </h3>
                    <button onClick={onClose}><Icons.X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
                </div>
                
                <div className="p-6">
                    {step === 'form' ? (
                        <div className="space-y-6">
                            {/* Severity Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Seberapa parah kondisinya?</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button 
                                        onClick={() => setSeverity('low')}
                                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${severity === 'low' ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                                    >
                                        Ringan
                                    </button>
                                    <button 
                                        onClick={() => setSeverity('medium')}
                                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${severity === 'medium' ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                                    >
                                        Sedang
                                    </button>
                                    <button 
                                        onClick={() => setSeverity('critical')}
                                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${severity === 'critical' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                                    >
                                        Kritis
                                    </button>
                                </div>
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Detail Gejala (Opsional)</label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary-400 outline-none bg-gray-50 min-h-[100px]"
                                    placeholder={type === "Bau" ? "Contoh: Bau seperti telur busuk menyengat..." : "Ceritakan detailnya agar AI lebih akurat..."}
                                    value={customIssue}
                                    onChange={(e) => setCustomIssue(e.target.value)}
                                ></textarea>
                            </div>

                            <button 
                                onClick={handleDiagnose}
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Icons.Sparkles className="w-5 h-5" /> Analisis Masalah
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium animate-pulse">AI sedang meracik solusi...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-secondary-50 p-5 rounded-xl border border-secondary-100">
                                        <h4 className="font-bold text-secondary-800 mb-3 flex items-center gap-2">
                                            <Icons.Bot className="w-5 h-5" /> Rencana Penanganan
                                        </h4>
                                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {aiSolution}
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-800 flex gap-2">
                                        <Icons.AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>Laporan ini akan disimpan ke Log Aktivitas dengan status <strong>"Belum Selesai"</strong>.</span>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => setStep('form')} className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-bold">Ubah Data</button>
                                        <button onClick={handleSave} className="flex-[2] py-3 bg-primary-600 text-white rounded-xl font-bold shadow-md hover:bg-primary-700">Simpan & Lakukan</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
