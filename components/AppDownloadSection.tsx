import React, { useState } from 'react';
import { 
  Apple, 
  Play, 
  Laptop, 
  QrCode, 
  Download, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { LOGO_IMG } from '../constants';

interface AppDownloadSectionProps {
  onOpenModal: () => void;
}

export const AppDownloadSection: React.FC<AppDownloadSectionProps> = ({ onOpenModal }) => {
  const [copied, setCopied] = useState(false);
  const appDomain = 'https://gecekavurmacisi.com.tr';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(appDomain)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950 text-white relative overflow-hidden my-8 rounded-3xl mx-4 max-w-7xl lg:mx-auto border border-amber-500/20 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Information & App Store Links */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
            <Sparkles size={14} className="animate-spin-slow" />
            Mobil Uyumlu & PC Masaüstü Yükleme Desteği
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Gece Kavurmacısı Uygulamasını <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Cihazınıza İndirin!
            </span>
          </h2>

          <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">
            iOS (Apple App Store), Android (Google Play Store) veya PC Bilgisayarınızda uygulama deneyimiyle hızlıca sipariş verin, lezzet puanlarınızı ve kampanyaları anında takip edin.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Apple App Store */}
            <button
              onClick={onOpenModal}
              className="p-3 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/80 rounded-2xl flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shrink-0">
                <Apple size={22} />
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 font-semibold uppercase">Apple iOS</div>
                <div className="text-xs font-bold text-white">App Store</div>
              </div>
            </button>

            {/* Google Play Store */}
            <button
              onClick={onOpenModal}
              className="p-3 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/80 rounded-2xl flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <Play size={18} className="fill-white translate-x-0.5" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 font-semibold uppercase">Android</div>
                <div className="text-xs font-bold text-white">Google Play</div>
              </div>
            </button>

            {/* PC / Masaüstü */}
            <button
              onClick={onOpenModal}
              className="p-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-2xl flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 shrink-0">
                <Laptop size={20} />
              </div>
              <div>
                <div className="text-[10px] text-amber-300 font-semibold uppercase">PC & Windows</div>
                <div className="text-xs font-bold text-white">Masaüstü Yükle</div>
              </div>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Tüm ekran ve çözünürlüklere %100 Uyumlu
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Hızlı Anlık Bildirimler
            </span>
          </div>
        </div>

        {/* Right Column: QR Code & Direct Link Box */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 text-center shadow-2xl w-full max-w-sm relative">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center mx-auto mb-3 shadow-lg font-black text-lg">
              QR
            </div>

            <h3 className="font-bold text-lg text-white mb-1">
              QR Kodu Kameranızla Tarayın
            </h3>
            <p className="text-xs text-zinc-300 mb-4">
              Telefonunuzun kamerasını doğrultarak uygulamayı anında telefonunuzda açın ve yükleyin.
            </p>

            <div className="bg-white p-3 rounded-2xl inline-block shadow-inner mb-4">
              <img 
                src={qrUrl} 
                alt="Gece Kavurmacısı QR İndirme Kodu" 
                className="w-40 h-40 object-contain rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-amber-300 tracking-wide">
                gecekavurmacisi.com.tr
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
                </button>

                <button
                  onClick={onOpenModal}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <QrCode size={14} /> Detaylar & Yükle
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
