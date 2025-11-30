
import React, { useState, useRef } from 'react';
import { Icons } from '../components/Icons';
import { NotificationItem } from '../types';

interface NotificationsPageProps {
    notifications: NotificationItem[];
    onBack: () => void;
    onMarkAllRead: (ids?: string[]) => void;
    onMoveToTrash: (ids: string[]) => void;
    onPermanentDelete: (ids: string[]) => void;
    onRestore: (ids: string[]) => void;
    onArchive: (ids: string[]) => void;
}

interface NotificationCardProps {
    item: NotificationItem;
    getIcon: (t: string) => React.ReactNode;
    getBgColor: (t: string) => string;
    onSwipeLeft: (id: string) => void;
    onSwipeRight: (id: string) => void;
    isSelectionMode: boolean;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    isInTrash: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
    item, 
    getIcon, 
    getBgColor, 
    onSwipeLeft, 
    onSwipeRight, 
    isSelectionMode,
    isSelected,
    onToggleSelect,
    isInTrash
}) => {
    const [offsetX, setOffsetX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);

    // Common swipe logic
    const handleStart = (clientX: number) => {
        if (isSelectionMode) return;
        setIsDragging(true);
        startX.current = clientX;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging || isSelectionMode) return;
        const diff = clientX - startX.current;
        
        // Limit swipe range
        if (diff > -250 && diff < 250) {
             setOffsetX(diff);
        }
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        
        // Threshold to trigger action (100px)
        if (offsetX > 100) {
            onSwipeRight(item.id);
        } else if (offsetX < -100) {
            onSwipeLeft(item.id);
        }
        
        // Reset position
        setOffsetX(0);
    };

    // Touch Events
    const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleEnd();

    // Mouse Events
    const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
    const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setOffsetX(0);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-xl mb-3 select-none group">
            {/* Background Actions Layer - Blue removed, using Gray/Neutral for Archive */}
            <div className={`absolute inset-0 flex justify-between items-center px-6 rounded-xl transition-colors duration-200 ${
                offsetX > 0 
                    ? (isInTrash ? 'bg-green-500' : 'bg-gray-500') // Right swipe: Restore (Green) or Archive (Gray)
                    : offsetX < 0 
                        ? (isInTrash ? 'bg-red-900' : 'bg-red-500') // Left swipe: Permanent Delete or Move to Trash
                        : 'bg-gray-100'
            }`}>
                {/* Left Action (Swipe Right to Trigger) */}
                <div className={`flex items-center gap-2 text-white font-bold transition-all duration-200 transform ${
                    offsetX > 50 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                    {isInTrash ? (
                        <>
                            <Icons.CheckSquare className="w-6 h-6" /> 
                            <span className="text-sm">Pulihkan</span>
                        </>
                    ) : (
                        <>
                            <Icons.Archive className="w-6 h-6" /> 
                            <span className="text-sm">Arsipkan</span>
                        </>
                    )}
                </div>

                {/* Right Action (Swipe Left to Trigger) */}
                <div className={`flex items-center gap-2 text-white font-bold transition-all duration-200 transform ${
                    offsetX < -50 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                    <span className="text-sm">{isInTrash ? "Hapus Permanen" : "Sampah"}</span>
                    <Icons.Trash className="w-6 h-6" />
                </div>
            </div>

            {/* Foreground Content Card */}
            <div 
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onClick={() => isSelectionMode && onToggleSelect(item.id)}
                style={{ 
                    transform: `translateX(${offsetX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' 
                }}
                className={`relative p-4 rounded-xl border flex gap-4 bg-white shadow-sm z-10 ${isSelectionMode ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'} ${getBgColor(item.type)}`}
            >
                <div className="bg-white/60 p-2 h-fit rounded-full shadow-sm shrink-0">
                    {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-800 text-sm truncate pr-2">{item.title}</h4>
                        <span className="text-[10px] text-gray-500 shrink-0 whitespace-nowrap">{item.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{item.message}</p>
                </div>
                
                {isSelectionMode ? (
                    <div className="flex items-center justify-center pl-2">
                        {isSelected ? (
                            <Icons.CheckSquare className="w-6 h-6 text-primary-600" />
                        ) : (
                            <Icons.Square className="w-6 h-6 text-gray-300" />
                        )}
                    </div>
                ) : !item.isRead && !isInTrash && (
                    <div className="absolute top-4 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></div>
                )}
            </div>
        </div>
    );
};

export const NotificationsPage = ({ 
    notifications, 
    onBack, 
    onMarkAllRead, 
    onMoveToTrash, 
    onPermanentDelete, 
    onRestore,
    onArchive 
}: NotificationsPageProps) => {
    const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'success' | 'archived' | 'trash'>('all');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'trash') return n.isTrash; 
        if (n.isTrash) return false;
        if (filter === 'archived') return n.isArchived;
        if (n.isArchived) return false; 
        if (filter === 'all') return true;
        return n.type === filter;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <Icons.AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'success': return <Icons.Check className="w-5 h-5 text-green-500" />;
            default: return <Icons.Bell className="w-5 h-5 text-gray-500" />; // Neutral icon for info
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'warning': return 'bg-orange-50 border-orange-100';
            case 'success': return 'bg-green-50 border-green-100';
            default: return 'bg-gray-50 border-gray-100'; // Neutral bg for info
        }
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleSwipeLeft = (id: string) => {
        if (filter === 'trash') {
            onPermanentDelete([id]);
        } else {
            onMoveToTrash([id]);
        }
    };

    const handleSwipeRight = (id: string) => {
        if (filter === 'trash') {
            onRestore([id]);
        } else {
            onArchive([id]);
        }
    };

    const handleBulkDeleteAction = () => {
        const ids = Array.from(selectedIds) as string[];
        if (filter === 'trash') {
            onPermanentDelete(ids);
        } else {
            onMoveToTrash(ids);
        }
        setIsSelectionMode(false);
        setSelectedIds(new Set());
    };

    const handleBulkArchive = () => {
        const ids = Array.from(selectedIds) as string[];
        if (filter === 'trash') {
            onRestore(ids);
        } else {
            onArchive(ids);
        }
        setIsSelectionMode(false);
        setSelectedIds(new Set());
    };

    const handleBulkRead = () => {
        onMarkAllRead(Array.from(selectedIds) as string[]);
        setIsSelectionMode(false);
        setSelectedIds(new Set());
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col" onClick={() => setIsMenuOpen(false)}>
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-20 sticky top-0">
                {isSelectionMode ? (
                    <>
                        <button onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }} className="text-gray-600 font-bold text-sm">
                            Batal
                        </button>
                        <div className="flex-1 text-center font-bold text-gray-800">
                            {selectedIds.size} Dipilih
                        </div>
                        <button onClick={() => setSelectedIds(new Set(filteredNotifications.map(n => n.id)))} className="text-primary-600 font-bold text-sm">
                            Pilih Semua
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={onBack} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                            <Icons.ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-gray-800">Notifikasi</h2>
                            <p className="text-xs text-gray-500">
                                {filter === 'trash' ? 'Kelola item yang dihapus' : 'Geser untuk arsip/buang'}
                            </p>
                        </div>
                        <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <Icons.MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                            
                            {isMenuOpen && (
                                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up z-50">
                                    <button 
                                        onClick={() => { setIsSelectionMode(true); setIsMenuOpen(false); }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Icons.CheckSquare className="w-4 h-4" /> Pilih Banyak
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Filter Tabs - Removed Blue/Info, replaced with Neutral */}
            {!isSelectionMode && (
                <div className="bg-white px-4 pb-3 pt-1 flex gap-2 overflow-x-auto border-b border-gray-100 scrollbar-hide sticky top-[72px] z-10 whitespace-nowrap">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border shrink-0 ${filter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'}`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => setFilter('warning')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1 shrink-0 ${filter === 'warning' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-white text-gray-500 border-gray-200'}`}
                    >
                        <Icons.AlertTriangle className="w-3 h-3" /> Penting
                    </button>
                    <button 
                        onClick={() => setFilter('info')}
                        // Changed from Blue to Gray/Neutral
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1 shrink-0 ${filter === 'info' ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white text-gray-500 border-gray-200'}`}
                    >
                        <Icons.Bell className="w-3 h-3" /> Info
                    </button>
                    <button 
                        onClick={() => setFilter('success')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1 shrink-0 ${filter === 'success' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200'}`}
                    >
                        <Icons.Check className="w-3 h-3" /> Selesai
                    </button>
                    <button 
                        onClick={() => setFilter('archived')}
                        // Changed from Purple to Neutral/Dark Gray
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1 shrink-0 ${filter === 'archived' ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white text-gray-500 border-gray-200'}`}
                    >
                        <Icons.Archive className="w-3 h-3" /> Arsip
                    </button>
                    <button 
                        onClick={() => setFilter('trash')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1 shrink-0 ${filter === 'trash' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white text-gray-500 border-gray-200'}`}
                    >
                        <Icons.Trash className="w-3 h-3" /> Sampah
                    </button>
                </div>
            )}

            {/* Notification List */}
            <div className="flex-1 p-4 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <div className="bg-gray-200 p-4 rounded-full mb-4">
                            {filter === 'archived' ? <Icons.Archive className="w-8 h-8 text-gray-400" /> : 
                             filter === 'trash' ? <Icons.Trash className="w-8 h-8 text-gray-400" /> :
                             <Icons.Bell className="w-8 h-8 text-gray-400" />}
                        </div>
                        <p className="text-gray-500 font-medium">Tidak ada notifikasi</p>
                        <p className="text-xs text-gray-400">
                            {filter === 'trash' ? 'Keranjang sampah kosong' : 'Untuk kategori ini.'}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((item) => (
                        <NotificationCard 
                            key={item.id} 
                            item={item} 
                            getIcon={getIcon} 
                            getBgColor={getBgColor} 
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedIds.has(item.id)}
                            onToggleSelect={toggleSelection}
                            isInTrash={filter === 'trash'}
                        />
                    ))
                )}
            </div>

            {/* Bulk Actions Bottom Bar */}
            {isSelectionMode && selectedIds.size > 0 && (
                <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] sticky bottom-0 z-30 animate-slide-up">
                    {filter !== 'trash' && (
                        <button onClick={handleBulkRead} className="flex flex-col items-center gap-1 text-gray-600 active:scale-95 transition-transform flex-1">
                            <Icons.Check className="w-5 h-5" />
                            <span className="text-[10px] font-bold">Baca</span>
                        </button>
                    )}
                    
                    <button onClick={handleBulkArchive} className="flex flex-col items-center gap-1 text-gray-600 active:scale-95 transition-transform flex-1">
                        {filter === 'trash' ? (
                            <>
                                <Icons.CheckSquare className="w-5 h-5" />
                                <span className="text-[10px] font-bold">Pulihkan</span>
                            </>
                        ) : (
                            <>
                                <Icons.Archive className="w-5 h-5" />
                                <span className="text-[10px] font-bold">Arsip</span>
                            </>
                        )}
                    </button>
                    
                    <button onClick={handleBulkDeleteAction} className="flex flex-col items-center gap-1 text-red-600 active:scale-95 transition-transform flex-1">
                        <Icons.Trash className="w-5 h-5" />
                        <span className="text-[10px] font-bold">
                            {filter === 'trash' ? "Hapus Permanen" : "Pindah Sampah"}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};
