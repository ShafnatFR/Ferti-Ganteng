
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Bin } from '../types';
import { EditNameModal, DeleteConfirmModal } from '../components/Modals';

interface DashboardProps {
    bins: Bin[];
    onScan: () => void;
    onViewDetail: (bin: Bin) => void;
    onDeleteBin: (id: number) => void;
    onRenameBin: (id: number, newName: string) => void;
    onGlobalChat: () => void;
}

export const Dashboard = ({ bins, onScan, onViewDetail, onDeleteBin, onRenameBin, onGlobalChat }: DashboardProps) => {
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [deletingBin, setDeletingBin] = useState<Bin | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-sage-400 p-6 rounded-b-3xl shadow-md text-white relative">
        <div className="flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-bold">Halo, Budi!</h2>
              <p className="text-sage-100 text-sm">Petani Kota Level 1</p>
           </div>
           <div className="bg-white/20 p-2 rounded-full">
              <Icons.Leaf className="w-6 h-6 text-white" />
           </div>
        </div>
        
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center justify-between">
           <div>
             <p className="text-xs text-sage-50">Total Dampak</p>
             <p className="text-xl font-bold">12.5 kg CO2e</p>
           </div>
           <Icons.CloudRain className="w-8 h-8 opacity-80" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        <h3 className="font-bold text-gray-700">Kompos Aktif</h3>

        {bins.length === 0 ? (
             <div className="text-center py-8 opacity-50">
                 <p className="text-gray-500 italic">Belum ada tong kompos.</p>
             </div>
        ) : bins.map((bin) => (
          <div key={bin.id} onClick={() => onViewDetail(bin)} className="bg-white rounded-2xl p-5 shadow-lg border border-sage-100 relative overflow-hidden cursor-pointer active:scale-95 transition-transform mb-4 group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{bin.name}</h3>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{bin.status}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Fase: {bin.phase}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                 <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">Hari ke-{bin.day}</span>
                 <div className="flex gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setEditingBin(bin)} 
                        className="p-1.5 bg-gray-100 rounded-full hover:bg-sage-100 text-gray-500 hover:text-sage-600 transition-colors"
                    >
                        <Icons.Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setDeletingBin(bin)} 
                        className="p-1.5 bg-gray-100 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <Icons.Trash className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
            
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div 
                className="absolute top-0 left-0 h-full bg-sage-500 rounded-full" 
                style={{ width: `${Math.min((bin.day / 14) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
              <span>Estimasi Panen: {bin.estHarvest} Hari lagi</span>
              <span className="text-sage-600 font-bold flex items-center gap-1">
                Lihat Detail <Icons.ArrowLeft className="w-3 h-3 rotate-180" />
              </span>
            </div>
          </div>
        ))}

        <button 
          onClick={onScan}
          className="w-full border-2 border-dashed border-sage-300 bg-sage-50 rounded-2xl p-6 flex flex-col items-center justify-center text-sage-500 hover:bg-sage-100 hover:border-sage-400 transition-all cursor-pointer group active:scale-95"
        >
           <div className="bg-white p-3 rounded-full mb-2 group-hover:scale-110 transition-transform shadow-sm">
              <Icons.Plus className="w-6 h-6 text-sage-600" />
           </div>
           <p className="text-sm font-bold text-sage-700">Tambah Tong Baru</p>
           <p className="text-xs text-sage-400 mt-1">Mulai siklus pengomposan baru</p>
        </button>
      </div>

      <div className="fixed bottom-6 w-full px-6 flex justify-between items-end z-20 pointer-events-none">
        <div className="w-12"></div>
        <div className="flex flex-col items-center gap-2 pointer-events-auto -ml-4">
            <span className="text-xs font-bold text-sage-700 bg-white/80 px-2 py-1 rounded-full shadow-sm animate-bounce">Pindai Limbah</span>
            <button 
              onClick={onScan}
              className="bg-sage-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-sage-700 transition-colors ring-4 ring-white"
            >
              <Icons.Camera className="w-8 h-8" />
            </button>
        </div>
        <div className="pointer-events-auto">
            <button 
              onClick={onGlobalChat}
              className="bg-purple-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors ring-2 ring-white"
            >
              <Icons.Bot className="w-6 h-6" />
            </button>
        </div>
      </div>

      <EditNameModal 
        isOpen={!!editingBin} 
        currentName={editingBin?.name || ""} 
        onClose={() => setEditingBin(null)} 
        onSave={(newName) => editingBin && onRenameBin(editingBin.id, newName)}
      />
      
      <DeleteConfirmModal 
        isOpen={!!deletingBin}
        binName={deletingBin?.name || ""}
        onClose={() => setDeletingBin(null)}
        onConfirm={() => deletingBin && onDeleteBin(deletingBin.id)}
      />
    </div>
  );
};
