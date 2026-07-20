import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, X, Award, CheckCircle, Sparkles, Clock, ChevronRight } from 'lucide-react';
import { MealRating } from '../types';

export const MealFeedbackModal: React.FC = () => {
  const { 
    pastOrders, 
    submittedRatings, 
    dismissedRatingOrderIds, 
    submitMealRating, 
    dismissRating,
    loyaltyProfile
  } = useMenu();

  // Find completed but unrated & undismissed orders
  const pendingOrders = pastOrders.filter(
    order => order.status === 'Teslim Edildi' &&
    !submittedRatings.some(r => r.orderId === order.id) &&
    !dismissedRatingOrderIds.includes(order.id)
  );

  const activeFeedbackOrder = pendingOrders[0];

  // Timing rule: 15 minutes after delivery
  const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
  
  const [now, setNow] = useState<number>(Date.now());
  const [forceTrigger, setForceTrigger] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [itemsFeedback, setItemsFeedback] = useState<{ [key: string]: { name: string; liked: boolean } }>({});
  const [isSuccessState, setIsSuccessState] = useState(false);

  // Keep internal timer ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset form when active order changes
  useEffect(() => {
    if (activeFeedbackOrder) {
      setRating(5);
      setFeedbackText('');
      setSelectedHighlights([]);
      setIsSuccessState(false);
      
      // Initialize item satisfaction states to Liked (Thumbs Up) by default
      const initialItems: typeof itemsFeedback = {};
      activeFeedbackOrder.items.forEach(item => {
        const itemKey = `${item.productId}-${item.variantId}`;
        initialItems[itemKey] = {
          name: item.name,
          liked: true
        };
      });
      setItemsFeedback(initialItems);
    }
  }, [activeFeedbackOrder?.id]);

  if (!activeFeedbackOrder) return null;

  const msSinceDelivery = now - activeFeedbackOrder.completedAt;
  const msRemaining = FIFTEEN_MINUTES_MS - msSinceDelivery;
  const isTimerExpired = msRemaining <= 0;
  const isModalOpen = isTimerExpired || forceTrigger;

  const getMinutesRemaining = () => {
    if (msRemaining <= 0) return 0;
    return Math.ceil(msRemaining / 1000 / 60);
  };

  const getSecondsRemaining = () => {
    if (msRemaining <= 0) return 0;
    return Math.ceil((msRemaining / 1000) % 60);
  };

  const formattedCountdown = `${getMinutesRemaining()}:${getSecondsRemaining().toString().padStart(2, '0')}`;

  const toggleHighlight = (highlight: string) => {
    setSelectedHighlights(prev => 
      prev.includes(highlight) ? prev.filter(h => h !== highlight) : [...prev, highlight]
    );
  };

  const toggleItemSatisfaction = (itemKey: string) => {
    setItemsFeedback(prev => {
      const current = prev[itemKey];
      if (!current) return prev;
      return {
        ...prev,
        [itemKey]: {
          ...current,
          liked: !current.liked
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mealRatingObj: MealRating = {
      orderId: activeFeedbackOrder.id,
      rating,
      feedbackText,
      highlights: selectedHighlights,
      itemsFeedback,
      createdAt: Date.now()
    };

    submitMealRating(mealRatingObj);
    setIsSuccessState(true);
    
    // Auto close success screen after 3 seconds
    setTimeout(() => {
      setForceTrigger(false);
      setIsSuccessState(false);
    }, 3000);
  };

  const handleDismiss = () => {
    dismissRating(activeFeedbackOrder.id);
    setForceTrigger(false);
  };

  const getStarLabel = (stars: number) => {
    switch (stars) {
      case 1: return 'Çok Kötü 😞';
      case 2: return 'Beğenmedim 😐';
      case 3: return 'Ortalama 🙂';
      case 4: return 'Çok Lezzetli! 😍';
      case 5: return 'Kusursuz Lezzet! 🥩🔥';
      default: return '';
    }
  };

  const HIGHLIGHTS_POOL = [
    '🥩 Kusursuz Kavurma',
    '🍚 Şahane Tereyağlı Pilav',
    '🔥 Sıpsıcak Geldi',
    '🚀 Çok Hızlı Servis',
    '📦 Temiz Paketleme',
    '💖 Güler Yüzlü Kurye',
  ];

  // Render tiny corner notification banner if modal is not open yet because 15-minute wait is in progress
  if (!isModalOpen) {
    if (!showNotification) return null;

    return (
      <div id="feedback-pre-toast" className="fixed bottom-24 right-4 max-w-sm w-[350px] bg-white rounded-2xl border border-orange-100 shadow-xl p-4 z-[45] animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex gap-3">
          <div className="p-2.5 bg-orange-50 rounded-xl text-brand-600 self-start shrink-0">
            <Clock size={20} className="animate-spin-slow" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-600 block">Sıcak Lezzet Karnesi</span>
              <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
            <p className="text-xs font-bold text-gray-900 mt-1">Siparişiniz Teslim Edildi!</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Yemeğinizi dinlendikten sonra değerlendirebilirsiniz: <span className="font-mono font-bold text-brand-600">{formattedCountdown} dk</span> içinde form açılacak.
            </p>
            
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => setForceTrigger(true)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-brand-600 text-white rounded-lg py-1.5 px-2.5 text-[11px] font-bold shadow-md hover:from-orange-600 hover:to-brand-700 transition flex items-center justify-center gap-1"
              >
                <span>⚡ Şimdi Değerlendir (Simüle Et)</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        id="meal-feedback-modal-sheet" 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-orange-100/50 animate-in fade-in zoom-in-95 duration-300"
      >
        {isSuccessState ? (
          /* SUCCESS VIEW */
          <div className="p-8 text-center space-y-5 py-16 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-200 shadow-sm">
              <CheckCircle className="text-green-600 stroke-[2.5]" size={42} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Değerlendirmeniz Alındı!</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Kavurmacı Fikirtepe lezzet standartlarını geliştirmemize yardımcı olduğunuz için yürekten teşekkür ederiz.
              </p>
            </div>

            {loyaltyProfile ? (
              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 max-w-sm flex items-center justify-between gap-4 shadow-sm animate-bounce">
                <div className="flex items-center gap-2.5 text-left">
                  <span className="p-2 bg-white rounded-xl shadow-inner text-brand-600">
                    <Award size={20} className="fill-brand-500/10" />
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-orange-900 uppercase">Lezzet Ödülü Yüklendi!</h4>
                    <p className="text-[11px] text-orange-950 font-medium">Hesabınıza +15 Sadakat Puanı eklendi.</p>
                  </div>
                </div>
                <span className="text-xs font-black text-white bg-brand-600 px-2 py-1 rounded-lg">
                  +15 Puan
                </span>
              </div>
            ) : (
              <p className="text-xs text-orange-600 font-semibold bg-orange-50 px-3 py-1.5 rounded-full">
                💡 Sadakat Kulübüne üye olsaydınız bu değerlendirme ile 15 Puan kazanacaktınız!
              </p>
            )}
          </div>
        ) : (
          /* FEEDBACK FORM VIEW */
          <>
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex justify-between items-center relative shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl border border-white/5">
                  <Sparkles size={20} className="text-brand-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight">Kavurmacı Lezzet Karnesi</h2>
                  <p className="text-[10px] text-gray-400">Sipariş No: #{activeFeedbackOrder.id} • Sıcak Teslimat Ölçümü</p>
                </div>
              </div>
              <button 
                onClick={handleDismiss}
                className="p-1.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition"
                title="Daha Sonra Değerlendir"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              
              {/* Alert Warning for Simulated trigger */}
              {forceTrigger && !isTimerExpired && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex gap-2 text-xs leading-relaxed items-center">
                  <span className="text-lg">⚡</span>
                  <div>
                    <span className="font-extrabold">Simülasyon Modu Aktif</span>
                    <p className="text-amber-700 text-[11px]">Geri bildirim vermeniz için gereken 15 dakikalık bekleme süresini test amacıyla atladınız.</p>
                  </div>
                </div>
              )}

              {/* Step 1: Overall Star Rating */}
              <div className="space-y-2 text-center bg-[#fcf8f5] p-5 rounded-2xl border border-orange-100/30">
                <label className="text-xs font-bold text-orange-900 uppercase tracking-widest block">Yemeklerinizi Beğendiniz mi?</label>
                
                <div className="flex justify-center items-center gap-2 py-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => setRating(star)}
                      className="text-amber-400 hover:scale-125 active:scale-95 transition-all duration-150 p-1"
                    >
                      <Star 
                        size={36} 
                        className={`transition-colors duration-150 ${
                          star <= (hoveredRating ?? rating)
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                            : 'text-gray-200 fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="h-5 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800 transition duration-150">
                    {getStarLabel(hoveredRating ?? rating)}
                  </span>
                </div>
              </div>

              {/* Step 2: Highlights selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Neleri En Çok Beğendiniz?</label>
                <div className="flex flex-wrap gap-2">
                  {HIGHLIGHTS_POOL.map((highlight) => {
                    const isSelected = selectedHighlights.includes(highlight);
                    return (
                      <button
                        key={highlight}
                        type="button"
                        onClick={() => toggleHighlight(highlight)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {highlight}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Item satisfaction ratings */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Hangi Lezzetleri Puanlıyorsunuz?</label>
                <div className="space-y-2 divide-y divide-gray-50 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  {activeFeedbackOrder.items.map((item) => {
                    const itemKey = `${item.productId}-${item.variantId}`;
                    const satisfaction = itemsFeedback[itemKey] || { name: item.name, liked: true };
                    
                    return (
                      <div key={itemKey} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-extrabold text-gray-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{item.weight}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setItemsFeedback(prev => ({
                                ...prev,
                                [itemKey]: { ...satisfaction, liked: true }
                              }));
                            }}
                            className={`p-1.5 rounded-lg border transition ${
                              satisfaction.liked 
                                ? 'bg-green-100 text-green-700 border-green-200 font-bold scale-105' 
                                : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-100'
                            }`}
                            title="Lezzetli"
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setItemsFeedback(prev => ({
                                ...prev,
                                [itemKey]: { ...satisfaction, liked: false }
                              }));
                            }}
                            className={`p-1.5 rounded-lg border transition ${
                              !satisfaction.liked 
                                ? 'bg-red-100 text-red-700 border-red-200 font-bold scale-105' 
                                : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-100'
                            }`}
                            title="Geliştirilmeli"
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Text Feedback */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  <span>Mutfak Ekibine Notunuz (İsteğe Bağlı)</span>
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Sıcaklığı nasıldı? Pilavın tereyağı kıvamı nasıldı? Müşteri memnuniyeti açısından her türlü düşünceniz bizim için altın değerindedir..."
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none resize-none transition"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full sm:w-auto px-4 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-xl transition cursor-pointer text-center"
                >
                  Daha Sonra Değerlendir
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-900 text-white hover:bg-brand-600 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                >
                  <Award size={15} className="text-brand-400" />
                  <span>Karnemi Gönder & {loyaltyProfile ? 'Puanımı Al' : 'Teşekkürler'}</span>
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
};
