
import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';

export const RecipePage = ({ onFinish }: { onFinish: (name: string) => void }) => {
    const [binName, setBinName] = useState("");
    const [dateStr] = useState(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));

    useEffect(() => {
        setBinName(`Kompos ${dateStr}`);
    }, [dateStr]);

    return (
        <div className="min-h-screen bg-white p-6 pb-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Formulasi Resep</h2>

            <div className="space-y-8 relative mb-8">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

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
