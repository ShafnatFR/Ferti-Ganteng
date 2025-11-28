
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

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

export const TroubleshootingModal = ({ isOpen, type, onClose, onSolve }: { isOpen: boolean, type: string | null, onClose: () => void, onSolve: (note: string) => void }) => {
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
            title: "Masalah Lain (Beritahu AI)",
            solution: "Tuliskan masalah spesifik Anda. Informasi ini akan dikirim ke AI untuk analisis lebih mendalam dan solusi yang dipersonalisasi."
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
                        placeholder="Contoh: Muncul jamur berwarna oranye, apakah berbahaya?"
                        rows={3}
                        value={customIssue}
                        onChange={(e) => setCustomIssue(e.target.value)}
                        autoFocus
                    ></textarea>
                )}

                <button 
                    onClick={() => {
                        const note = type === "Lainnya" ? customIssue : `Mengatasi masalah ${type}`;
                        onSolve(note || "User mencatat masalah manual tanpa detail.");
                        onClose();
                        setCustomIssue("");
                    }} 
                    className="w-full bg-sage-600 text-white py-3 rounded-xl font-bold shadow-lg"
                >
                    {type === "Lainnya" ? "Simpan & Kirim ke AI" : "Terapkan Solusi & Catat"}
                </button>
            </div>
        </div>
    );
};
