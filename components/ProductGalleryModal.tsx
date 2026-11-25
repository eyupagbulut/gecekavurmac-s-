import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Flame, 
  Sparkles, 
  Check, 
  Maximize2, 
  Utensils, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { Product, ProductVariant, CartItem } from '../types';
import { useMenu } from '../context/MenuContext';

interface ProductGalleryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductGalleryModal: React.FC<ProductGalleryModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, addToast } = useMenu();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);

  // Initialize or reset when product changes
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedVariant(product.variants[0] || null);
      setQuantity(1);
      setIsFullScreenImage(false);
    }
  }, [product]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isFullScreenImage) {
          setIsFullScreenImage(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreenImage, onClose]);

  if (!isOpen || !product) return null;

  // Build gallery array (fallback to main product image if gallery is empty)
  const images = (product.gallery && product.gallery.length > 0) 
    ? product.gallery 
    : [product.image];

  const currentImage = images[activeImageIndex] || product.image;

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const cartItem: CartItem = {
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      weight: selectedVariant.weight,
      price: selectedVariant.price,
      quantity,
      image: currentImage
    };

    addToCart(cartItem);

    addToast({
      title: "Sepete Eklendi! 🥩",
      message: `${quantity}x ${product.name} (${selectedVariant.weight}) sepetinize eklendi.`,
      type: 'success',
      duration: 4000
    });

    onClose();
  };

  // Ingredients icon mapper helper
  const getIngredientIcon = (ing: string) => {
    const lower = ing.toLowerCase();
    if (lower.includes('dana') || lower.includes('et')) return '🥩';
    if (lower.includes('tereyağ') || lower.includes('yağ')) return '🧈';
    if (lower.includes('pirinç') || lower.includes('baldo') || lower.includes('pilav')) return '🌾';
    if (lower.includes('ekmek') || lower.includes('fırın')) return '🥖';
    if (lower.includes('tuz') || lower.includes('biber') || lower.includes('baharat')) return '🧂';
    if (lower.includes('ayran') || lower.includes('içecek') || lower.includes('meşrubat')) return '🥤';
    return '✨';
  };

  return (
    <>
      {/* Full screen image viewer if toggled */}
      {isFullScreenImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsFullScreenImage(false)}
        >
          <button 
            onClick={() => setIsFullScreenImage(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
            title="Kapat"
          >
            <X size={24} />
          </button>

          <img 
            src={currentImage} 
            alt={product.name} 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            referrerPolicy="no-referrer"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                title="Önceki Görsel"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                title="Sonraki Görsel"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Main Modal Overlay */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 flex flex-col lg:flex-row max-h-[92vh] sm:max-h-[88vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side: High Quality Gallery & Image Carousel */}
          <div className="lg:w-1/2 bg-zinc-950 relative flex flex-col justify-between overflow-hidden group">
            
            {/* Top Bar on Image */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <Sparkles size={12} className="text-amber-400" />
                {images.length} Yüksek Kalite Görsel
              </span>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setIsFullScreenImage(true)}
                  className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all shadow-lg hover:scale-110"
                  title="Tam Ekran İncele"
                >
                  <Maximize2 size={16} />
                </button>
                <button 
                  onClick={onClose}
                  className="lg:hidden p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
                  title="Kapat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Stage Image */}
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[260px] flex items-center justify-center bg-zinc-950 overflow-hidden">
              <img 
                src={currentImage} 
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-102"
                referrerPolicy="no-referrer"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-amber-600 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110"
                    title="Önceki"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-amber-600 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110"
                    title="Sonraki"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Counter Indicator */}
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails Gallery Bar */}
            {images.length > 1 && (
              <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/20' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} galeri ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details, Appetizing Story & Ingredients */}
          <div className="lg:w-1/2 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto space-y-6">
            
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800/60">
                  {product.category === 'pilav' && '🌾 Pilav Üstü Özel'}
                  {product.category === 'ekmek' && '🥖 Taş Fırın Ekmek'}
                  {product.category === 'porsiyon' && '🥩 Sade Porsiyon'}
                  {product.category === 'menu' && '🌟 Avantajlı Menü'}
                </span>

                <button 
                  onClick={onClose}
                  className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Kapat"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
                {product.name}
              </h2>

              <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Appetizing Story & Recipe Notes */}
            {product.ingredientStory && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 relative">
                <div className="flex items-start gap-2.5">
                  <Utensils size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1">
                      Ustanın Özel Dokunuşu & Hazırlanışı
                    </h4>
                    <p className="text-xs text-amber-950 dark:text-amber-200/90 leading-relaxed italic">
                      "{product.ingredientStory}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ingredients Gallery Section */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-400 flex items-center gap-1.5">
                  <Info size={14} className="text-brand-500" /> Malzeme & Özellikler
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.ingredients.map((ing, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800 text-xs text-gray-800 dark:text-zinc-200 flex items-center gap-2 font-medium"
                    >
                      <span className="text-base shrink-0">{getIngredientIcon(ing)}</span>
                      <span className="line-clamp-2 leading-tight">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portion & Variant Picker */}
            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                  Porsiyon Seçimi
                </label>

                {selectedVariant && (selectedVariant.calories || selectedVariant.protein) && (
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    {selectedVariant.calories && (
                      <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-200/60 dark:border-orange-900/40">
                        <Flame size={12} /> {selectedVariant.calories} kcal
                      </span>
                    )}
                    {selectedVariant.protein && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/40">
                        🥩 {selectedVariant.protein}g Protein
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
                      selectedVariant?.id === v.id
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/30 scale-102'
                        : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:border-brand-300'
                    }`}
                  >
                    {selectedVariant?.id === v.id && <Check size={14} />}
                    <span>{v.weight}</span>
                    <span className="opacity-80">({v.price} ₺)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Order Footer */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 p-1">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-2 text-gray-600 dark:text-zinc-300 hover:text-brand-600 transition-colors"
                  title="Azalt"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 text-sm font-extrabold text-gray-900 dark:text-zinc-100 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-2 text-gray-600 dark:text-zinc-300 hover:text-brand-600 transition-colors"
                  title="Artır"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-5 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-600/25 flex items-center justify-between transition-all transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  <span>Sepete Ekle</span>
                </div>
                <span className="text-base font-black bg-black/20 px-3 py-0.5 rounded-lg">
                  {((selectedVariant?.price || 0) * quantity)} ₺
                </span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
