
import React from 'react';
import { Icons } from '../components/Icons';
import { AIAnalysisResult } from '../types';

export const AnalysisPage = ({ image, aiResponse, onNext, onRescue, onBack }: { image: string, aiResponse: AIAnalysisResult, onNext: () => void, onRescue: () => void, onBack: () => void }) => {
    const { is_waste, is_edible, items, ratio, advice } = aiResponse;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row md:h-screen md:overflow-hidden">
            {/* Image Section - Full width on Mobile, Half width on Desktop */}
            <div className="relative h-64 md:h-full md:w-1/2 bg-gray-900 shrink-0">
                <img src={image} alt="Scanned" className="w-full h-full object-cover opacity-80" />
                <button onClick={onBack} className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm hover:bg-black/70 md:hidden">
                    &larr; Kembali
                </button>
            </div>

            {/* Content Section - Card sheet on Mobile, Full height scroll on Desktop */}
            <div className="flex-1 p-6 md:p-12 -mt-6 md:mt-0 bg-white rounded-t-3xl md:rounded-none z-10 shadow-up md:shadow-none md:overflow-y-auto md:w-1/2 flex flex-col">
                <div className="max-w-xl mx-auto w-full">
                    {/* Header Result */}
                    <div className="flex justify-between items-start mb-6 md:mb-8">
                        <div>
                            <button onClick={onBack} className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold mb-4 text-sm">
                                <Icons.ArrowLeft className="w-4 h-4" /> Kembali ke Kamera
                            </button>
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-1">Hasil Deteksi</h2>
                            <p className="text-gray-500 text-lg">{items.join(", ")}</p>
                        </div>
                        {!is_waste ? (
                            <span className="bg-red-100 text-red-700 text-sm font-bold px-4 py-2 rounded-full border border-red-200 mt-8 md:mt-0">
                                Bukan Limbah
                            </span>
                        ) : is_edible ? (
                            <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-2 rounded-full border border-emerald-200 mt-8 md:mt-0">
                                Layak Makan
                            </span>
                        ) : (
                            <span className="bg-primary-100 text-primary-700 text-sm font-bold px-4 py-2 rounded-full border border-primary-200 mt-8 md:mt-0">
                                Limbah Organik
                            </span>
                        )}
                    </div>

                    {!is_waste ? (
                        <div className="text-center mt-8 md:mt-12">
                            <div className="bg-red-50 p-8 rounded-3xl border border-red-100 mb-8">
                                <Icons.X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                <p className="text-gray-700 font-medium text-lg">
                                    AI mendeteksi objek ini bukan limbah organik yang cocok untuk pengomposan.
                                </p>
                                <p className="text-base text-gray-500 mt-4 italic">"{advice}"</p>
                            </div>
                            <button onClick={onBack} className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-900 transition-colors">
                                Kembali / Coba Lagi
                            </button>
                        </div>
                    ) : is_edible ? (
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 md:p-8 rounded-2xl mb-8">
                            <div className="flex items-start gap-4">
                                <Icons.AlertCircle className="w-8 h-8 text-emerald-600 mt-1 shrink-0" />
                                <div>
                                    <h3 className="text-emerald-800 font-bold text-xl">Penyelamatan Pangan!</h3>
                                    <p className="text-emerald-700 mt-2 text-base leading-relaxed">
                                        AI mendeteksi makanan ini masih layak konsumsi. Sesuai misi FoodAIRescue, sebaiknya didonasikan.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 mt-6">
                                <button onClick={onRescue} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow hover:bg-emerald-700 transition-colors text-lg">
                                    Salurkan ke Mitra Donasi
                                </button>
                                <button onClick={onNext} className="w-full text-gray-500 font-medium hover:text-gray-800 hover:underline py-2">
                                    Lanjut jadikan Kompos (Kondisi Rusak)
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex justify-between text-sm font-bold mb-3">
                                    <span className="text-green-600">Nitrogen (Hijau)</span>
                                    <span className="text-stone-600">Karbon (Coklat)</span>
                                </div>
                                <div className="h-8 w-full bg-gradient-to-r from-green-500 via-yellow-300 to-stone-500 rounded-full relative shadow-inner">
                                    <div 
                                        className="absolute -top-1 bottom-0 w-2 bg-black border-2 border-white shadow-xl transform -translate-x-1/2 transition-all duration-1000 rounded-full"
                                        style={{ left: `${Math.min(Math.max(ratio * 100, 0), 100)}%` }}
                                    ></div>
                                </div>
                                <div className="mt-4 text-center text-sm font-medium text-gray-700 bg-white py-3 px-4 rounded-xl border border-gray-200 shadow-sm">
                                    <Icons.Sparkles className="w-4 h-4 text-primary-500 inline mr-2" />
                                    {advice}
                                </div>
                            </div>
                            
                            <button onClick={onNext} className="w-full bg-primary-600 text-white py-5 rounded-xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all text-lg flex items-center justify-center gap-2">
                                Buat Resep Kompos <Icons.Send className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
