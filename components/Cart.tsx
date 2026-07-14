import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, CheckCircle, MapPin, CreditCard, Banknote, Mail, ArrowRight, Clock, Heart, Sparkles, Check } from 'lucide-react';
import { CartItem, OrderDetails, PaymentMethod } from '../types';
import { SERVICE_AREAS, PAYMENT_METHODS } from '../constants';
import { useMenu } from '../context/MenuContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, recordSale, placeOrder, loyaltyProfile } = useMenu();
  const [showCheckout, setShowCheckout] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (showCheckout) {
    return (
      <CheckoutModal 
        items={cartItems} 
        total={total} 
        initialNote={specialInstructions}
        onClose={() => setShowCheckout(false)} 
        onSuccess={(finalDetails) => {
          recordSale(total, cartItems); // Update admin stats
          placeOrder(finalDetails, total, cartItems);
          clearCart();
          setSpecialInstructions('');
          setShowCheckout(false);
          onClose();
        }}
      />
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-brand-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brand-600" />
            <h2 className="text-lg font-bold text-gray-800">Sepetim</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 hover:bg-gray-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4 opacity-70">
              <ShoppingBag size={64} className="text-gray-300" />
              <p>Sepetiniz henüz boş.</p>
              <button onClick={onClose} className="text-brand-600 font-medium hover:underline">Menüye Dön</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                 <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                 <div className="flex-1 flex flex-col justify-between">
                   <div>
                     <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                     <p className="text-xs text-gray-500 font-medium">{item.weight}</p>
                   </div>
                   <div className="flex justify-between items-end">
                     <span className="font-bold text-brand-600">{item.price} ₺</span>
                     
                     <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                       <button 
                        onClick={() => updateCartQuantity(item.productId, item.variantId, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand-600"
                       >
                         <Minus size={14} />
                       </button>
                       <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                       <button 
                        onClick={() => updateCartQuantity(item.productId, item.variantId, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand-600"
                       >
                         <Plus size={14} />
                       </button>
                     </div>
                   </div>
                 </div>
                 <button onClick={() => removeFromCart(item.productId, item.variantId)} className="text-gray-300 hover:text-red-500 self-start">
                   <Trash2 size={18} />
                 </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="special-instructions" className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                Özel İstekler / Sipariş Notu
              </label>
              <textarea
                id="special-instructions"
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Örn: Soğansız olsun, acısı bol olsun, temassız teslimat..."
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none transition"
              />
            </div>

            {/* Loyalty points prompt */}
            <div className="bg-orange-50/80 border border-orange-100 rounded-xl p-3 text-xs text-orange-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">⭐</span>
                <div>
                  {loyaltyProfile ? (
                    <>
                      <p className="font-bold text-orange-900 leading-none mb-0.5">Lezzet Puanlarından Kazan!</p>
                      <p className="text-[10px] text-orange-700 leading-tight">Bu siparişle hesabınıza <span className="font-bold">{Math.round(total * 0.1)} Puan</span> eklenecektir.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-orange-900 leading-none mb-0.5">Lezzet Puanı Fırsatı</p>
                      <p className="text-[10px] text-orange-700 leading-tight">Lezzet kartı alın, bu siparişten <span className="font-bold">{Math.round(total * 0.1)} Puan</span> kazanın!</p>
                    </>
                  )}
                </div>
              </div>
              {!loyaltyProfile && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      const el = document.getElementById('loyalty-hub');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                  className="bg-brand-600 hover:bg-brand-700 duration-150 text-white font-bold px-2 py-1 rounded text-[10px] shrink-0"
                >
                  Üye Ol
                </button>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
              <span className="text-gray-600 font-medium">Toplam Tutar</span>
              <span className="text-2xl font-bold text-gray-900">{total} ₺</span>
            </div>
            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 active:scale-[0.98] transition shadow-lg shadow-brand-500/30"
            >
              Sepeti Onayla
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const CheckoutModal: React.FC<{ 
  items: CartItem[]; 
  total: number; 
  initialNote?: string;
  onClose: () => void;
  onSuccess: (details: OrderDetails) => void;
}> = ({ items, total, initialNote = '', onClose, onSuccess }) => {
  const { loyaltyProfile } = useMenu();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [orderNum] = useState(() => `KVR-${Math.floor(1000 + Math.random() * 9000)}`);
  
  const [details, setDetails] = useState<OrderDetails>(() => ({
    fullName: loyaltyProfile?.fullName || '',
    phone: loyaltyProfile?.phone || '',
    email: loyaltyProfile?.email || 'birdencafe@gmail.com', // fallback
    address: '',
    neighborhood: 'Fikirtepe',
    note: initialNote,
    paymentMethod: 'Nakit'
  }));

  const [locState, setLocState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [locErrorMsg, setLocErrorMsg] = useState('');

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocState('error');
      setLocErrorMsg('Tarayıcınız konum özelliğini desteklemiyor.');
      return;
    }

    setLocState('loading');
    setLocErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Check local Fikirtepe/Dumlupınar range or set approximate values
        // Let's parse locations
        let derivedNeighborhood: 'Fikirtepe' | 'Dumlupınar' | 'Diğer' = 'Fikirtepe';
        
        // Simulating matching Kadıköy Fikirtepe/Dumlupınar based on coordinate distance
        const isDumlupinar = Math.abs(latitude - 40.9930) < 0.005 && Math.abs(longitude - 29.0580) < 0.005;
        if (isDumlupinar) {
          derivedNeighborhood = 'Dumlupınar';
        }

        setDetails(prev => ({
          ...prev,
          neighborhood: derivedNeighborhood,
          address: `Mevcut Konumum (Enlem: ${latitude.toFixed(4)}, Boylam: ${longitude.toFixed(4)})`
        }));
        setLocState('success');
      },
      (error) => {
        setLocState('error');
        if (error.code === 1) { // PERMISSION_DENIED
          setLocErrorMsg('Konum izni reddedildi. İzni düzeltmek için adres barında yer alan kilit simgesine tıklayın, konum iznine "İzin ver" (Allow) deyin ve sayfayı yenileyip tekrar deneyin.');
        } else {
          setLocErrorMsg(`Konum alınırken bir hata oluştu: ${error.message}`);
        }
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.neighborhood === 'Diğer') {
      alert("Üzgünüz, sadece Fikirtepe ve Dumlupınar mahallelerine hizmet veriyoruz.");
      return;
    }
    // Simulate API call and email delivery
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
          
          {/* Header */}
          <div className="p-6 bg-green-600 text-white flex items-center gap-4 shrink-0">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <CheckCircle size={28} className="text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Siparişiniz Alındı!</h2>
              <p className="text-xs text-white/80">Tamamlanan Sipariş No: {orderNum}</p>
            </div>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Detaylı sipariş bildirimi ve dijital faturanız, mock e-posta servisimiz tarafından alıcı adresine başarıyla iletildi:
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-gray-700">{details.email}</span>
              </div>
            </div>

            {/* Simulated Email Accordion */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <button 
                type="button"
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition duration-150"
              >
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-700">Canlı E-posta Makbuzunu Önizle</span>
                </div>
                <span className="text-[11px] font-bold text-brand-600 bg-white border px-2 py-0.5 rounded-full shadow-sm hover:bg-brand-50">
                  {showEmailPreview ? "Gizle ▲" : "Göster ▼"}
                </span>
              </button>

              {showEmailPreview && (
                <div className="bg-gray-100 p-3 sm:p-4 animate-in slide-in-from-top-1">
                  
                  {/* Simulated Email Browser Shell */}
                  <div className="bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden text-left max-w-lg mx-auto">
                    {/* Simulated Email Header metadata */}
                    <div className="bg-gray-900 text-white p-3 border-b text-[11px] font-mono space-y-1">
                      <div><span className="text-gray-400">Kimden:</span> Kavurmacı Kadıköy &lt;siparis@kavurmacikadikoy.com&gt;</div>
                      <div><span className="text-gray-400">Kime:</span> {details.fullName} &lt;{details.email}&gt;</div>
                      <div><span className="text-gray-400">Konu:</span> 🥩 Siparişiniz Alındı! Sıcak Kavurma Yola Çıkmaya Hazırlanıyor ({orderNum})</div>
                    </div>

                    {/* Email Content Body */}
                    <div className="bg-[#fcf8f5] p-6 text-gray-800 text-sm space-y-6">
                      
                      {/* Brand Logo & Intro */}
                      <div className="text-center space-y-1">
                        <span className="text-3xl">🥩</span>
                        <h1 className="text-lg font-bold text-gray-900 select-none">Kavurmacı Kadıköy</h1>
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">Lezzet Onay Bildirimi</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-orange-100/50 space-y-2">
                        <p className="font-bold text-gray-900 text-sm">Merhaba {details.fullName},</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Sıcak ve taze kavurma siparişiniz başarıyla sistemimize ulaştı. Mutfağımızda özenle hazırlanıyor, en kısa sürede sıcaklığını kaybetmeden yola çıkacak!
                        </p>
                      </div>

                      {/* Items Table */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Metrik Gelişim & Sipariş Özeti</h3>
                        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white text-xs divide-y divide-gray-50">
                          {items.map((item, index) => (
                            <div key={index} className="p-3 flex justify-between items-center bg-white">
                              <div>
                                <span className="font-bold text-gray-800">{item.name}</span>
                                <span className="text-[10px] text-gray-400 ml-1.5 font-semibold">({item.weight})</span>
                                <span className="block text-[10px] text-gray-400 mt-0.5">Miktar: {item.quantity} Adet</span>
                              </div>
                              <span className="font-bold text-gray-900 shrink-0">{item.price * item.quantity} ₺</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary calculations */}
                      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-500">
                          <span>Ara Toplam</span>
                          <span>{total} ₺</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Teslimat Ücreti</span>
                          <span className="text-green-600 font-semibold">ÜCRETSİZ 🚚</span>
                        </div>
                        <hr className="border-gray-100 my-1" />
                        <div className="flex justify-between text-sm font-extrabold text-orange-900">
                          <span>Ödenecek Toplam</span>
                          <span>{total} ₺</span>
                        </div>
                      </div>

                      {/* Delivery and payment information */}
                      <div className="grid grid-cols-2 gap-3 text-[11px] leading-relaxed">
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <span className="font-bold text-gray-700 block mb-1">📍 Teslimat Adresi:</span>
                          <p className="text-gray-500">{details.address}, {details.neighborhood} / Kadıköy</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <span className="font-bold text-gray-700 block mb-1">💳 Ödeme Tipi:</span>
                          <p className="text-gray-500">Kapıda {details.paymentMethod}</p>
                          <p className="text-[10px] text-orange-600 font-semibold mt-1">Sipariş No: {orderNum}</p>
                        </div>
                      </div>

                      {/* Footer notice in email */}
                      <div className="text-center pt-2 space-y-1 border-t border-dashed border-gray-200">
                        <p className="text-[10px] text-gray-400">
                          Herhangi bir sorunuz için bize 0216 555 00 00 numaralı hattan ulaşabilirsiniz.
                        </p>
                        <p className="text-[9px] text-gray-400">
                          Bu bir simülasyon sistemidir. Gerçek bir servis bağlantısı kurulmamıştır.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex items-center gap-3">
              <Sparkles size={20} className="text-brand-500 shrink-0" />
              <div className="text-xs">
                {loyaltyProfile ? (
                  <p className="text-orange-950">
                    Sıcak Lezzet Kartı hesabınıza <span className="font-bold text-brand-700">+{Math.round(total * 0.1)} Puan</span> eklendi! Mevcut bakiyenizi Lezzet Kulübü panelinden takip edebilirsiniz.
                  </p>
                ) : (
                  <p className="text-orange-950">
                    Lezzet Kartınız olsaydı bu siparişten <span className="font-bold text-brand-700">{Math.round(total * 0.1)} Puan</span> kazanacaktınız. Hemen üye olup bir sonraki siparişi bedavaya getirebilirsiniz!
                  </p>
                )}
              </div>
            </div>

          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
            <button 
              onClick={() => onSuccess(details)} 
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition duration-150 flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95"
            >
              <span>Ana Sayfaya Dön</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
           <h2 className="text-xl font-bold text-gray-800">Siparişi Tamamla</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="bg-orange-50 p-4 rounded-xl flex items-start gap-3 text-orange-800 text-sm mb-4">
            <MapPin className="shrink-0 mt-0.5" size={18} />
            <p>Sadece Fikirtepe ve Dumlupınar mahallelerine teslimatımız vardır.</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
            <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
              value={details.fullName} onChange={e => setDetails({...details, fullName: e.target.value})} placeholder="Örn: Ali Yılmaz" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Telefon</label>
              <input required type="tel" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} placeholder="5XX XXX XX XX" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">E-posta Adresi</label>
              <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                value={details.email} onChange={e => setDetails({...details, email: e.target.value})} placeholder="örn: aliyilmaz@gmail.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Mahalle</label>
            <select required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={details.neighborhood} 
              onChange={e => setDetails({...details, neighborhood: e.target.value as any})}>
              {SERVICE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Açık Adres</label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="text-xs font-bold text-brand-650 hover:text-brand-700 flex items-center gap-1 bg-brand-50 hover:bg-brand-100/80 px-2.5 py-1 rounded-lg transition"
              >
                <MapPin size={12} className={locState === 'loading' ? 'animate-bounce' : ''} />
                {locState === 'loading' ? 'Konum Alınıyor...' : 'Konumumu Bul'}
              </button>
            </div>
            <textarea required rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
              value={details.address} onChange={e => setDetails({...details, address: e.target.value})} placeholder="Sokak, Bina No, Daire..." />
            
            {locState === 'error' && (
              <div className="text-[11px] text-red-600 mt-1.5 bg-red-50 border border-red-100 p-2.5 rounded-lg font-medium leading-relaxed">
                ⚠️ <span className="font-bold">Konum Sorunu:</span> {locErrorMsg}
              </div>
            )}
            
            {locState === 'success' && (
              <div className="text-[11px] text-emerald-700 mt-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1">
                ✓ Yaklaşık konum dolduruldu!
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Ödeme Yöntemi (Kapıda)</label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setDetails({ ...details, paymentMethod: method as PaymentMethod })}
                  className={`p-3 rounded-lg border text-sm flex items-center justify-center text-center transition-all ${
                    details.paymentMethod === method 
                      ? 'bg-brand-50 border-brand-500 text-brand-700 font-medium ring-1 ring-brand-500' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

           <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Sipariş Notu</label>
            <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
              value={details.note} onChange={e => setDetails({...details, note: e.target.value})} placeholder="Zili çalmayın lütfen..." />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
             <div>
               <p className="text-sm text-gray-500">Ödenecek Tutar</p>
               <p className="text-2xl font-bold text-brand-600">{total} ₺</p>
             </div>
             <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/30">
               Siparişi Ver
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};