import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  Award, 
  Gift, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  History, 
  Sparkles, 
  Check, 
  Copy, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  Ticket, 
  Flame, 
  UtensilsCrossed 
} from 'lucide-react';

export const LoyaltySystem: React.FC = () => {
  const { 
    loyaltyProfile, 
    registerLoyalty, 
    claimReward, 
    activeRewards 
  } = useMenu();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [copiedRewardId, setCopiedRewardId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    registerLoyalty(fullName.trim(), phone.trim(), email.trim() || undefined);
    setFullName('');
    setPhone('');
    setEmail('');
  };

  const handleCopyCode = (code: string, rewardId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedRewardId(rewardId);
    setTimeout(() => {
      setCopiedRewardId(null);
    }, 2000);
  };

  // Decide tier color theme
  const getTierTheme = (tier?: string) => {
    switch (tier) {
      case 'Gümüş':
        return {
          bg: 'bg-gradient-to-br from-slate-500 via-gray-600 to-slate-700',
          text: 'text-slate-100',
          badgeBg: 'bg-slate-500/20 text-slate-200 border-slate-400',
          progressBar: 'bg-slate-300'
        };
      case 'Altın':
        return {
          bg: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700',
          text: 'text-amber-50',
          badgeBg: 'bg-amber-500/20 text-yellow-100 border-amber-300',
          progressBar: 'bg-yellow-300'
        };
      case 'Platin':
        return {
          bg: 'bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800',
          text: 'text-purple-50',
          badgeBg: 'bg-purple-500/20 text-purple-100 border-purple-400',
          progressBar: 'bg-purple-300'
        };
      default: // Bronz
        return {
          bg: 'bg-gradient-to-br from-amber-700 via-orange-800 to-amber-950',
          text: 'text-orange-100',
          badgeBg: 'bg-orange-500/20 text-orange-200 border-orange-400',
          progressBar: 'bg-orange-500'
        };
    }
  };

  const tierColors = getTierTheme(loyaltyProfile?.membershipTier);

  // Compute points towards next tier
  const getNextTierThreshold = () => {
    const earned = loyaltyProfile?.totalEarned || 0;
    if (earned < 300) return { next: 'Gümüş', target: 300, remaining: 300 - earned };
    if (earned < 800) return { next: 'Altın', target: 800, remaining: 800 - earned };
    if (earned < 1500) return { next: 'Platin', target: 1500, remaining: 1500 - earned };
    return null;
  };

  const nextTierInfo = getNextTierThreshold();

  return (
    <div id="loyalty-hub" className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-100">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Intro and Card Display / Join Portal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-brand-600 text-xs font-bold uppercase tracking-wider">
              <Award size={13} className="animate-spin duration-1000" />
              <span>Sıcak Lezzet Kartı</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Sipariş Verdikçe Kazanın!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Kavurmacı Kadıköy'de her yudum ve her ısırık size lezzet puanı kazandırır! Siparişlerinizin <span className="font-bold text-gray-800">%10'u</span> kadar puan biriktirin, bedava yemekler ve indirim kuponları kazanın.
            </p>
          </div>

          {!loyaltyProfile ? (
            /* Registration Form */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                  <Gift size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Ücretsiz Kartını Oluştur</h3>
                  <p className="text-xs text-gray-400">Anında 50 Üye Bonusu Puanı Kazanın! 🎁</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Ad Soyad</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Örn: Mehmet Öztürk"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Telefon Numarası</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <Phone size={15} />
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Örn: 0555 123 4567"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">E-posta Adresi (Sipariş Makbuzu İçin)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                      <Mail size={15} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Örn: adiniz@ornek.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-brand-600 active:scale-[0.98] transition shadow-md"
                >
                  Kartımı Oluştur & Hediye Al
                </button>
              </form>
            </div>
          ) : (
            /* Digital Membership Card (Kavurma Lezzet Kartı) */
            <div className="space-y-4">
              <div className={`relative ${tierColors?.bg} rounded-3xl p-6 shadow-2xl overflow-hidden aspect-[1.65/1] text-white flex flex-col justify-between transform hover:scale-[1.01] transition-transform duration-300`}>
                
                {/* Background ambient mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl" />

                {/* Card Top */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[10px] tracking-widest text-white/60 font-semibold uppercase">Dijital Sadakat Kartı</span>
                    <h3 className="text-lg font-extrabold tracking-tight">KAVURMACI KADIKÖY</h3>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full border border-white/20 text-xs font-bold backdrop-blur-md ${tierColors?.badgeBg}`}>
                    👑 {loyaltyProfile.membershipTier}
                  </div>
                </div>

                {/* Card Middle - Points Balance */}
                <div className="z-10 py-2">
                  <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Mevcut Bakiyeniz</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black tracking-tight">{loyaltyProfile.points}</span>
                    <span className="text-sm font-semibold text-white/80">Lezzet Puan</span>
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="flex justify-between items-end border-t border-white/10 pt-3 z-10">
                  <div>
                    <p className="text-[9px] text-white/40 uppercase font-medium leading-none mb-0.5">KART SAHİBİ</p>
                    <p className="text-xs font-bold tracking-wide uppercase">{loyaltyProfile.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-white/40 uppercase font-medium leading-none mb-0.5">ÜYELİK NO</p>
                    <p className="text-xs font-mono font-bold tracking-wider">KVR-{loyaltyProfile.phone.slice(-4)}</p>
                  </div>
                </div>
              </div>

              {/* Progress to next Tier */}
              {nextTierInfo && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs text-gray-600">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="font-semibold text-gray-800">
                      Müteakip Seviye: <span className="text-brand-600 font-bold">{nextTierInfo.next} Seviyesi</span>
                    </p>
                    <span>{loyaltyProfile.totalEarned} / {nextTierInfo.target} Puan</span>
                  </div>
                  
                  {/* Progress bar wrap */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-600 transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(100, (loyaltyProfile.totalEarned / nextTierInfo.target) * 100)}%` }}
                    />
                  </div>
                  <p className="text-gray-400 mt-1.5 text-[11px]">
                    Toplam kazancınız {nextTierInfo.remaining} Lezzet Puanı arttığında otomatik olarak {nextTierInfo.next} seviye ayrıcalıklarına ulaşırsınız.
                  </p>
                </div>
              )}

              {/* Loyalty History (Accordion) */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="w-full px-4 py-3.5 flex justify-between items-center hover:bg-gray-50/50 transition"
                >
                  <div className="flex items-center gap-2 text-gray-800">
                    <History size={16} className="text-gray-500" />
                    <span className="text-sm font-bold">Puan Hesap Hareketleri</span>
                  </div>
                  {isHistoryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isHistoryExpanded && (
                  <div className="border-t border-gray-100 p-4 max-h-[180px] overflow-y-auto space-y-2.5">
                    {loyaltyProfile.history.length === 0 ? (
                      <p className="text-center py-4 text-xs text-gray-400">Herhangi bir puan hareketi bulunamadı.</p>
                    ) : (
                      loyaltyProfile.history.map((h) => {
                        const isGain = h.type === 'kazanç';
                        return (
                          <div key={h.id} className="flex justify-between items-center text-xs p-1.5 hover:bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-semibold text-gray-800 text-xs block leading-tight">{h.description}</span>
                              <span className="text-[10px] text-gray-400">{new Date(h.timestamp).toLocaleDateString('tr-TR')} {new Date(h.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <span className={`font-bold ${isGain ? 'text-green-600' : 'text-red-500'}`}>
                              {isGain ? '+' : '-'}{h.amount} Pts
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Redeemable Rewards Grid */}
        <div className="lg:col-span-7 space-y-5">
          <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Ticket size={18} className="text-brand-600" />
                <span>Kart Ödülleri Mağazası</span>
              </h3>
              <p className="text-xs text-gray-450">Biriktirdiğiniz puanları dilediğiniz ödülle takas edin</p>
            </div>
            {loyaltyProfile && (
              <div className="bg-brand-50 text-brand-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <span>Mevcut Bakiye:</span>
                <span className="text-brand-600 text-sm font-black">{loyaltyProfile.points} Puan</span>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {activeRewards.map((reward) => {
              const canAfford = loyaltyProfile ? loyaltyProfile.points >= reward.pointsCost : false;
              
              return (
                <div 
                  key={reward.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between gap-4 relative overflow-hidden ${
                    reward.isClaimed 
                      ? 'border-green-200 bg-green-50/10 shadow-sm' 
                      : canAfford 
                        ? 'border-brand-200 shadow-md ring-1 ring-brand-500/10 hover:shadow-lg' 
                        : 'border-gray-100 hover:shadow-sm'
                  }`}
                >
                  {/* Claims overlay banner */}
                  {reward.isClaimed && (
                    <div className="absolute top-2.5 right-2.5 bg-green-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                      <Check size={9} />
                      Alındı
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* Icon mapping */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      reward.isClaimed 
                        ? 'bg-green-100 text-green-600' 
                        : canAfford 
                          ? 'bg-brand-50 text-brand-600' 
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {reward.iconType === 'ayran' && <Flame size={18} />}
                      {reward.iconType === 'indirim' && <Ticket size={18} />}
                      {reward.iconType === 'ekmek' && <UtensilsCrossed size={18} />}
                      {reward.iconType === 'pilav' && <Award size={18} />}
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{reward.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-snug">{reward.description}</p>
                    </div>
                  </div>

                  {/* Actions area */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1 text-xs">
                    <div>
                      {reward.isClaimed ? (
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase leading-none block">KODUNUZ:</span>
                          <span className="font-mono font-bold text-green-700 bg-green-100/50 px-2 py-1 rounded block">{reward.code}</span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-gray-400 uppercase leading-none block">GEREKEN:</span>
                          <span className="font-extrabold text-brand-600 text-sm">{reward.pointsCost} <span className="text-[10px] font-bold">Puan</span></span>
                        </div>
                      )}
                    </div>

                    {reward.isClaimed ? (
                      <button
                        onClick={() => handleCopyCode(reward.code, reward.id)}
                        className="py-1 px-2.5 hover:bg-gray-100 rounded-lg text-gray-600 font-semibold text-[11px] border border-gray-200 flex items-center gap-1 transition"
                      >
                        {copiedRewardId === reward.id ? (
                          <>
                            <Check size={12} className="text-green-500" />
                            <span>Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Kodu Al</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => claimReward(reward.id)}
                        disabled={!canAfford}
                        className={`py-2 px-3 rounded-xl font-bold transition flex items-center gap-1 text-[11px] ${
                          canAfford 
                            ? 'bg-brand-600 hover:bg-brand-700 text-white' 
                            : 'bg-gray-150 text-gray-400 border border-transparent cursor-not-allowed'
                        }`}
                      >
                        <span>Ödülü Al</span>
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
