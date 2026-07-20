import React from 'react';
import { useMenu } from '../context/MenuContext';
import { Product, CartItem, ProductVariant } from '../types';
import { Plus, Flame } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import KAVURMA_HERO_IMG from '../src/assets/images/sade_kavurma_new_1784500788937.jpg';
import { LOGO_IMG } from '../constants';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[460px] md:h-[480px] w-full bg-gray-950 overflow-hidden flex items-center justify-center mb-8 py-12">
      <div className="absolute inset-0 opacity-50">
        <img 
          src={KAVURMA_HERO_IMG} 
          alt="Kavurmacı Fikirtepe Lezzetleri" 
          className="w-full h-full object-cover scale-105 filter blur-[1px]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
      
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
        {/* Gece Kavurmacısı Logo with professional background removal/blending */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all duration-500" />
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-white flex items-center justify-center p-1">
            <img 
              src={LOGO_IMG} 
              alt="Gece Kavurmacısı Logo" 
              className="w-full h-full rounded-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <span className="inline-block py-1 px-3 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 font-semibold text-sm mb-4 backdrop-blur-sm">
          Sadece Fikirtepe & Merdivenköy
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Gerçek <span className="text-brand-500">Kavurma</span> Lezzeti
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
          Tane tane tereyağlı pilav, lokum kıvamında enfes kavurma. <br/>Gece Kavurmacısı kalitesiyle kapınızda.
        </p>
        <button 
          onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-brand-700 transition-all duration-300 shadow-lg shadow-brand-500/30 hover:scale-105"
        >
          Sipariş Ver
        </button>
      </div>
    </div>
  );
};

export const ProductList: React.FC = () => {
  const { products, addToCart, searchQuery } = useMenu();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="menu" className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 border-l-4 border-brand-600 pl-4">Menümüz</h2>
        {searchQuery && (
          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
            <span className="text-brand-600 font-semibold">"{searchQuery}"</span> araması için {filteredProducts.length} lezzet bulundu
          </p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={(index % 3) * 100} className="h-full">
              <ProductCard product={product} onAdd={addToCart} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm max-w-md mx-auto">
          <div className="text-4xl mb-3">😋</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 mb-1">Aradığınız Lezzet Bulunamadı</h3>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">Farklı bir arama kelimesi girmeyi veya sepetinizi kontrol etmeyi deneyebilirsiniz!</p>
        </div>
      )}
    </div>
  );
};

const BEST_SELLERS = ['pilav-kavurma', 'ekmek-arasi-kavurma'];

const ProductCard: React.FC<{ product: Product; onAdd: (item: CartItem) => void }> = ({ product, onAdd }) => {
  // If product has no variants, create a dummy one or handle it gracefully. 
  // For this app, we assume all products have at least one variant.
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant>(product.variants[0] || { id: 'default', weight: 'Standart', price: 0 });

  // Update selected variant if product changes (e.g. after edit)
  React.useEffect(() => {
    setSelectedVariant(product.variants[0]);
  }, [product]);

  const handleAdd = () => {
    onAdd({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      weight: selectedVariant.weight,
      price: selectedVariant.price,
      quantity: 1,
      image: product.image
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-zinc-800 overflow-hidden group flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
             {BEST_SELLERS.includes(product.id) && (
                 <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] uppercase font-black px-2.5 py-1.5 rounded-xl shadow-md tracking-wider flex items-center gap-1">
                     🔥 En Popüler
                 </span>
             )}
             {product.category === 'menu' && (
                 <span className="bg-yellow-400 text-yellow-950 text-[10px] uppercase font-black px-2.5 py-1.5 rounded-xl shadow-md tracking-wider flex items-center gap-1">
                     🌟 FIRSAT / KAMPANYA
                 </span>
             )}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3 flex-1">
          <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-2">{product.name}</h3>
          <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-3">{product.description}</p>
          
          {selectedVariant && (selectedVariant.calories || selectedVariant.protein) && (
            <div className="py-2 px-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800/60 shadow-sm animate-fade-in">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Besin Değerleri</span>
              <div className="flex gap-2">
                {selectedVariant.calories && (
                  <span className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-lg border border-orange-100 dark:border-orange-900/40">
                    <Flame size={12} className="text-orange-500" />
                    {selectedVariant.calories} kcal
                  </span>
                )}
                {selectedVariant.protein && (
                  <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-emerald-500 text-[11px]">🥩</span>
                    {selectedVariant.protein}g Protein
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Porsiyon Seçimi</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedVariant?.id === variant.id
                      ? 'bg-brand-50 dark:bg-brand-950/20 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 ring-1 ring-brand-500'
                      : 'bg-white dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:border-brand-200 dark:hover:border-brand-800 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
                >
                  {variant.weight}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 dark:text-zinc-500">Fiyat</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-zinc-50">{selectedVariant?.price || 0} ₺</span>
            </div>
            
            <button 
              onClick={handleAdd}
              className="bg-gray-900 dark:bg-zinc-850 dark:hover:bg-brand-600 text-white p-3 rounded-xl hover:bg-brand-600 transition-colors active:scale-95 flex items-center gap-2 group/btn"
            >
              <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
              <span className="font-medium">Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};