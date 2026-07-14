import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { PastOrder } from '../types';
import { 
  X, 
  Clock, 
  Calendar, 
  ShoppingBag, 
  RefreshCw, 
  Receipt, 
  MapPin, 
  CreditCard, 
  ChevronDown, 
  ChevronUp,
  Inbox,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose, onOpenCart }) => {
  const { pastOrders, loyaltyProfile, addToCart, clearPastOrders } = useMenu();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const handleReorder = (order: PastOrder) => {
    // Add all historical items to card
    order.items.forEach(item => {
      addToCart(item);
    });

    alert("Siparişinizdeki lezzetler sepetinize eklendi! Hızla sepetinize yönlendiriliyorsunuz.");
    
    if (onOpenCart) {
      onOpenCart();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        id="order-history-modal"
      >
        
        {/* Header */}
        <div className="p-6 bg-gray-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Receipt size={22} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Sipariş Geçmişim</h2>
              <p className="text-xs text-gray-400">Geriye dönük tüm lezzet siparişleriniz</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* If user not logged in (has no loyalty profile) */}
          {!loyaltyProfile ? (
            <div className="text-center py-12 px-4 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
                <Receipt size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Sipariş Geçmişini Görüntüle</h3>
                <p className="text-sm text-gray-500">
                  Sipariş geçmişinize ve özel kuponlarınıza erişmek için ücretsiz olarak bir Lezzet Kartı oluşturun veya giriş yapın.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    const el = document.getElementById('loyalty-hub');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
                className="px-6 py-2.5 bg-gray-950 text-white rounded-xl text-sm font-bold hover:bg-brand-600 transition shadow-md"
              >
                Hemen Üye Ol (Ücretsiz)
              </button>
            </div>
          ) : pastOrders.length === 0 ? (
            /* If no past orders */
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Henüz Sipariş Yok</h3>
              <p className="text-gray-400 text-xs max-w-xs mx-auto mb-5">
                Sıcak kavurma veya pilav siparişiniz tamamlandığında, geçmiş verileriniz burada listelenecektir.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-xs transition"
              >
                Şimdi Menüyü İncele 😋
              </button>
            </div>
          ) : (
            /* Render list of past orders */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">TOPLAM {pastOrders.length} SİPARİŞ</span>
                <button
                  onClick={() => {
                    if (window.confirm("Tüm sipariş geçmişinizi kalıcı olarak temizlemek istediğinize emin misiniz?")) {
                      clearPastOrders();
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold"
                >
                  Geçmişi Temizle
                </button>
              </div>

              <div className="space-y-3">
                {pastOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });
                  const formattedTime = new Date(order.createdAt).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={order.id} 
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        isExpanded ? 'border-gray-200 shadow-md bg-gray-50/20' : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      {/* Accordion Trigger Header */}
                      <div 
                        onClick={() => toggleOrderExpand(order.id)}
                        className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            order.status === 'Teslim Edildi' 
                              ? 'bg-green-50 text-green-600' 
                              : 'bg-red-50 text-red-500'
                          }`}>
                            {order.status === 'Teslim Edildi' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-900">Sipariş: #{order.id}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                order.status === 'Teslim Edildi' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                              <span className="flex items-center gap-0.5"><Calendar size={12} /> {formattedDate}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5"><Clock size={12} /> {formattedTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorder(order);
                            }}
                            className="bg-brand-600 hover:bg-brand-700 text-white hover:scale-105 active:scale-95 duration-150 py-1.5 px-3 border border-transparent rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm shrink-0"
                            title="Siparişi Tekrarla"
                          >
                            <RefreshCw size={12} className="shrink-0" />
                            <span className="hidden xs:inline">Tekrarla</span>
                          </button>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 uppercase font-medium block leading-none">Toplam Tutar</span>
                            <span className="font-extrabold text-sm text-gray-900">{order.total} ₺</span>
                          </div>
                          <div className="text-gray-400">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Details Container */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-white p-4 space-y-4 animate-in slide-in-from-top-1 duration-150">
                          
                          {/* Items Breakdown */}
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Sipariş Detayı</p>
                            <div className="divide-y divide-gray-50 bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 text-xs">
                                  <div>
                                    <span className="font-bold text-gray-800">{item.name}</span>
                                    <span className="text-gray-400 text-[10px] ml-1.5 font-semibold">({item.weight})</span>
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {item.quantity} x {item.price} ₺
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Address & Delivery Info */}
                          <div className="grid md:grid-cols-2 gap-3 text-xs text-gray-600 bg-gray-50/30 rounded-xl p-3 border border-gray-100">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none block">Teslimat Bilgileri</span>
                              <p className="flex items-start gap-1">
                                <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                                <span>{order.details.address}, {order.details.neighborhood} / Kadıköy</span>
                              </p>
                              {order.details.note && (
                                <p className="text-gray-500 italic mt-1 bg-white p-1.5 rounded border border-gray-100">
                                  Not: "{order.details.note}"
                                </p>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none block">Ödeme ve İşlem</span>
                              <p className="flex items-center gap-1">
                                <CreditCard size={13} className="text-gray-400 shrink-0" />
                                <span>Kapıda {order.details.paymentMethod}</span>
                              </p>
                              {order.completedAt && (
                                <p className="text-[10px] text-gray-400">
                                  Tamamlanma: {new Date(order.completedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="flex gap-2.5">
                            <button
                              onClick={() => handleReorder(order)}
                              className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                            >
                              <RefreshCw size={14} />
                              <span>Siparişi Tekrarla (Sepete Ekle)</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer info banner */}
        {loyaltyProfile && (
          <div className="py-3 px-6 bg-brand-50/30 border-t border-gray-100 flex justify-between items-center text-xs shrink-0">
            <span className="text-orange-950 font-medium">✨ Kavurmacı Lezzet Kulübü Üyesi</span>
            <span className="text-orange-900 font-bold">Toplam Kazanılan: {loyaltyProfile.totalEarned} Pts</span>
          </div>
        )}
      </div>
    </div>
  );
};
