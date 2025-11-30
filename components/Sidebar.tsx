
import React from 'react';
import { Icons } from './Icons';

interface SidebarProps {
    currentScreen: string;
    onNavigate: (screen: string) => void;
    unreadCount: number;
    onScan: () => void;
    onLogout: () => void;
}

export const Sidebar = ({ currentScreen, onNavigate, unreadCount, onScan, onLogout }: SidebarProps) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Icons.Leaf className="w-5 h-5" /> },
        { id: 'notifications', label: 'Notifikasi', icon: <Icons.Bell className="w-5 h-5" />, badge: unreadCount },
        { id: 'global_chat', label: 'Chat AI Global', icon: <Icons.MessageSquare className="w-5 h-5" /> },
    ];

    return (
        <div className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col h-screen sticky top-0 left-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3 text-primary-600 mb-1">
                    <div className="bg-primary-50 p-2 rounded-xl">
                        <Icons.Leaf className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-800">EcoFormulator</span>
                </div>
                <p className="text-xs text-gray-400 font-medium pl-12">Smart Formula, Sustainable Harvest.</p>
            </div>

            {/* Menu */}
            <div className="flex-1 px-4 space-y-2 py-4">
                <button 
                    onClick={onScan}
                    className="w-full bg-primary-600 text-white p-4 rounded-xl shadow-lg shadow-primary-600/20 flex items-center justify-center gap-3 mb-8 hover:bg-primary-700 transition-all font-bold group"
                >
                    <Icons.Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Scan Limbah</span>
                </button>

                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all font-medium ${
                            currentScreen === item.id 
                            ? 'bg-primary-50 text-primary-700 font-bold' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                        {item.badge ? (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                        ) : null}
                    </button>
                ))}
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-gray-100 mx-4 mb-4">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors" onClick={onLogout}>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold border-2 border-white shadow-sm">
                        B
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">Budi Santoso</p>
                        <p className="text-xs text-gray-400 truncate">Petani Kota Lv.1</p>
                    </div>
                    <Icons.ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </div>
            </div>
        </div>
    );
};
