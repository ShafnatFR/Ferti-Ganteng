
import React from 'react';
import { Icons } from '../components/Icons';

export const HarvestInstructionPage = ({ onConfirmHarvest }: { onConfirmHarvest: () => void }) => (
    <div className="min-h-screen bg-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Instruksi Panen</h2>
        <div className="flex-1 space-y-6">
            <div className="flex gap-4"><div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 font-bold shrink-0">1</div><div><h4 className="font-bold text-gray-800">Cek Warna</h4><p className="text-sm text-gray-500">Kompos matang berwarna coklat tua hingga hitam.</p></div></div>
            <div className="flex gap-4"><div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 font-bold shrink-0">2</div><div><h4 className="font-bold text-gray-800">Cek Tekstur</h4><p className="text-sm text-gray-500">Remah dan tidak menggumpal keras.</p></div></div>
            <div className="flex gap-4"><div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 font-bold shrink-0">3</div><div><h4 className="font-bold text-gray-800">Cek Bau</h4><p className="text-sm text-gray-500">Berbau tanah segar.</p></div></div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-4"><p className="text-sm text-yellow-800"><strong>Tip:</strong> Ayak kompos untuk memisahkan bagian kasar.</p></div>
        </div>
        <button onClick={onConfirmHarvest} className="w-full bg-sage-600 text-white py-4 rounded-xl font-bold shadow-lg">Selesai Panen & Lihat Hasil</button>
    </div>
);

export const HarvestResultPage = ({ onHome }: { onHome: () => void }) => {
    return (
        <div className="min-h-screen bg-sage-400 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                 {[...Array(20)].map((_, i) => (
                     <div key={i} className="absolute w-2 h-4 bg-yellow-400 rounded" style={{ top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', transform: `rotate(${Math.random() * 360}deg)`, opacity: 0.8 }}></div>
                 ))}
            </div>
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center relative z-10 animate-bounce-in">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-4xl">🎉</span></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat!</h2>
                <p className="text-gray-500 mb-6">Anda telah menyelesaikan siklus FoodAIRescue.</p>
                <div className="bg-sage-50 border border-sage-200 rounded-xl p-6 mb-6">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Nilai Ekonomi Tercipta</p>
                    <p className="text-4xl font-bold text-sage-600">Rp 15.000</p>
                    <div className="mt-3 flex gap-2 justify-center"><span className="text-[10px] bg-white px-2 py-1 rounded shadow-sm border text-gray-500">5kg Pupuk</span><span className="text-[10px] bg-white px-2 py-1 rounded shadow-sm border text-gray-500">-2.5kg CO2</span></div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow mb-3 flex items-center justify-center gap-2"><Icons.Share className="w-4 h-4" /> Bagikan Pencapaian</button>
                <button onClick={onHome} className="text-gray-400 text-sm font-medium hover:text-gray-600">Kembali ke Dasbor</button>
            </div>
        </div>
    );
};
