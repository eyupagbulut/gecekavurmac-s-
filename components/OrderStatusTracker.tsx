import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  CheckCircle, 
  Clock, 
  Flame, 
  Bike, 
  PackageCheck, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Trash2, 
  Compass, 
  MapPin, 
  PhoneCall, 
  CreditCard,
  Radio,
  Navigation,
  Signal,
  ShoppingBag
} from 'lucide-react';

// Haversine formula to compute geodesic distance between coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Live Vector Delivery Map with Real-Time Geolocation Tracking
const DeliveryRouteMap: React.FC<{ neighborhood: string; status: string; theme: 'light' | 'dark' }> = ({ neighborhood, status, theme }) => {
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [courierProgress, setCourierProgress] = useState(0.2); // ratio along path: 0 to 1
  const [courierSpeed, setCourierSpeed] = useState(25); // km/h
  const [viewMode, setViewMode] = useState<'kroki' | 'gps'>('kroki');

  // Restaurant Coordinates (Kavurmacı Kadıköy - Fikirtepe Outlet)
  const RESTAURANT = { lat: 40.9910, lng: 29.0550, name: "Kavurmacı Kadıköy" };

  // Calculate live distance when coords are available
  const currentDistance = userCoords 
    ? calculateDistance(RESTAURANT.lat, RESTAURANT.lng, userCoords.lat, userCoords.lng)
    : null;

  // Track and increment courier along the route in real-time if order status is 'Yolda'
  useEffect(() => {
    if (status !== 'Yolda') {
      if (status === 'Alındı') setCourierProgress(0);
      else if (status === 'Hazırlanıyor') setCourierProgress(0.15);
      else if (status === 'Teslim Edildi') setCourierProgress(1.0);
      return;
    }

    // Set starting ratio for 'Yolda'
    setCourierProgress(prev => prev < 0.25 ? 0.25 : prev);

    const timer = setInterval(() => {
      setCourierProgress(prev => {
        if (prev >= 0.96) return 0.96;
        return prev + 0.008; // progressively moves closer
      });

      // Fluctuate bike speed randomly for realistic visual HUD updates
      setCourierSpeed(prev => {
        const dev = (Math.random() - 0.5) * 5;
        return Math.min(35, Math.max(16, Math.round(prev + dev)));
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [status]);

  // Command to initiate genuine HTML5 Geolocation tracking
  const activateGpsTracking = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Tarayıcınız veya cihazınız canlı GPS özelliğini desteklemiyor.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGpsActive(true);
        setViewMode('gps');
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        if (error.code === 1) { // PERMISSION_DENIED
          setGpsError("GPS izni reddedildi. İzni açmak için adres çubuğu kilit simgesine dokunun, konum iznini 'İzin Ver' yapıp sayfayı yenileyin.");
        } else {
          setGpsError(`Konum alınamadı: ${error.message}`);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Determine positions on Kadıköy schematic map (Kroki view)
  let bikePos = { x: 60, y: 50 };
  let statusText = "Siparişinizi hazırlamaya başladık!";
  let animationClass = "";

  if (status === 'Alındı') {
    bikePos = { x: 60, y: 50 };
    statusText = "Siparişiniz onaylandı, hazırlanmak üzere sıraya alındı.";
  } else if (status === 'Hazırlanıyor') {
    bikePos = { x: 105, y: 50 };
    statusText = "Nefis kavurma ve tereyağlı pilavınız özenle hazırlanıyor.";
    animationClass = "animate-pulse";
  } else if (status === 'Yolda') {
    // Interpolating on the schematic coordinate path based on visual ratio
    const t = courierProgress;
    // Map path: (60,50) -> (150,50) -> (220,110) -> (320,120)
    if (t < 0.3) {
      // first leg (60,50) to (150,50)
      const ratio = t / 0.3;
      bikePos = { x: 60 + ratio * 90, y: 50 };
    } else if (t < 0.75) {
      // second leg (150,50) to (220,110)
      const ratio = (t - 0.3) / 0.45;
      bikePos = { x: 150 + ratio * 70, y: 50 + ratio * 60 };
    } else {
      // third leg (220,110) to (320,120)
      const ratio = (t - 0.75) / 0.25;
      bikePos = { x: 220 + ratio * 100, y: 110 + ratio * 10 };
    }
    statusText = `Kuryemiz ${courierSpeed} km/s hız ile siparişinizi sıcak bozmadan kapınıza getiriyor!`;
    animationClass = "animate-bounce duration-1000";
  } else if (status === 'Teslim Edildi') {
    bikePos = { x: 320, y: 120 };
    statusText = `Siparişiniz ${neighborhood || "adresinize"} başarıyla teslim edildi. Afiyet olsun!`;
  }

  // Determine coordinates along the real GPS neon flight plan
  // From RESTAURANT (80, 75) to USER (320, 75) on GPS radar view
  const gpsBikeX = 80 + courierProgress * 240;
  const gpsBikeY = 75;

  return (
    <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-3.5 space-y-3 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
          <Compass size={13} className="text-brand-500 animate-spin" style={{ animationDuration: '6s' }} /> CANLI TESLİMAT ROTASI
        </span>
        
        {/* Toggle View Mode buttons if GPS is active */}
        {gpsActive ? (
          <div className="flex bg-gray-200 dark:bg-zinc-900 rounded-lg p-0.5 border border-gray-100 dark:border-zinc-800 shadow-inner">
            <button
              onClick={() => setViewMode('kroki')}
              className={`text-[9px] font-extrabold px-2 py-1 rounded-md transition ${
                viewMode === 'kroki' 
                  ? 'bg-white dark:bg-zinc-850 text-gray-900 dark:text-zinc-100 shadow-sm' 
                  : 'text-gray-500 dark:text-zinc-400'
              }`}
            >
              KROKİ
            </button>
            <button
              onClick={() => setViewMode('gps')}
              className={`text-[9px] font-extrabold px-2 py-1 rounded-md transition flex items-center gap-1 ${
                viewMode === 'gps' 
                  ? 'bg-brand-500 text-white shadow-sm' 
                  : 'text-gray-500 dark:text-zinc-400'
              }`}
            >
              <Radio size={10} className="animate-pulse" /> CANLI GPS
            </button>
          </div>
        ) : (
          <button
            onClick={activateGpsTracking}
            disabled={gpsLoading}
            className="text-[9.5px] font-black tracking-tight text-brand-650 hover:text-white dark:text-brand-400 bg-brand-50 hover:bg-brand-500 dark:bg-brand-950/20 dark:hover:bg-brand-950/40 px-2.5 py-1.5 rounded-lg border border-brand-100 dark:border-brand-900/30 transition flex items-center gap-1"
          >
            {gpsLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-brand-600 dark:text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>GPS Aranıyor...</span>
              </>
            ) : (
              <>
                <Navigation size={11} className="text-brand-500 animate-pulse fill-brand-400 dark:fill-none" />
                <span>GPS Canlı Takibi Etkinleştir</span>
              </>
            )}
          </button>
        )}
      </div>

      {gpsError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20 p-2 rounded-xl text-[10px] text-red-600 dark:text-red-400 leading-normal font-semibold">
          ⚠️ {gpsError}
        </div>
      )}

      {/* Render selected map tab */}
      <div className="relative w-full h-[155px] rounded-xl border border-gray-100 dark:border-zinc-850/80 overflow-hidden bg-sky-50 dark:bg-zinc-900/90 transition-all duration-300">
        
        {viewMode === 'kroki' ? (
          /* ================= KROKİ MAP VIEW ================= */
          <svg viewBox="0 0 400 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 0,150 Q 75,120 95,65 T 105,0 L 0,0 Z" 
              className="fill-sky-100/60 dark:fill-sky-950/20 stroke-sky-200/40 dark:stroke-sky-950/30 stroke-1"
            />
            <text x="14" y="32" className="fill-sky-400/60 dark:fill-sky-850/40 text-[9px] font-black tracking-wide font-mono">Marmara Denizi</text>
            
            <rect x="260" y="15" width="80" height="35" rx="6" className="fill-emerald-100/40 dark:fill-emerald-950/15 stroke-emerald-200/50 dark:stroke-emerald-950/25 stroke-1" />
            <text x="272" y="36" className="fill-emerald-700/40 dark:fill-emerald-600/30 text-[8px] font-bold">Yoğurtçu Parkı</text>

            {/* Roads */}
            <path d="M 95,150 Q 110,100 115,0" fill="none" className="stroke-gray-150 dark:stroke-zinc-800/60 stroke-[10] opacity-85" strokeLinecap="round" />
            <path d="M 95,150 Q 110,100 115,0" fill="none" className="stroke-gray-250/50 dark:stroke-zinc-700/60 stroke-[1]" strokeDasharray="3 3" />

            <path d="M 50,50 L 350,50" fill="none" className="stroke-gray-150 dark:stroke-zinc-800/60 stroke-[10] opacity-85" strokeLinecap="round" />
            <path d="M 50,50 L 350,50" fill="none" className="stroke-gray-250/50 dark:stroke-zinc-700/60 stroke-[1]" strokeDasharray="4 4" />
            <text x="140" y="44" className="fill-gray-400 dark:fill-zinc-500 text-[8px] tracking-tight font-medium font-mono">Bahariye Cd.</text>

            <path d="M 150,50 L 150,150" fill="none" className="stroke-gray-150 dark:stroke-zinc-800/60 stroke-[8] opacity-85" strokeLinecap="round" />
            <path d="M 150,50 L 220,110 L 350,110" fill="none" className="stroke-gray-150 dark:stroke-zinc-800/60 stroke-[8] opacity-85" strokeLinecap="round" />
            <text x="235" y="104" className="fill-gray-400 dark:fill-zinc-500 text-[8px] tracking-tight font-medium font-mono">Moda Cd.</text>

            {/* Path */}
            <path 
              d="M 60,50 L 150,50 L 220,110 L 320,120" 
              fill="none" 
              className="stroke-brand-500 dark:stroke-brand-600 stroke-[3.5]" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeDasharray={status === 'Teslim Edildi' ? 'none' : '6 4'}
            />

            {/* Café Restaurant Node */}
            <g transform="translate(60, 50)">
              <circle r="14" className="fill-brand-600/10 dark:fill-brand-500/10 stroke-brand-500/30 animate-pulse stroke-1" />
              <circle r="6" className="fill-brand-650 dark:fill-brand-500" />
              <text x="0" y="-12" textAnchor="middle" className="fill-gray-800 dark:fill-zinc-100 text-[9.5px] font-black tracking-tight drop-shadow-sm font-sans">🥩 Kavurmacı</text>
            </g>

            {/* Target Cust Node */}
            <g transform="translate(320, 120)">
              {status === 'Teslim Edildi' && (
                <circle r="15" className="fill-emerald-500/15 stroke-emerald-500/50 animate-pulse stroke-1" />
              )}
              <circle r="65" className="fill-red-500/5 stroke-red-500/20 stroke-1 animate-pulse" style={{ animationDuration: '4s' }} />
              <circle r="6" className="fill-red-500 dark:fill-red-400" />
              <text x="0" y="16" textAnchor="middle" className="fill-gray-800 dark:fill-zinc-200 text-[9.5px] font-black tracking-tight font-sans">📍 Alıcı ({neighborhood || "Ev"})</text>
            </g>

            {/* Courier scooter node */}
            <g transform={`translate(${bikePos.x}, ${bikePos.y})`} className={animationClass}>
              {status === 'Yolda' && (
                <circle r="15" className="fill-blue-500/20 dark:fill-blue-400/20 stroke-blue-500/30 animate-ping stroke-1" />
              )}
              <rect x="-8.5" y="-8.5" width="17" height="17" rx="4" className="fill-blue-600 dark:fill-blue-500 stroke-white dark:stroke-zinc-900 stroke-1.5 shadow-md" />
              {/* Scooter Vector Lines */}
              <circle cx="-2.5" cy="2.5" r="1.5" className="fill-none stroke-white" strokeWidth="0.8" />
              <circle cx="2.5" cy="2.5" r="1.5" className="fill-none stroke-white" strokeWidth="0.8" />
              <path d="M-4.5 2.5 L4.5 2.5 M0 -3 L2.5 2.5 M-3.5 -1.5 L1 -1.5" className="stroke-white" strokeWidth="0.8" />
            </g>
          </svg>
        ) : (
          /* ================= CANLI GPS MAP VIEW ================= */
          <svg viewBox="0 0 400 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Radar Grid Pattern */}
              <pattern id="radar-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-gray-200/40 dark:stroke-zinc-800/40 stroke-0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#radar-grid)" />

            {/* Sweep radar circular rings centered on user coordinates */}
            <circle cx="320" cy="75" r="40" className="fill-none stroke-brand-500/10 dark:stroke-brand-500/5 stroke-1" />
            <circle cx="320" cy="75" r="80" className="fill-none stroke-brand-500/10 dark:stroke-brand-500/5 stroke-1" />
            <circle cx="320" cy="75" r="120" className="fill-none stroke-brand-500/5 dark:stroke-brand-500/2 stroke-1" />

            {/* Glowing sweep boundary arcs */}
            <path d="M 80,75 A 120,120 0 0 1 320,75" fill="none" className="stroke-brand-500/15 dark:stroke-brand-500/10 stroke-[0.8] stroke-dasharray font-mono" strokeDasharray="3 6" />

            {/* Main Flight-Path Line */}
            <line 
              x1="80" y1="75" x2="320" y2="75" 
              className="stroke-brand-500/20 dark:stroke-brand-500/15 stroke-2" 
              strokeDasharray="5 5"
            />
            {/* Glowing active path line */}
            <line 
              x1="80" y1="75" x2={gpsBikeX} y2="75" 
              className="stroke-brand-500 dark:stroke-brand-600 stroke-[3]" 
              strokeLinecap="round"
            />

            {/* Kitchen GPS Point */}
            <g transform="translate(80, 75)">
              <circle r="12" className="fill-brand-500/10 dark:fill-brand-500/5 stroke-brand-500/30 stroke-1" />
              <circle r="5" className="fill-brand-650 dark:fill-brand-500" />
              <text x="0" y="-12" textAnchor="middle" className="fill-gray-500 dark:fill-zinc-400 text-[8.5px] font-bold font-mono">KUTU: 40.991° N</text>
            </g>

            {/* GPS User Target Point with animated ripple */}
            <g transform="translate(320, 75)">
              <circle r="18" className="fill-red-500/10 stroke-red-500/30 stroke-0.5 animate-ping" style={{ animationDuration: '2.5s' }} />
              <circle r="8" className="fill-red-500/20 stroke-red-500/50 stroke-1" />
              <circle r="4.5" className="fill-red-500" />
              <text x="0" y="16" textAnchor="middle" className="fill-red-600 dark:fill-red-400 text-[8.5px] font-black font-mono">HEDEF: GPS-LOCKED</text>
            </g>

            {/* Dynamic Courier along vector */}
            <g transform={`translate(${gpsBikeX}, ${gpsBikeY})`}>
              {status === 'Yolda' && (
                <>
                  <circle r="16" className="fill-blue-500/20 stroke-blue-500/40 animate-ping stroke-0.5" style={{ animationDuration: '1.2s' }} />
                  <line x1="0" y1="-25" x2="0" y2="25" className="stroke-blue-500/30 stroke-[0.5]" strokeDasharray="3 3" />
                  <line x1="-25" y1="0" x2="25" y2="0" className="stroke-blue-500/30 stroke-[0.5]" strokeDasharray="3 3" />
                </>
              )}
              
              <rect x="-9" y="-9" width="18" height="18" rx="5" className="fill-blue-600 dark:fill-blue-500 stroke-blue-100 dark:stroke-zinc-950 stroke-1.5 shadow-lg" />
              {/* Small high-tech navigation pointer */}
              <polygon points="0,-4 3.5,3 0,1.5 -3.5,3" className="fill-white" />
            </g>
          </svg>
        )}

        {/* Dynamic Route HUD Overlay */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md py-1.5 px-2.5 rounded-xl border border-gray-100 dark:border-zinc-800/80 shadow-md flex items-center gap-1.5 text-[9px] text-gray-650 dark:text-zinc-350 font-black tracking-wide font-mono uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          KONUM: {status === 'Teslim Edildi' ? 'TESLİM EDİLDİ' : status === 'Yolda' ? 'YOLDA (AKTİF)' : 'HAZIRLANIYOR'}
        </div>

        {/* Mini Speed/Telemetry HUD Overlay (Only in GPS view) */}
        {gpsActive && viewMode === 'gps' && (
          <div className="absolute top-2.5 right-2.5 bg-zinc-950/90 text-[8.5px] font-mono text-emerald-400 border border-zinc-800 p-1.5 rounded-lg space-y-0.5 shadow-lg min-w-[105px]">
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-[7.5px] text-zinc-500 font-bold uppercase">Sinyal</span>
              <span className="font-extrabold flex items-center gap-0.5 text-emerald-400"><Signal size={8} /> OK</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span>Hız:</span>
              <span className="text-zinc-50 font-bold">{status === 'Yolda' ? `${courierSpeed} km/s` : '0 km/s'}</span>
            </div>
            <div className="flex justify-between">
              <span>Mesafe:</span>
              <span className="text-brand-400 font-bold">
                {currentDistance 
                  ? currentDistance > 25 
                    ? `${currentDistance.toFixed(1)} km (Simüle)` 
                    : `${currentDistance.toFixed(2)} km` 
                  : 'Hesaplanıyor'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>GPS Hass:</span>
              <span className="text-zinc-400">±6m (3D)</span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic tracking text based on GPS and status */}
      <div className="bg-white dark:bg-zinc-900/50 border border-gray-100/50 dark:border-zinc-850 p-3 rounded-xl shadow-inner space-y-1.5">
        <p className="text-[11px] text-gray-600 dark:text-zinc-350 text-center font-semibold leading-relaxed italic">
          "{statusText}"
        </p>
        
        {gpsActive && currentDistance && (
          <div className="border-t border-gray-100 dark:border-zinc-800/40 pt-2 flex items-center justify-between text-[10px] text-gray-500 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-red-500" />
              Alıcı Cihaz GPS: <span className="font-bold text-gray-800 dark:text-zinc-200">{userCoords?.lat.toFixed(4)}°, {userCoords?.lng.toFixed(4)}°</span>
            </span>
            <span className="text-brand-600 dark:text-brand-400 font-extrabold bg-brand-50 dark:bg-brand-950/30 px-1.5 py-0.5 rounded border border-brand-100 dark:border-brand-900/40">
              Menzil: {currentDistance > 25 ? `${currentDistance.toFixed(1)} km` : `${currentDistance.toFixed(2)} km`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface OrderStatusProgressBarProps {
  status: string;
  createdAt: number;
}

const OrderStatusProgressBar: React.FC<OrderStatusProgressBarProps> = ({ status, createdAt }) => {
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    const updateProgress = () => {
      const elapsed = Date.now() - createdAt;
      let calculatedPercent = 0;

      if (status === 'Alındı') {
        const ratio = Math.min(1, Math.max(0, elapsed / 15000));
        calculatedPercent = ratio * 33.33; // 0% to 33.33%
      } else if (status === 'Hazırlanıyor') {
        const ratio = Math.min(1, Math.max(0, (elapsed - 15000) / 30000));
        calculatedPercent = 33.33 + ratio * 33.34; // 33.33% to 66.67%
      } else if (status === 'Yolda') {
        const ratio = Math.min(1, Math.max(0, (elapsed - 45000) / 45000));
        calculatedPercent = 66.67 + ratio * 33.33; // 66.67% to 100%
      } else if (status === 'Teslim Edildi') {
        calculatedPercent = 100;
      } else {
        calculatedPercent = 0;
      }

      setPercent(Math.round(calculatedPercent));
    };

    updateProgress();
    const timer = setInterval(updateProgress, 250);
    return () => clearInterval(timer);
  }, [status, createdAt]);

  const getStatusIndex = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Alındı': return 0;
      case 'Hazırlanıyor': return 1;
      case 'Yolda': return 2;
      case 'Teslim Edildi': return 3;
      default: return 0;
    }
  };

  const statusIdx = getStatusIndex(status);

  const steps = [
    { label: 'Alındı', icon: CheckCircle, idx: 0 },
    { label: 'Hazırlanıyor', icon: Flame, idx: 1 },
    { label: 'Kurye Yolda', icon: Bike, idx: 2 },
    { label: 'Teslim Edildi', icon: PackageCheck, idx: 3 }
  ];

  return (
    <div className="w-full mt-4 mb-1">
      <div className="relative flex items-center justify-between px-1">
        
        {/* Track Line Background */}
        <div className="absolute top-[18px] left-[18px] right-[18px] h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          {/* Dynamic Glowing Live Progress Fill with Smooth CSS Transition */}
          <div 
            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            style={{ width: `${percent}%` }}
          />
        </div>

        {steps.map((step) => {
          const StepIcon = step.icon;
          const isCompleted = statusIdx > step.idx;
          const isActive = statusIdx === step.idx;

          return (
            <div key={step.idx} className="flex flex-col items-center relative z-10 select-none shrink-0" style={{ width: '22%' }}>
              
              {/* Node Circular Badge with Custom CSS transitions on backgrounds & borders */}
              <div 
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  isActive 
                    ? `bg-brand-600 border-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-950/40 scale-110 shadow-md`
                    : isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white scale-100 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-600'
                }`}
              >
                <StepIcon size={16} className={isActive ? 'animate-pulse' : ''} />
              </div>

              {/* Node Status Label with responsive bold transitions */}
              <span className={`text-[10px] font-bold mt-2 tracking-tight text-center truncate w-full transition-all duration-300 ${
                isActive 
                  ? 'text-brand-600 dark:text-brand-400 font-extrabold scale-105' 
                  : isCompleted 
                    ? 'text-emerald-600 dark:text-emerald-500 font-semibold' 
                    : 'text-gray-400 dark:text-zinc-550 font-medium'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dynamic textual progress indicator & percentage ticker */}
      <div className="mt-4 flex items-center justify-between text-[11px] font-bold tracking-wide uppercase px-3 py-2.5 bg-gray-50/50 dark:bg-zinc-900/40 border border-gray-100/60 dark:border-zinc-850 rounded-xl">
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
          <span className="relative flex h-2 w-2 shrink-0">
            {status !== 'Teslim Edildi' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            )}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          <span>
            {status === 'Alındı' && 'Siparişiniz Doğrulanıyor'}
            {status === 'Hazırlanıyor' && 'Yemeğiniz Özenle Pişiriliyor'}
            {status === 'Yolda' && 'Kuryemiz Adrese Yaklaşıyor'}
            {status === 'Teslim Edildi' && 'Sipariş Tamamlandı'}
          </span>
        </div>
        
        <div className="text-brand-600 dark:text-brand-400 font-mono font-black shrink-0">
          %{percent} Tamamlandı
        </div>
      </div>
    </div>
  );
};

export const OrderStatusTracker: React.FC = () => {
  const { activeOrder, cancelActiveOrder, completeActiveOrder, theme } = useMenu();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(25); // Minutes


  const getEstimatedMinutes = (status: string, createdAt: number) => {
    const elapsedSeconds = Math.floor((Date.now() - createdAt) / 1000);
    switch (status) {
      case 'Alındı': {
        const progress = Math.min(1, elapsedSeconds / 15);
        return Math.max(21, Math.round(25 - progress * 4));
      }
      case 'Hazırlanıyor': {
        const statusElapsed = elapsedSeconds - 15;
        const progress = Math.min(1, Math.max(0, statusElapsed / 30));
        return Math.max(13, Math.round(20 - progress * 7));
      }
      case 'Yolda': {
        const statusElapsed = elapsedSeconds - 45;
        const progress = Math.min(1, Math.max(0, statusElapsed / 45));
        return Math.max(2, Math.round(12 - progress * 10));
      }
      case 'Teslim Edildi':
        return 0;
      default:
        return 25;
    }
  };

  const getArrivalTimeString = () => {
    if (!activeOrder) return '';
    const targetTime = new Date(activeOrder.createdAt + 25 * 60 * 1000);
    return targetTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (!activeOrder) return;

    setTimeLeft(getEstimatedMinutes(activeOrder.status, activeOrder.createdAt));

    const interval = setInterval(() => {
      setTimeLeft(getEstimatedMinutes(activeOrder.status, activeOrder.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder?.status, activeOrder?.createdAt]);

  if (!activeOrder) return null;

  const getStatusIndex = () => {
    switch (activeOrder.status) {
      case 'Alındı': return 0;
      case 'Hazırlanıyor': return 1;
      case 'Yolda': return 2;
      case 'Teslim Edildi': return 3;
      default: return 0;
    }
  };

  const statusIndex = getStatusIndex();

  const STEPS = [
    {
      title: 'Sipariş Alındı',
      desc: 'Kavurmacı Kadıköy siparişinizi onayladı.',
      icon: CheckCircle,
      activeColor: 'text-green-500 bg-green-50 border-green-500',
      lineColor: 'border-green-500'
    },
    {
      title: 'Hazırlanıyor',
      desc: 'Sıcak pilav ve kavurmanız hazırlanıyor.',
      icon: Flame,
      activeColor: 'text-orange-500 bg-orange-50 border-orange-500',
      lineColor: 'border-orange-500'
    },
    {
      title: 'Kurye Yolda',
      desc: 'Siparişiniz hızlıca kapınıza geliyor.',
      icon: Bike,
      activeColor: 'text-blue-500 bg-blue-50 border-blue-500',
      lineColor: 'border-blue-500'
    },
    {
      title: 'Teslim Edildi',
      desc: 'Afiyet olsun! Lezzet kapınıza ulaştı.',
      icon: PackageCheck,
      activeColor: 'text-emerald-600 bg-emerald-50 border-emerald-600',
      lineColor: 'border-emerald-600'
    }
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-[45] animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
        
        {/* Header bar */}
        <div className="bg-gray-900 dark:bg-zinc-950 text-white px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              {activeOrder.status !== 'Teslim Edildi' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              )}
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-500"></span>
            </span>
            <div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium leading-none mb-0.5">YOLDAN SİPARİŞ TAKİBİ</p>
              <h3 className="text-sm font-bold tracking-tight">Sipariş No: #{activeOrder.id}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-gray-800 dark:hover:bg-zinc-900 rounded-lg text-gray-400 hover:text-white transition"
              title="Detayları Göster/Gizle"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
            {activeOrder.status === 'Teslim Edildi' && (
              <button 
                onClick={completeActiveOrder}
                className="p-1.5 hover:bg-red-900 bg-gray-800 dark:bg-zinc-900 rounded-lg text-gray-400 hover:text-white transition"
                title="Kapat"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic status progress indicator */}
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800/80 bg-brand-50/20 dark:bg-brand-950/10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">Mevcut Durum</p>
              <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-50">
                {activeOrder.status === 'Teslim Edildi' ? '✓ Teslim Edildi' : activeOrder.status}
              </h4>
            </div>
            {activeOrder.status !== 'Teslim Edildi' && (
              <div className="text-right">
                <p className="text-[10px] text-gray-450 dark:text-zinc-500 font-medium uppercase leading-none mb-1">Tahmini Karşılama</p>
                <div className="flex items-center gap-1 text-gray-900 dark:text-zinc-100 justify-end">
                  <Clock size={16} className="text-brand-600 dark:text-brand-400 animate-pulse" />
                  <span className="text-base font-extrabold">{timeLeft} dk</span>
                </div>
                <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold mt-1 tracking-tight">Varış: ~{getArrivalTimeString()}</p>
              </div>
            )}
          </div>

          {/* Visual Dynamic Progress Bar Component */}
          <OrderStatusProgressBar status={activeOrder.status} createdAt={activeOrder.createdAt} />
        </div>

        {/* Collapsible Steps list and details */}
        {isExpanded && (
          <div className="max-h-[460px] overflow-y-auto p-5 space-y-6">
            
            {/* Steps Timeline */}
            <div className="space-y-4">
              {STEPS.map((step, idx) => {
                const isStepCompleted = idx < statusIndex;
                const isStepActive = idx === statusIndex;
                const isStepPending = idx > statusIndex;
                
                const StepIcon = step.icon;

                return (
                  <div key={idx} className="flex gap-4 relative">
                    {/* Line connecting steps */}
                    {idx < STEPS.length - 1 && (
                      <div className={`absolute top-8 left-[18px] bottom-0 w-0.5 border-l-2 ${
                        idx < statusIndex ? 'border-brand-600' : 'border-gray-200 dark:border-zinc-800 border-dashed'
                      }`} style={{ height: 'calc(100% + 8px)' }} />
                    )}

                    {/* Step badge */}
                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 z-10 ${
                      isStepCompleted 
                        ? 'bg-brand-600 border-brand-600 text-white shadow-sm' 
                        : isStepActive 
                          ? step.activeColor + ' ring-4 ring-orange-100 dark:ring-orange-950/40'
                          : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-750 text-gray-400 dark:text-zinc-500'
                    }`}>
                      <StepIcon size={18} />
                    </div>

                    {/* Step details */}
                    <div className="pt-0.5">
                      <h5 className={`font-semibold text-sm ${
                        isStepActive ? 'text-gray-900 dark:text-zinc-50 font-bold text-base' : isStepCompleted ? 'text-gray-700 dark:text-zinc-300' : 'text-gray-400 dark:text-zinc-500'
                      }`}>
                        {step.title}
                      </h5>
                      <p className={`text-xs ${isStepActive ? 'text-gray-600 dark:text-zinc-400 font-medium' : 'text-gray-400 dark:text-zinc-500'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Route Map Component */}
            <DeliveryRouteMap 
              neighborhood={activeOrder.details.neighborhood} 
              status={activeOrder.status} 
              theme={theme} 
            />

            {/* Address & Payment Info */}
            <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-4 space-y-2 text-xs text-gray-600 dark:text-zinc-300">
              <div className="flex items-start gap-1.5">
                <MapPin size={14} className="text-gray-450 dark:text-zinc-500 shrink-0 mt-0.5" />
                <p><span className="font-semibold text-gray-800 dark:text-zinc-200">Adres:</span> {activeOrder.details.address}, {activeOrder.details.neighborhood} / Kadıköy</p>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard size={14} className="text-gray-450 dark:text-zinc-500 shrink-0" />
                <p><span className="font-semibold text-gray-800 dark:text-zinc-200">Ödeme:</span> Kapıda {activeOrder.details.paymentMethod}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-450 dark:text-zinc-500 shrink-0" />
                <p>
                  <span className="font-semibold text-gray-800 dark:text-zinc-200">Zamanlama:</span>{' '}
                  Sipariş Saati: {new Date(activeOrder.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  {activeOrder.status !== 'Teslim Edildi' ? (
                    <> • Tahmini Varış: <span className="font-bold text-brand-600 dark:text-brand-400">{getArrivalTimeString()} ({timeLeft} dk kaldı)</span></>
                  ) : (
                    <> • Teslim edildi</>
                  )}
                </p>
              </div>
              {activeOrder.details.note && (
                <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-850 rounded-xl p-2.5 mt-1">
                  <p className="font-semibold text-gray-700 dark:text-zinc-300 mb-0.5">Özel İstek / Sipariş Notu:</p>
                  <p className="text-gray-600 dark:text-zinc-400 leading-normal">{activeOrder.details.note}</p>
                </div>
              )}
            </div>

            {/* Ordered items breakdown - expandable section */}
            <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-4">
              <button
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 border border-gray-100 dark:border-zinc-850 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-lg">
                    <ShoppingBag size={15} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-gray-900 dark:text-zinc-50 tracking-tight">Sipariş İçeriği ({activeOrder.items.length} Porsiyon)</p>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">Detayları görmek için dokunun</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-black text-brand-600 dark:text-brand-400 font-mono bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-xl border border-brand-100 dark:border-brand-900/10">
                    {activeOrder.total} ₺
                  </span>
                  <div className={`text-gray-450 dark:text-zinc-500 transition-transform duration-300 ${isSummaryExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={16} />
                  </div>
                </div>
              </button>

              {/* Content containing list of elements */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSummaryExpanded ? 'max-h-[350px] opacity-100 mt-3.5 space-y-3' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-gray-750 dark:text-zinc-355 bg-gray-50/50 dark:bg-zinc-900/40 p-3 border border-gray-100 dark:border-zinc-850/60 rounded-xl">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-extrabold text-gray-901 dark:text-zinc-101">{item.name}</span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold tracking-tight">Porsiyon: {item.weight}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-gray-950 dark:text-zinc-52 bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 px-2.5 py-1 rounded-lg">
                          {item.quantity} x {item.price} ₺
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center font-black text-xs text-gray-900 dark:text-zinc-50 p-3 bg-brand-50/10 dark:bg-brand-950/5 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                  <span className="uppercase tracking-wider">Ödenecek Toplam Tutar</span>
                  <span className="text-base text-brand-600 dark:text-brand-400 font-mono font-black">{activeOrder.total} ₺</span>
                </div>
              </div>
            </div>

            {/* Cancel Action if Order is just Recieved */}
            {activeOrder.status === 'Alındı' && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (window.confirm("Siparişinizi iptal etmek istediğinize emin misiniz?")) {
                      cancelActiveOrder();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Siparişi İptal Et</span>
                </button>
              </div>
            )}

            {/* Complete action when delivered to clean up screen */}
            {activeOrder.status === 'Teslim Edildi' && (
              <div className="pt-2">
                <button
                  onClick={completeActiveOrder}
                  className="w-full py-2.5 bg-gray-900 dark:bg-zinc-850 hover:bg-gray-800 dark:hover:bg-zinc-750 text-white font-semibold text-xs rounded-xl transition"
                >
                  Takibi Sonlandır (Afiyet Olsun!)
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
