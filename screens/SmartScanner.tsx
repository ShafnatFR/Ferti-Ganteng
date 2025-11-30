
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/GeminiService';
import { AIAnalysisResult } from '../types';
import { Icons } from '../components/Icons';

export const SmartScanner = ({ onAnalyzeSuccess, onBack }: { onAnalyzeSuccess: (img: string, result: AIAnalysisResult) => void, onBack: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const capture = async () => {
    setLoading(true);
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        
        // Gunakan GeminiService (OOP) untuk analisis
        const result = await geminiService.analyzeWasteImage(imageData);
        onAnalyzeSuccess(imageData, result);
        setLoading(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setLoading(true);
          const reader = new FileReader();
          reader.onloadend = async () => {
              const base64data = reader.result as string;
              // Analisis gambar upload
              const result = await geminiService.analyzeWasteImage(base64data);
              onAnalyzeSuccess(base64data, result);
              setLoading(false);
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-gray-900 overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-primary-500 opacity-30 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 shadow-[0_0_15px_rgba(255,117,31,0.8)] animate-scan"></div>
          </div>
          <div className="absolute top-10 left-10 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
          <div className="absolute top-10 right-10 w-16 h-16 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
          <div className="absolute bottom-24 left-10 w-16 h-16 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
          <div className="absolute bottom-24 right-10 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-xl"></div>
        </div>

        <div className="absolute top-1/2 left-0 w-full text-center transform -translate-y-1/2">
             <p className="text-white font-mono text-sm bg-black/50 inline-block px-4 py-2 rounded animate-pulse">
                {loading ? "Gemini AI sedang menganalisis..." : "Arahkan ke Limbah Pangan"}
             </p>
        </div>
      </div>

      <div className="h-32 bg-black flex items-center justify-center relative gap-8">
        <button onClick={onBack} className="absolute left-6 text-white text-sm font-bold">Kembali</button>
        
        {/* Shutter Button */}
        <button 
          onClick={capture}
          disabled={loading}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
        >
           <div className="w-16 h-16 bg-white rounded-full"></div>
        </button>

        {/* Gallery Upload Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="absolute right-8 text-white flex flex-col items-center gap-1 hover:text-primary-400 transition-colors"
        >
            <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center">
                <Icons.Image className="w-6 h-6" />
            </div>
            <span className="text-[10px]">Galeri</span>
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/*" 
            onChange={handleFileUpload} 
        />
      </div>
    </div>
  );
};
