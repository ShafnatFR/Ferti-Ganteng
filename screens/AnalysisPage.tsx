
import React from 'react';
import { Icons } from '../components/Icons';
import { AIAnalysisResult } from '../types';

export const AnalysisPage = ({ image, aiResponse, onNext, onRescue, onBack }: { image: string, aiResponse: AIAnalysisResult, onNext: () => void, onRescue: () => void, onBack: () => void }) => {
    const { is_waste, is_edible, items, ratio, advice } = aiResponse;

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
                     <p className="text-gray-500">{items.join(", ")}</p>
                   </div>
                   {!is_waste ? (
                       <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                         Bukan Limbah
                       </span>
                   ) : is_edible ? (
                       <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                         Layak Makan
                       </span>
                   ) : (
                       <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                         Limbah Organik
                       </span>
                   )}
                </div>

                {!is_waste ? (
                    <div className="text-center mt-8">
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-6">
                            <Icons.X className="w-12 h-12 text-red-400 mx-auto mb-3" />
                            <p className="text-gray-700 font-medium">
                                AI mendeteksi objek ini bukan limbah organik yang cocok untuk pengomposan.
                            </p>
                            <p className="text-sm text-gray-500 mt-2 italic">"{advice}"</p>
                        </div>
                        <button onClick={onBack} className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-900">
                            Kembali / Coba Lagi
                        </button>
                    </div>
                ) : is_edible ? (
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
                    <>
                        <div className="mb-6">
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span className="text-green-600">Nitrogen (Hijau)</span>
                                <span className="text-stone-600">Karbon (Coklat)</span>
                            </div>
                            <div className="h-6 w-full bg-gradient-to-r from-green-500 via-yellow-300 to-stone-500 rounded-full relative">
                                <div 
                                    className="absolute -top-2 w-1 h-10 bg-black border-2 border-white shadow-md transform -translate-x-1/2 transition-all duration-1000"
                                    style={{ left: `${Math.min(Math.max(ratio * 100, 0), 100)}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium text-gray-600 bg-gray-100 py-2 rounded-lg">
                                {advice}
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
