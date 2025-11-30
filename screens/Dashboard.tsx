
import React, { useState, useEffect, useMemo } from 'react';
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
    onViewNotifications: () => void;
    unreadCount: number;
}

type FilterType = 'harvest_time' | 'day_count' | 'active' | 'inactive';

export const Dashboard = ({ bins, onScan, onViewDetail, onDeleteBin, onRenameBin, onGlobalChat, onViewNotifications, unreadCount }: DashboardProps) => {
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [deletingBin, setDeletingBin] = useState<Bin | null>(null);
  const [pendingTasks, setPendingTasks] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<FilterType>('active');

  // Check Permissions and Daily Status
  useEffect(() => {
    const checkDailyStatus = () => {
        const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const tasks: string[] = [];

        bins.forEach(bin => {
            const hasCheckedToday = bin.logs.some(log => log.date === today);
            if (!hasCheckedToday && bin.status === 'Aktif') {
                tasks.push(bin.name);
            }
        });

        setPendingTasks(tasks);

        // Trigger System Notification if permitted and has tasks, only once per session/day
        const lastNotif = localStorage.getItem('last_daily_notification');
        if (tasks.length > 0 && Notification.permission === 'granted' && lastNotif !== today) {
            new Notification("Pengingat Harian Eco-Formulator", {
                body: `Halo! ${tasks.length} tong kompos perlu dicek dan diaduk hari ini.`,
                icon: "/icon.png" // Placeholder icon
            });
            localStorage.setItem('last_daily_notification', today);
        }
    };

    checkDailyStatus();
  }, [bins]);

  // Filtering & Sorting Logic
  const processedBins = useMemo(() => {
      let result = [...bins];

      switch (filterBy) {
          case 'harvest_time':
              // Sort by estimated harvest time (Ascending - smallest first)
              return result.sort((a, b) => a.estHarvest - b.estHarvest);
          
          case 'day_count':
              // Sort by day count (Descending - longest running first)
              return result.sort((a, b) => b.day - a.day);
          
          case 'active':
              // Filter only Active
              return result.filter(b => b.status === 'Aktif');
          
          case 'inactive':
              // Filter only Inactive (Selesai, Gagal, etc.)
              return result.filter(b => b.status !== 'Aktif');
              
          default:
              return result;
      }
  }, [bins, filterBy]);

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-10">
      {/* Header - Now Primary Orange with Graphic Pattern */}
      <div className="bg-primary-600 p-6 md:p-10 rounded-b-3xl md:rounded-b-[3rem] shadow-lg shadow-primary-900/10 text-white relative overflow-hidden">
        
        {/* Decorative Graphics */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
             <circle cx="5%" cy="20%" r="50" fill="white"/>
             <circle cx="95%" cy="80%" r="80" fill="white"/>
             <path d="M0,100 Q400,0 800,100" fill="none" stroke="white" strokeWidth="5"/>
           </svg>
        </div>
        
        <div className="flex justify-between items-center relative z-10 max-w-7xl mx-auto">
           <div>
              <h2 className="text-2xl md:text-4xl font-bold">Halo, Budi!</h2>
              <p className="text-primary-100 text-sm md:text-lg mt-1">Petani Kota Level 1</p>
           </div>
           
           {/* Notification Bell & Profile Icon - Only visible on Mobile since Sidebar has it on Desktop */}
           <div className="flex items-center gap-2 md:hidden">
                <div className="bg-white/10 p-2 rounded-full border border-white/10 backdrop-blur-sm">
                    <Icons.Leaf className="w-6 h-6 text-white" />
                </div>
                <button 
                    onClick={onViewNotifications}
                    className="p-2 rounded-full transition-colors bg-white/10 text-white relative hover:bg-white/20 border border-white/10 backdrop-blur-sm"
                    aria-label="Notifikasi"
                >
                    <Icons.Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                </button>
           </div>
        </div>
        
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex items-center justify-between relative z-10 max-w-7xl mx-auto">
           <div>
             <p className="text-sm md:text-base text-primary-50">Total Dampak Lingkungan</p>
             <p className="text-2xl md:text-3xl font-bold mt-1">12.5 kg CO2e</p>
           </div>
           <Icons.CloudRain className="w-10 h-10 md:w-16 md:h-16 opacity-80 text-primary-200" />
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
        
        {/* Daily Reminder Banner */}
        {pendingTasks.length > 0 && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm flex items-start gap-3 animate-fade-in-up">
                <Icons.AlertCircle className="w-6 h-6 text-orange-600 mt-1 shrink-0" />
                <div>
                    <h3 className="text-gray-800 font-bold">Tugas Hari Ini</h3>
                    <p className="text-sm text-gray-700 mt-1">
                        Belum cek: <strong>{pendingTasks.length > 2 ? `${pendingTasks[0]}, ${pendingTasks[1]}...` : pendingTasks.join(", ")}</strong>.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Jangan lupa diaduk agar oksigen masuk!</p>
                </div>
            </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold text-gray-700 text-lg md:text-xl">Daftar Kompos</h3>
            
            {/* Filter / Sort Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <button 
                    onClick={() => setFilterBy('active')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filterBy === 'active' ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                    Aktif
                </button>
                <button 
                    onClick={() => setFilterBy('harvest_time')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filterBy === 'harvest_time' ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                    Waktu Panen
                </button>
                <button 
                    onClick={() => setFilterBy('day_count')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filterBy === 'day_count' ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                    Durasi Hari
                </button>
                <button 
                    onClick={() => setFilterBy('inactive')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filterBy === 'inactive' ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                    Tidak Aktif
                </button>
            </div>
        </div>

        {processedBins.length === 0 ? (
             <div className="text-center py-12 opacity-50 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                 <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.Leaf className="w-8 h-8 text-gray-400" />
                 </div>
                 <p className="text-gray-500 italic">Tidak ada tong kompos di kategori ini.</p>
                 <button onClick={onScan} className="mt-4 text-primary-600 font-bold text-sm hover:underline">
                    Buat Baru
                 </button>
             </div>
        ) : (
            // GRID LAYOUT IMPROVED FOR PC: lg:grid-cols-3 xl:grid-cols-4
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Render Processed Bins */}
                {processedBins.map((bin) => (
                  <div key={bin.id} onClick={() => onViewDetail(bin)} className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 relative overflow-hidden cursor-pointer active:scale-95 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 mr-2 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-800 truncate">{bin.name}</h3>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block border mt-1 ${
                            bin.status === 'Aktif' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                            {bin.status}
                        </span>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-1">Fase: {bin.phase}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                         <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-full border border-primary-100">Hari ke-{bin.day}</span>
                         <div className="flex gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => setEditingBin(bin)} 
                                className="p-1.5 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Icons.Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setDeletingBin(bin)} 
                                className="p-1.5 bg-gray-50 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Icons.Trash className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                    </div>
                    
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${bin.status === 'Aktif' ? 'bg-primary-500' : 'bg-gray-400'}`}
                        style={{ width: `${Math.min((bin.day / 14) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                      <span>Panen: {bin.estHarvest} Hari lg</span>
                      <span className="text-primary-600 font-bold flex items-center gap-1 group-hover:underline">
                        Detail <Icons.ArrowLeft className="w-3 h-3 rotate-180" />
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Add New Bin Card (Always visible at the end of the list) */}
                <button 
                  onClick={onScan}
                  className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-white hover:border-primary-400 hover:text-primary-600 transition-all cursor-pointer group active:scale-95 h-full min-h-[180px]"
                >
                   <div className="bg-white p-4 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-sm border border-gray-200 group-hover:border-primary-200">
                      <Icons.Plus className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
                   </div>
                   <p className="text-base font-bold">Tambah Tong</p>
                </button>
            </div>
        )}
      </div>

      {/* Floating Action Buttons - Mobile Only (md:hidden) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-6 flex justify-between items-end pointer-events-none md:hidden">
        
        <div className="w-12"></div> {/* Spacer */}
        
        {/* Main Camera Button */}
        <div className="flex flex-col items-center gap-2 pointer-events-auto -ml-4">
            <span className="text-xs font-bold text-white bg-primary-600 px-3 py-1 rounded-full shadow-lg animate-bounce mb-1">Pindai Limbah</span>
            <button 
              onClick={onScan}
              className="bg-primary-600 text-white w-16 h-16 rounded-full shadow-2xl shadow-primary-600/40 flex items-center justify-center hover:bg-primary-500 transition-colors ring-4 ring-white"
            >
              <Icons.Camera className="w-8 h-8" />
            </button>
        </div>

        {/* Chat Button */}
        <div className="pointer-events-auto">
            <button 
              onClick={onGlobalChat}
              className="bg-white text-primary-600 w-12 h-12 rounded-full shadow-lg shadow-gray-400/20 flex items-center justify-center hover:bg-gray-50 transition-colors ring-2 ring-gray-100 border border-gray-200"
            >
              <Icons.MessageSquare className="w-6 h-6" />
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
