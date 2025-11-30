
import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';

export const RecipePage = ({ onFinish }: { onFinish: (name: string) => void }) => {
    const [binName, setBinName] = useState("");
    const [dateStr] = useState(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));

    useEffect(() => {
        setBinName(`Kompos ${dateStr}`);
    }, [dateStr]);

    return (
        <div className="min-h-screen bg-white p-6 pb-32 md:pb-12 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 md:mb-12">Formulasi Resep</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                {/* Left Column: Ingredients Timeline */}
                <div className="space-y-12 relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                    <div className="relative pl-14">
                        <div className="absolute left-0 w-9 h-9 bg-secondary-600 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-md text-lg">1</div>
                        <h3 className="font-bold text-xl text-gray-800">Bahan Penyeimbang</h3>
                        <p className="text-gray-500 text-sm mb-4 mt-1">Menjaga rasio Karbon/Nitrogen agar tidak bau.</p>
                        <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="bg-stone-200 p-4 rounded-full">
                                <Icons.Leaf className="w-6 h-6 text-stone-600" />
                            </div>
                            <div>
                                <p className="font-bold text-stone-800 text-lg">2 Genggam</p>
                                <p className="text-stone-500">Daun Kering / Sekam / Kardus</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative pl-14">
                        <div className="absolute left-0 w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-md text-lg">2</div>
                        <h3 className="font-bold text-xl text-gray-800">Aktivator Pengurai</h3>
                        <p className="text-gray-500 text-sm mb-4 mt-1">Mempercepat proses penguraian oleh bakteri.</p>
                        
                        <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="flex gap-6 items-center">
                               <div className="w-20 h-32 bg-gradient-to-b from-primary-400 to-primary-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-center text-xs transform rotate-3 border-b-4 border-primary-800 group-hover:rotate-6 transition-transform">
                                    Petro<br/>Gladiator
                               </div>
                               <div className="flex-1">
                                   <h4 className="font-bold text-lg text-primary-800">Petro Gladiator Cair</h4>
                                   <p className="text-sm text-gray-600 mt-1 mb-4 leading-relaxed">Tuangkan 1 tutup botol (10ml) ke dalam campuran.</p>
                                   <button onClick={() => window.open('https://pupuk-indonesia.co.id', '_blank')} className="bg-white border border-primary-200 text-primary-700 text-sm font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-primary-50 transition-colors w-full md:w-auto">
                                       + Beli di Marketplace
                                   </button>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form & Action (Sticky on Desktop, Fixed Bottom on Mobile) */}
                <div className="md:sticky md:top-6 h-fit">
                    <div className="fixed bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:static md:border-none md:shadow-none md:bg-gray-50 md:p-8 md:rounded-3xl">
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Beri Nama Tong Kompos</label>
                            <input 
                                type="text" 
                                value={binName} 
                                onChange={(e) => setBinName(e.target.value)} 
                                className="w-full border-2 border-secondary-100 rounded-xl px-4 py-4 focus:border-primary-500 focus:outline-none bg-secondary-50/50 text-lg font-medium"
                                placeholder="Contoh: Kompos Dapur"
                            />
                        </div>
                        <button onClick={() => onFinish(binName)} className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary-600/30 text-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                            <Icons.Check className="w-6 h-6" /> Mulai Kompos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
