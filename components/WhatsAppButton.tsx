import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const { cartItems, settings } = useMenu();
  
  // Format phone number to clean WhatsApp format (numeric only)
  const getFormattedNumber = () => {
    let raw = settings.phone.replace(/\D/g, ''); // strip non-numeric
    if (raw.startsWith('0')) {
      raw = '90' + raw.substring(1);
    } else if (!raw.startsWith('90') && raw.length === 10) {
      raw = '90' + raw;
    }
    return raw || "905525467058";
  };

  const whatsappNumber = getFormattedNumber();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  let sampleMessage = `Merhaba ${settings.restaurantName}, menü ve siparişler hakkında bir sorum vardı.`;
  
  if (cartItems.length > 0) {
    const itemsText = cartItems
      .map(item => `• ${item.quantity} adet ${item.name} (${item.weight || 'Porsiyon'}) - Tekil: ${item.price} ₺ (Tutar: ${item.price * item.quantity} ₺)`)
      .join('\n');
    
    sampleMessage = `Merhaba ${settings.restaurantName}! 🥩\n\nSepetimdeki şu lezzetleri doğrudan WhatsApp üzerinden sipariş vermek istiyorum:\n\n${itemsText}\n\n*Toplam Tutar:* ${totalAmount} ₺\n\nSipariş Onayı ve teslimat detayı için yardımcı olabilir misiniz?`;
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(sampleMessage)}`;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {/* Dynamic WhatsApp Tooltip / Invite Bubble */}
      {showTooltip && (
        <div className="relative mb-2.5 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-150 rounded-xl px-4 py-2.5 shadow-xl border border-gray-100 dark:border-zinc-800/80 flex items-center gap-2.5 animate-bounce max-w-[240px] md:max-w-xs transition-colors">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${totalItems > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-zinc-50 leading-none">
              {totalItems > 0 ? 'WhatsApp ile Sipariş Et!' : 'Canlı WhatsApp Destek'}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-zinc-400 mt-1.5 leading-tight">
              {totalItems > 0 
                ? `Sepetinizdeki ${totalItems} ürünü tek tıkla siparişe dönüştürün.` 
                : 'Sorularınız için bize hemen yazın!'}
            </p>
          </div>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-350 transition shrink-0 ml-1"
            aria-label="Kapat"
          >
            <X size={14} />
          </button>
          
          {/* Tooltip caret */}
          <div className="absolute right-5 bottom-[-6px] w-3 h-3 bg-white dark:bg-zinc-900 border-r border-b border-gray-100 dark:border-zinc-800/80 rotate-45" />
        </div>
      )}

      {/* Actual Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group relative ring-4 ring-emerald-500/10"
        title="WhatsApp ile İletişime Geç"
      >
        <MessageCircle size={28} className="fill-white" />
        
        {/* Dynamic Badge */}
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-5.5 bg-red-500 text-white rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[10px] font-black px-1.5 animate-pulse shadow-sm">
            {totalItems}
          </span>
        )}
      </a>
    </div>
  );
};
