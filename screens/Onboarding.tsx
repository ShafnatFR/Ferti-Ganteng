
import React from 'react';
import { Icons } from '../components/Icons';

export const SplashScreen = ({ onNext }: { onNext: () => void }) => (
  <div className="h-screen w-full bg-primary-600 flex flex-col items-center justify-center relative overflow-hidden" onClick={onNext}>
    <div className="absolute inset-0 opacity-10">
       <svg width="100%" height="100%">
         <circle cx="10%" cy="10%" r="50" fill="white"/>
         <circle cx="80%" cy="80%" r="80" fill="white"/>
         <path d="M0,50 Q50,0 100,50 T200,50" fill="none" stroke="white" strokeWidth="5"/>
       </svg>
    </div>

    <div className="z-10 flex flex-col items-center text-white animate-fade-in-up p-8">
      <div className="bg-white p-5 rounded-3xl mb-6 shadow-2xl shadow-primary-900/20">
        <Icons.Leaf className="w-16 h-16 text-primary-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">Eco-Formulator AI</h1>
      <p className="text-lg font-light mb-8 text-center text-primary-100">"Smart Formula, Sustainable Harvest."</p>
      
      <p className="text-sm opacity-70 animate-pulse mt-12 text-primary-200">Ketuk layar untuk mulai</p>
    </div>
  </div>
);

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="h-screen w-full bg-white flex flex-col p-8 justify-center">
    <div className="mb-10 text-center">
      <div className="inline-block bg-primary-50 p-4 rounded-full mb-4">
        <Icons.Leaf className="w-12 h-12 text-primary-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Selamat Datang</h2>
      <p className="text-gray-500 mt-2">Bergabung bersama FoodAIRescue untuk menyelamatkan pangan dan lingkungan.</p>
    </div>

    <div className="space-y-4">
      <button 
        onClick={onLogin}
        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
      >
        <Icons.Google className="w-5 h-5" />
        Masuk dengan Google
      </button>

      <button 
        onClick={onLogin}
        className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-primary-700 transition-all shadow-primary-600/30"
      >
        Lanjut sebagai Tamu
      </button>
    </div>

    <p className="mt-8 text-xs text-center text-gray-400">
      Dengan masuk, Anda menyetujui Syarat & Ketentuan FoodAIRescue.
    </p>
  </div>
);
