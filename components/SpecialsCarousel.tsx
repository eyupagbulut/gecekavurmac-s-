import React, { useState, useEffect, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import { ChevronLeft, ChevronRight, Sparkles, Percent, ShoppingBag, Flame } from 'lucide-react';
import PILAV_KAVURMA_IMG from '../src/assets/images/pilav_kavurma_1781715948644.jpg';
import EKMEK_ARASI_IMG from '../src/assets/images/ekmek_arasi_kavurma_1781715918742.jpg';
import MENU_DRINK_IMG from '../src/assets/images/menu_drink_1781715963995.jpg';

interface SpecialItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  subtitle: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  badge: string;
  image: string;
  accentColor: string;
}

const SPECIALS: SpecialItem[] = [
  {
    id: 'special-p-200',
    productId: 'avantajli-menuler',
    variantId: 'menu-p-200',
    title: 'Şefin Özel Duble Menü',
    subtitle: 'Pilav Üstü 200 gr + İçecek',
    description: 'Tane tane bol tereyağlı pilav üzerinde 200 gram lokum lokum kavurma ve buz gibi serinletici içecek.',
    originalPrice: 850,
    discountedPrice: 765, // 10% Off
    badge: '%10 İNDİRİM',
    image: MENU_DRINK_IMG,
    accentColor: 'from-orange-600 to-amber-500'
  },
  {
    id: 'special-ek-150',
    productId: 'ekmek-arasi-kavurma',
    variantId: 'ek-150',
    title: 'Doyurucu Ekmek Arası',
    subtitle: 'Ekmek Arası 150 gr',
    description: 'Çıtır taş fırın ekmeğinin içine sığmayan 150 gram enfes dana kavurma lezzeti.',
    originalPrice: 550,
    discountedPrice: 495, // 10% Off
    badge: 'ÖĞLE ARASI ÖZEL',
    image: EKMEK_ARASI_IMG,
    accentColor: 'from-brand-600 to-red-500'
  },
  {
    id: 'special-pk-150',
    productId: 'pilav-kavurma',
    variantId: 'pk-150',
    title: 'İmza Pilav Üstü Kavurma',
    subtitle: 'Pilav Kavurma 150 gr',
    description: 'Bol tereyağlı pilavla buluşan 150 gram yumuşacık esnaf usulü kavurma.',
    originalPrice: 650,
    discountedPrice: 585, // 10% Off
    badge: 'GÜNÜN YILDIZI',
    image: PILAV_KAVURMA_IMG,
    accentColor: 'from-amber-600 to-yellow-500'
  }
];

export const SpecialsCarousel: React.FC = () => {
  const { addToCart } = useMenu();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SPECIALS.length);
    }, 5500);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SPECIALS.length);
    startAutoPlay();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SPECIALS.length) % SPECIALS.length);
    startAutoPlay();
  };

  const handleAddDiscountedSpecial = (special: SpecialItem) => {
    addToCart({
      productId: special.productId,
      variantId: special.variantId,
      name: `${special.title} (Özel Fırsat)`,
      weight: special.subtitle,
      price: special.discountedPrice,
      quantity: 1,
      image: special.image
    });

    setAddedId(special.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-red-50 dark:bg-red-950/20 text-red-500 p-1.5 rounded-lg">
            <Flame size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-zinc-100 leading-tight">Günün Sıcak Fırsatları</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Kavurmacı Kadıköy'den gün boyu geçerli kaçırılmayacak porsiyon indirimleri</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition"
            aria-label="Önceki kampanya"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition"
            aria-label="Sonraki kampanya"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div 
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-md md:shadow-lg transition-transform"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <div className="relative h-[480px] md:h-[280px]">
          {SPECIALS.map((special, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <div 
                key={special.id}
                className={`absolute inset-0 w-full h-full flex flex-col md:flex-row transition-all duration-700 ease-in-out transform ${
                  isSelected ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-12 pointer-events-none'
                }`}
              >
                {/* Image Section */}
                <div className="relative w-full md:w-5/12 h-44 md:h-full overflow-hidden">
                  <img 
                    src={special.image} 
                    alt={special.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 md:from-black/10 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Percent size={12} />
                    <span>{special.badge}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 md:p-7 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-brand-600 leading-none block uppercase">GÜNÜN FIRSATI</span>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-zinc-100 leading-snug">{special.title}</h3>
                      <p className="text-sm font-medium text-gray-600 dark:text-zinc-350">{special.subtitle}</p>
                    </div>
                    <p className="text-gray-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed max-w-xl">{special.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 line-through leading-none">{special.originalPrice} ₺</span>
                        <span className="text-3xl font-extrabold text-brand-600 leading-tight">
                          {special.discountedPrice} <span className="text-lg">₺</span>
                        </span>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[11px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1">
                        <Sparkles size={12} />
                        <span>Sadece Bugüne Özel</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddDiscountedSpecial(special)}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                        addedId === special.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-900 dark:bg-zinc-800 text-white hover:bg-brand-600 dark:hover:bg-brand-600 hover:shadow-md'
                      }`}
                    >
                      {addedId === special.id ? (
                        <>✓ Sepete Eklendi!</>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Fırsatı Sepete Ekle</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="absolute bottom-4 right-5 z-10 flex gap-1.5">
          {SPECIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                startAutoPlay();
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-brand-600' : 'w-2 bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
