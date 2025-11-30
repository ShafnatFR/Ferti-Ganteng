
import React from 'react';
import { Icons } from '../components/Icons';

export const HarvestInstructionPage = ({ onConfirmHarvest }: { onConfirmHarvest: () => void }) => (
    <div className="min-h-screen bg-white p-6 md:p-12 flex flex-col max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Instruksi Panen</h2>
        <p className="text-gray-500 mb-8 md:mb-12">Pastikan kompos Anda memenuhi kriteria berikut sebelum dipanen.</p>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-700 font-bold text-xl mb-4">1</div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">Cek Warna</h4>
                <p className="text-gray-600 leading-relaxed">Kompos yang matang memiliki warna <strong>coklat tua hingga hitam</strong>, mirip dengan tanah subur.</p>
            </div>
            
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-700 font-bold text-xl mb-4">2</div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">Cek Tekstur</h4>
                <p className="text-gray-600 leading-relaxed">Teksturnya harus <strong>remah (crumbly)</strong> saat dipegang, tidak menggumpal keras dan tidak becek.</p>
            </div>
            
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-700 font-bold text-xl mb-4">3</div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">Cek Bau</h4>
                <p className="text-gray-600 leading-relaxed">Baunya harus seperti <strong>tanah hutan yang segar</strong>. Tidak boleh ada bau busuk atau menyengat.</p>
            </div>
        </div>

        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 mb-8 flex items-start gap-3 md:w-2/3">
            <Icons.Sparkles className="w-6 h-6 text-yellow-600 mt-1 shrink-0" />
            <div>
                <strong className="text-yellow-800 block mb-1">Tips Pro:</strong>
                <p className="text-sm text-yellow-800">Ayak kompos menggunakan saringan kawat untuk memisahkan bagian yang belum terurai sempurna. Bagian kasar bisa dikomposkan kembali.</p>
            </div>
        </div>

        <button onClick={onConfirmHarvest} className="w-full md:w-auto md:px-12 md:self-end bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors text-lg flex items-center justify-center gap-2">
            <Icons.Check className="w-6 h-6" /> Selesai Panen & Lihat Hasil
        </button>
    </div>
);

export const HarvestResultPage = ({ onHome }: { onHome: () => void }) => {
    return (
        <div className="min-h-screen bg-green-500 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                 {[...Array(20)].map((_, i) => (
                     <div key={i} className="absolute w-3 h-6 bg-yellow-300 rounded opacity-60 animate-pulse" style={{ top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', transform: `rotate(${Math.random() * 360}deg)`, animationDelay: `${Math.random()}s` }}></div>
                 ))}
            </div>
            <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl text-center relative z-10 animate-fade-in-up">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <span className="text-5xl">🎉</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Panen Berhasil!</h2>
                <p className="text-gray-500 mb-8 text-lg">Siklus kompos selesai. Anda telah mengubah limbah menjadi berkah.</p>
                
                <div className="bg-green-50 border border-green-100 rounded-2xl p-8 mb-8">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Nilai Ekonomi Tercipta</p>
                    <p className="text-5xl font-bold text-green-600 mb-4">Rp 15.000</p>
                    <div className="flex gap-3 justify-center">
                        <span className="text-xs bg-white px-3 py-1.5 rounded-lg shadow-sm border border-green-200 text-green-700 font-bold flex items-center gap-1">
                            <Icons.ShoppingBag className="w-3 h-3" /> 5kg Pupuk
                        </span>
                        <span className="text-xs bg-white px-3 py-1.5 rounded-lg shadow-sm border border-green-200 text-green-700 font-bold flex items-center gap-1">
                            <Icons.Leaf className="w-3 h-3" /> -2.5kg CO2
                        </span>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <Icons.Share className="w-5 h-5" /> Bagikan Pencapaian
                    </button>
                    <button onClick={onHome} className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 py-2">
                        Kembali ke Dasbor
                    </button>
                </div>
            </div>
        </div>
    );
};
