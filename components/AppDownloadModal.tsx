import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  QrCode, 
  Download, 
  Share2, 
  Check, 
  ExternalLink, 
  Apple, 
  Play, 
  Sparkles,
  MonitorCheck
} from 'lucide-react';
import { LOGO_IMG } from '../constants';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ios' | 'android' | 'pc' | 'qr'>('all');
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Default app link (Domain or Current Origin)
  const appDomain = 'https://gecekavurmacisi.com.tr';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : appDomain;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appDomain)}`;

  useEffect(() => {
    // Handle PWA install prompt for PC / Android browsers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('PWA (Web Uygulaması) kurulumu için tarayıcınızın adres çubuğundaki "Uygulamayı Yükle" veya "Masaüstüne Ekle" butonunu kullanabilirsiniz.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-brand-600 to-orange-700 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            title="Kapat"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg shrink-0 overflow-hidden border-2 border-amber-300">
              <img 
                src={LOGO_IMG} 
                alt="Gece Kavurmacısı Logo" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-100 text-xs font-semibold mb-1 border border-amber-300/30">
                <Sparkles size={12} className="text-amber-300" /> Mobil & Masaüstü Uygulama
              </div>
              <h2 className="text-2xl font-black tracking-tight">Gece Kavurmacısı Cepte & PC'de!</h2>
              <p className="text-amber-100 text-xs mt-0.5">
                Telefonunuzdan veya Bilgisayarınızdan 7/24 tek tıkla leziz kavurma siparişi verin.
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 mt-6 bg-black/20 p-1 rounded-xl text-xs overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'all' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Smartphone size={14} /> Tüm Cihazlar
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ios' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Apple size={14} /> iOS (Apple App Store)
            </button>
            <button
              onClick={() => setActiveTab('android')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'android' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Play size={14} /> Android (Play Store)
            </button>
            <button
              onClick={() => setActiveTab('pc')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'pc' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Laptop size={14} /> PC & Masaüstü
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'qr' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <QrCode size={14} /> QR Kodu
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* iOS / Apple App Store Section */}
          {(activeTab === 'all' || activeTab === 'ios') && (
            <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-md">
                  <Apple size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                    Apple App Store (iPhone, iPad & Mac)
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold">
                      iOS Uyumlu
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    Safari veya App Store üzerinden cihazınıza anında indirin veya ana ekrana ekleyin.
                  </p>
                </div>
              </div>

              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
              >
                <Apple size={18} />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium leading-none">İndirin</div>
                  <div className="text-xs font-bold leading-none mt-0.5">App Store</div>
                </div>
              </a>
            </div>
          )}

          {/* Android / Google Play Store Section */}
          {(activeTab === 'all' || activeTab === 'android') && (
            <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Play size={24} className="fill-white translate-x-0.5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                    Google Play Store (Android Telefon & Tablet)
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 font-semibold">
                      Mobil Uyumlu
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    Android telefonlar için özel yüksek performanslı mobil arayüz.
                  </p>
                </div>
              </div>

              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
              >
                <Play size={18} className="text-emerald-400 fill-emerald-400" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium leading-none">İndirin</div>
                  <div className="text-xs font-bold leading-none mt-0.5">Google Play</div>
                </div>
              </a>
            </div>
          )}

          {/* PC / Laptop Desktop Section */}
          {(activeTab === 'all' || activeTab === 'pc') && (
            <div className="p-4 rounded-xl border border-brand-200 dark:border-brand-900/40 bg-brand-50/40 dark:bg-brand-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Laptop size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                    Bilgisayar & PC Masaüstü Uygulaması
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300 font-bold">
                      PWA Yükle
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    Windows, Mac veya Linux bilgisayarınıza doğrudan masaüstü kısayolu olarak kurun.
                  </p>
                </div>
              </div>

              <button
                onClick={handleInstallPWA}
                className="w-full sm:w-auto px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
              >
                {isInstalled ? (
                  <>
                    <MonitorCheck size={18} />
                    <span>Masaüstüne Yüklendi</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>PC'ye Kur / Yükle</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* QR Code Scan Section */}
          {(activeTab === 'all' || activeTab === 'qr') && (
            <div className="p-5 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700/50 bg-amber-50/30 dark:bg-amber-950/10 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <QrCode size={16} /> QR Kod İle İndirme & Bağlanma
              </div>
              <p className="text-xs text-gray-600 dark:text-zinc-300 max-w-md mx-auto">
                Telefonunuzun veya tabletinizin kamerasını aşağıdaki QR koda tutarak web/mobil uygulamaya doğrudan erişebilir, cihazınıza indirebilirsiniz:
              </p>

              <div className="flex flex-col items-center justify-center py-2">
                <div className="p-3 bg-white rounded-2xl shadow-xl border border-gray-200 inline-block relative group">
                  <img 
                    src={qrUrl} 
                    alt="Gece Kavurmacısı QR Kod" 
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                    <span className="bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">gecekavurmacisi.com.tr</span>
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-zinc-400 font-semibold mt-2">
                  Direkt Adres: <span className="text-brand-600 font-bold">gecekavurmacisi.com.tr</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 rounded-xl text-xs font-bold border border-gray-200 dark:border-zinc-700 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
                  <span>{copied ? 'Bağlantı Kopyalandı!' : 'İndirme Bağlantısını Kopyala'}</span>
                </button>

                <a
                  href={qrUrl}
                  download="gece_kavurmacisi_qr.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download size={15} />
                  <span>QR Kodu Gör / İndir</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 text-center text-xs text-gray-500 dark:text-zinc-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            🌐 Resmi Web & Mobil Giriş: <strong>gecekavurmacisi.com.tr</strong>
          </span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 text-gray-700 dark:text-zinc-300 rounded-lg font-bold text-xs transition-colors ml-auto cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
