
import React from 'react';
import { Icons } from '../components/Icons';
import { Bin } from '../types';

export const HistoryPage = ({ bin, onBack }: { bin: Bin, onBack: () => void }) => {
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
