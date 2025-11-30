
import React, { useState } from 'react';
import { Bin, ChatSession, LogEntry, AIAnalysisResult, NotificationItem, IssueDetails } from './types';
import { SplashScreen, LoginScreen } from './screens/Onboarding';
import { Dashboard } from './screens/Dashboard';
import { SmartScanner } from './screens/SmartScanner';
import { AnalysisPage } from './screens/AnalysisPage';
import { RecipePage } from './screens/RecipePage';
import { CompostDetailPage } from './screens/CompostDetailPage';
import { HistoryPage } from './screens/HistoryPage';
import { GlobalChatPage } from './screens/GlobalChatPage';
import { HarvestInstructionPage, HarvestResultPage } from './screens/HarvestPages';
import { NotificationsPage } from './screens/NotificationsPage';
import { Sidebar } from './components/Sidebar';

export const App = () => {
  const [screen, setScreen] = useState('splash'); 
  const [scannedImage, setScannedImage] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  
  // State Data
  const [bins, setBins] = useState<Bin[]>([
      { 
          id: 1, 
          name: "Tong Kompos 1", 
          status: "Aktif", 
          phase: "Termofilik (Suhu Naik)", 
          day: 5, 
          estHarvest: 9,
          logs: [
              { date: "10 Okt", title: "Pembuatan Awal", description: "Resep kompos dibuat.", type: "success" },
              { date: "12 Okt", title: "Cek Rutin", description: "Suhu naik, kelembaban pas.", type: "info" }
          ]
      }
  ]);
  const [selectedBin, setSelectedBin] = useState<Bin | undefined>(undefined);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  // Notifications State with Mock Data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
      {
          id: '1',
          title: 'Waktunya Mengaduk!',
          message: 'Tong Kompos 1 sudah 2 hari tidak diaduk. Lakukan aerasi agar bakteri bekerja optimal.',
          date: 'Baru saja',
          type: 'warning',
          isRead: false,
          isArchived: false,
          isTrash: false
      },
      {
          id: '2',
          title: 'Fase Termofilik Tercapai',
          message: 'Suhu tong meningkat, tanda bakteri bekerja dengan baik. Pertahankan kelembaban.',
          date: '2 jam lalu',
          type: 'success',
          isRead: false,
          isArchived: false,
          isTrash: false
      },
      {
          id: '3',
          title: 'Tips Mingguan',
          message: 'Coba tambahkan air cucian beras untuk nutrisi ekstra bagi mikroba kompos Anda.',
          date: 'Kemarin',
          type: 'info',
          isRead: true,
          isArchived: false,
          isTrash: false
      }
  ]);

  // Handlers
  const handleAnalyzeSuccess = (img: string, result: AIAnalysisResult) => {
      setScannedImage(img);
      setAiAnalysis(result);
      setScreen('analysis');
  };

  const handleFinishRecipe = (name: string) => {
      const newBin: Bin = {
          id: Date.now(),
          name: name || `Tong Kompos ${bins.length + 1}`,
          status: "Aktif",
          phase: "Mesofilik (Awal)",
          day: 1,
          estHarvest: 14,
          logs: [{
              date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
              title: "Kompos Dimulai",
              description: "Resep berhasil dibuat.",
              type: "success"
          }]
      };
      setBins(prev => [...prev, newBin]);
      
      // Add notification for new bin
      const newNotif: NotificationItem = {
          id: Date.now().toString(),
          title: 'Tong Baru Dibuat',
          message: `Tong "${newBin.name}" berhasil ditambahkan. Semangat mengompos!`,
          date: 'Sekarang',
          type: 'success',
          isRead: false,
          isArchived: false,
          isTrash: false
      };
      setNotifications(prev => [newNotif, ...prev]);

      setSelectedBin(newBin);
      setScreen('detail');
  };

  const handleDeleteBin = (id: number) => { setBins(prev => prev.filter(b => b.id !== id)); };
  const handleRenameBin = (id: number, newName: string) => { setBins(prev => prev.map(b => b.id === id ? { ...b, name: newName } : b)); };
  
  const handleLogIssue = (type: string, note: string, details?: IssueDetails) => {
      if (!selectedBin) return;
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const newLog: LogEntry = { 
          date: today, 
          title: "Laporan Masalah", 
          description: note, 
          type: "warning",
          issueDetails: details 
      };
      const updatedBin = { ...selectedBin, logs: [...selectedBin.logs, newLog] };
      setSelectedBin(updatedBin);
      setBins(prev => prev.map(b => b.id === selectedBin.id ? updatedBin : b));
  };

  const handleAddLog = (title: string, desc: string, type: 'info' | 'warning' | 'success') => {
      if (!selectedBin) return;
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const newLog: LogEntry = { date: today, title: title, description: desc, type: type };
      const updatedBin = { ...selectedBin, logs: [...selectedBin.logs, newLog] };
      setSelectedBin(updatedBin);
      setBins(prev => prev.map(b => b.id === selectedBin.id ? updatedBin : b));
  };

  // Notification Handlers
  const handleMarkRead = (ids?: string[]) => {
      if (!ids) {
          // Mark all as read
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } else {
          // Mark specific IDs
          setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, isRead: true } : n));
      }
  };

  // Pindahkan ke Sampah (Soft Delete)
  const handleMoveToTrash = (ids: string[]) => {
      setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, isTrash: true, isArchived: false } : n));
  };

  // Hapus Permanen (Hard Delete)
  const handlePermanentDelete = (ids: string[]) => {
      setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
  };

  // Restore dari Sampah
  const handleRestore = (ids: string[]) => {
      setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, isTrash: false } : n));
  };

  const handleArchiveNotifications = (ids: string[]) => {
      setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, isArchived: true, isTrash: false } : n));
  };

  // Render Full Screen for Splash/Login/Scanner
  if (screen === 'splash' || screen === 'login' || screen === 'scanner' || screen === 'harvest_result') {
      return (
          <div className="font-sans text-gray-900 w-full mx-auto bg-white min-h-screen">
              {screen === 'splash' && <SplashScreen onNext={() => setScreen('login')} />}
              {screen === 'login' && <LoginScreen onLogin={() => setScreen('dashboard')} />}
              {screen === 'scanner' && (
                  <SmartScanner 
                    onAnalyzeSuccess={handleAnalyzeSuccess} 
                    onBack={() => setScreen('dashboard')} 
                  />
              )}
              {screen === 'harvest_result' && <HarvestResultPage onHome={() => setScreen('dashboard')} />}
          </div>
      );
  }

  // Render Desktop Layout (Sidebar + Content) for App Screens
  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-row">
        {/* Desktop Sidebar */}
        <Sidebar 
            currentScreen={screen} 
            onNavigate={setScreen} 
            unreadCount={notifications.filter(n => !n.isRead && !n.isArchived && !n.isTrash).length}
            onScan={() => setScreen('scanner')}
            onLogout={() => setScreen('login')}
        />

        {/* Main Content Area */}
        <div className="flex-1 w-full mx-auto bg-white min-h-screen relative shadow-none md:shadow-none overflow-x-hidden">
            <div className="h-full w-full">
                {screen === 'dashboard' && (
                    <Dashboard 
                        bins={bins}
                        onScan={() => setScreen('scanner')} 
                        onViewDetail={(bin) => { setSelectedBin(bin); setScreen('detail'); }}
                        onDeleteBin={handleDeleteBin}
                        onRenameBin={handleRenameBin}
                        onGlobalChat={() => setScreen('global_chat')}
                        onViewNotifications={() => setScreen('notifications')}
                        unreadCount={notifications.filter(n => !n.isRead && !n.isArchived && !n.isTrash).length}
                    />
                )}
                {screen === 'notifications' && (
                    <NotificationsPage 
                        notifications={notifications}
                        onBack={() => setScreen('dashboard')}
                        onMarkAllRead={handleMarkRead}
                        onMoveToTrash={handleMoveToTrash}
                        onPermanentDelete={handlePermanentDelete}
                        onRestore={handleRestore}
                        onArchive={handleArchiveNotifications}
                    />
                )}
                {screen === 'analysis' && aiAnalysis && (
                    <div className="w-full h-full bg-slate-50">
                        <AnalysisPage 
                            image={scannedImage} 
                            aiResponse={aiAnalysis} 
                            onNext={() => setScreen('recipe')}
                            onRescue={() => alert("Mengarahkan ke halaman Donasi Mitra...")} 
                            onBack={() => setScreen('scanner')}
                        />
                    </div>
                )}
                {screen === 'recipe' && (
                    <div className="w-full h-full bg-white">
                        <RecipePage onFinish={handleFinishRecipe} />
                    </div>
                )}
                {screen === 'detail' && (
                    <CompostDetailPage 
                        bin={selectedBin}
                        onBack={() => setScreen('dashboard')}
                        onOpenHistory={() => setScreen('history')}
                        onLogIssue={handleLogIssue}
                        onHarvestInstruction={() => setScreen('harvest_instruct')} 
                    />
                )}
                {screen === 'history' && selectedBin && (
                    <div className="w-full h-full bg-slate-50">
                        <HistoryPage 
                            bin={selectedBin} 
                            onBack={() => setScreen('detail')}
                            onAddLog={handleAddLog}
                        />
                    </div>
                )}
                {screen === 'global_chat' && (
                    <GlobalChatPage 
                        onBack={() => setScreen('dashboard')} 
                        sessions={chatSessions}
                        onUpdateSessions={setChatSessions}
                    />
                )}
                {screen === 'harvest_instruct' && (
                    <div className="w-full h-full bg-white">
                        <HarvestInstructionPage onConfirmHarvest={() => setScreen('harvest_result')} />
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
