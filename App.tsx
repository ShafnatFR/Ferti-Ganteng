
import React, { useState } from 'react';
import { Bin, ChatSession, LogEntry, AIAnalysisResult } from './types';
import { SplashScreen, LoginScreen } from './screens/Onboarding';
import { Dashboard } from './screens/Dashboard';
import { SmartScanner } from './screens/SmartScanner';
import { AnalysisPage } from './screens/AnalysisPage';
import { RecipePage } from './screens/RecipePage';
import { CompostDetailPage } from './screens/CompostDetailPage';
import { HistoryPage } from './screens/HistoryPage';
import { GlobalChatPage } from './screens/GlobalChatPage';
import { HarvestInstructionPage, HarvestResultPage } from './screens/HarvestPages';

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
      setSelectedBin(newBin);
      setScreen('detail');
  };

  const handleDeleteBin = (id: number) => { setBins(prev => prev.filter(b => b.id !== id)); };
  const handleRenameBin = (id: number, newName: string) => { setBins(prev => prev.map(b => b.id === id ? { ...b, name: newName } : b)); };
  
  const handleLogIssue = (type: string, note: string) => {
      if (!selectedBin) return;
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const newLog: LogEntry = { date: today, title: "Laporan Masalah", description: note, type: "warning" };
      const updatedBin = { ...selectedBin, logs: [...selectedBin.logs, newLog] };
      setSelectedBin(updatedBin);
      setBins(prev => prev.map(b => b.id === selectedBin.id ? updatedBin : b));
  };

  // Simple Router Switch
  return (
    <div className="font-sans text-gray-900 max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
      {screen === 'splash' && <SplashScreen onNext={() => setScreen('login')} />}
      {screen === 'login' && <LoginScreen onLogin={() => setScreen('dashboard')} />}
      {screen === 'dashboard' && (
          <Dashboard 
            bins={bins}
            onScan={() => setScreen('scanner')} 
            onViewDetail={(bin) => { setSelectedBin(bin); setScreen('detail'); }}
            onDeleteBin={handleDeleteBin}
            onRenameBin={handleRenameBin}
            onGlobalChat={() => setScreen('global_chat')}
          />
      )}
      {screen === 'scanner' && (
          <SmartScanner 
            onAnalyzeSuccess={handleAnalyzeSuccess} 
            onBack={() => setScreen('dashboard')} 
          />
      )}
      {screen === 'analysis' && aiAnalysis && (
          <AnalysisPage 
             image={scannedImage} 
             aiResponse={aiAnalysis} 
             onNext={() => setScreen('recipe')}
             onRescue={() => alert("Mengarahkan ke halaman Donasi Mitra...")} 
             onBack={() => setScreen('scanner')}
          />
      )}
      {screen === 'recipe' && <RecipePage onFinish={handleFinishRecipe} />}
      {screen === 'detail' && (
          <CompostDetailPage 
            bin={selectedBin}
            onBack={() => setScreen('dashboard')}
            onOpenHistory={() => setScreen('history')}
            onLogIssue={handleLogIssue}
            onHarvestInstruction={() => setScreen('harvest_instruct')} 
          />
      )}
      {screen === 'history' && selectedBin && <HistoryPage bin={selectedBin} onBack={() => setScreen('detail')} />}
      {screen === 'global_chat' && (
          <GlobalChatPage 
             onBack={() => setScreen('dashboard')} 
             sessions={chatSessions}
             onUpdateSessions={setChatSessions}
          />
      )}
      {screen === 'harvest_instruct' && <HarvestInstructionPage onConfirmHarvest={() => setScreen('harvest_result')} />}
      {screen === 'harvest_result' && <HarvestResultPage onHome={() => setScreen('dashboard')} />}
    </div>
  );
};
