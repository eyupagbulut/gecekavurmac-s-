import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  User, 
  Info, 
  Utensils, 
  Trash2, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const BookATable: React.FC = () => {
  const { bookings, addBooking, cancelBooking, loyaltyProfile } = useMenu();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill fields if user has a loyalty profile registered
  useEffect(() => {
    if (loyaltyProfile) {
      setFullName(loyaltyProfile.fullName || '');
      setPhone(loyaltyProfile.phone || '');
      if (loyaltyProfile.email) {
        setEmail(loyaltyProfile.email);
      }
    }
  }, [loyaltyProfile]);

  // Set min date to today
  const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleGuestSelect = (count: number) => {
    setGuestsCount(count);
  };

  const timeSlots = [
    '12:00', '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Lütfen adınızı ve soyadınızı belirtin.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Lütfen iletişim numaranızı belirtin.');
      return;
    }
    if (!date) {
      setErrorMsg('Lütfen bir rezervasyon tarihi seçin.');
      return;
    }
    if (!timeSlot) {
      setErrorMsg('Lütfen bir zaman dilimi seçin.');
      return;
    }

    addBooking({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      date,
      timeSlot,
      guestsCount,
      notes: notes.trim() || undefined
    });

    setIsSuccess(true);
    // Reset transient fields
    setDate('');
    setTimeSlot('');
    setNotes('');
    
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  // Convert status to readable text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Onaylandı':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-tight uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/10">
            ● Onaylandı
          </span>
        );
      case 'İptal Edildi':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-tight uppercase px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/10">
            ● İptal Edildi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-tight uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/10">
            ● Beklemede
          </span>
        );
    }
  };

  return (
    <section id="table-booking" className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Information and booking form */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 p-6 md:p-8 rounded-3xl shadow-sm">
          
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-2xl shrink-0">
              <Utensils size={28} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Masa Rezervasyonu</h2>
                <span className="inline-flex items-center gap-1 text-[10px] bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-extrabold px-2 py-0.5 rounded-full">
                  <Sparkles size={10} className="fill-orange-500 text-orange-500" />
                  %100 Doğrulanmış
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 mt-1 font-medium">
                Sıra beklemeden, Taş fırın çıtır ekmek arası ve enfes pilav kavurmamızın tadını çıkarmak için masanızı önceden ayırtın.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Guest Count Selector */}
            <div>
              <label className="block text-xs font-black text-gray-800 dark:text-zinc-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Users size={14} className="text-gray-400" /> Kişi Sayısı
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleGuestSelect(num)}
                    className={`py-2 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer ${
                      guestsCount === num
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10 scale-102 border-transparent'
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-100 dark:border-zinc-850'
                    }`}
                  >
                    {num} {num === 10 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Selectors */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-gray-800 dark:text-zinc-300 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" /> Tarih Seçin
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={getTodayString()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-gray-50 focus:bg-white dark:bg-zinc-950 dark:focus:bg-zinc-900 border border-gray-150 dark:border-zinc-850 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-gray-800 dark:text-zinc-100 rounded-xl py-3 px-3.5 text-xs outline-none font-bold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-800 dark:text-zinc-300 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" /> Saat Dilimi
                </label>
                <div className="relative">
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                    className="w-full bg-gray-50 focus:bg-white dark:bg-zinc-950 dark:focus:bg-zinc-900 border border-gray-150 dark:border-zinc-850 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-gray-800 dark:text-zinc-100 rounded-xl py-3 px-3.5 text-xs outline-none font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Zaman Seçin</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <Clock size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Loyalty Pre-fill notification */}
            {loyaltyProfile && (
              <div className="flex gap-2.5 p-3.5 bg-brand-50/20 dark:bg-brand-950/5 border border-brand-100/40 dark:border-brand-900/15 rounded-2xl">
                <span className="text-base text-brand-600 dark:text-brand-400 shrink-0 select-none">👋</span>
                <span className="text-[11px] text-gray-600 dark:text-zinc-400 font-bold leading-normal">
                  <span className="text-brand-600 dark:text-brand-400 font-black">{loyaltyProfile.fullName}</span>, Sadakat profilinizi algıladık! İletişim bilgileriniz aşağıda sizin için otomatik dolduruldu.
                </span>
              </div>
            )}

            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-gray-800 dark:text-zinc-300 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" /> Adınız Soyadınız
                </label>
                <input
                  type="text"
                  placeholder="Can Demir"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-gray-50 focus:bg-white dark:bg-zinc-950 dark:focus:bg-zinc-900 border border-gray-150 dark:border-zinc-850 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-gray-800 dark:text-zinc-100 rounded-xl py-3 px-3.5 text-xs outline-none font-bold transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-800 dark:text-zinc-300 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-gray-400" /> Telefon Numarası
                </label>
                <input
                  type="tel"
                  placeholder="0555 555 55 55"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-gray-50 focus:bg-white dark:bg-zinc-950 dark:focus:bg-zinc-900 border border-gray-150 dark:border-zinc-850 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-gray-800 dark:text-zinc-100 rounded-xl py-3 px-3.5 text-xs outline-none font-bold transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-gray-800 dark:text-zinc-300 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-gray-400" /> E-Posta Adresi (İsteğe Bağlı)
                </label>
                <input
                  type="email"
                  placeholder="can@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 focus:bg-white dark:bg-zinc-950 dark:focus:bg-zinc-900 border border-gray-150 dark:border-zinc-850 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-gray-800 dark:text-zinc-100 rounded-xl py-3 px-3.5 text-xs outline-none font-bold transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-800 dark:text-zinc-300 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Info size={14} className="text-gray-400" /> Özel Not / Alerji Bilgisi
                </label>
                <input
                  type="text"
                  placeholder="Pencere kenarı masa, alerjiler vb."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-50 focus:bg-white dark:bg-zinc-950 dark:focus:bg-zinc-900 border border-gray-150 dark:border-zinc-850 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-gray-800 dark:text-zinc-100 rounded-xl py-3 px-3.5 text-xs outline-none font-bold transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-950/40 p-3.5 rounded-xl font-bold">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-2 text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/40 p-3.5 rounded-xl font-bold">
                <CheckCircle2 size={15} />
                <span>Rezervasyon işleminiz başarıyla sisteme alınmıştır! Enfes kavurmalarımız ile sabırsızlıkla bekliyoruz.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-brand-600/10 flex items-center justify-center gap-2"
            >
              <Utensils size={15} /> Masamı Ayır
            </button>
          </form>
        </div>

        {/* Right Column: Active bookings & contact detail card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active bookings panel */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-zinc-850 mb-5">
              <div className="p-1 px-2 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-850 rounded-xl text-gray-500">
                ⭐
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 leading-none">Rezervasyonlarım</h3>
                <span className="text-[10px] text-gray-450 dark:text-zinc-500 font-bold">Masa ayırtmalarınız ve durumları</span>
              </div>
              <span className="ml-auto font-mono text-[11px] font-black bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-xl">
                {bookings.length} Toplam
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full border border-dashed border-gray-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-3.5 text-gray-400">
                  📅
                </div>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">Aktif Rezervasyonunuz Yok</p>
                <p className="text-[10px] text-gray-450 dark:text-zinc-500 font-medium px-4 mt-1">Sol taraftaki alanı doldurarak anında masa rezervasyonu oluşturabilirsiniz.</p>
              </div>
            ) : (
              <div className="space-y-4.5 max-h-[420px] overflow-y-auto pr-1">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-gray-50/50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-850 rounded-2xl relative overflow-hidden transition-all duration-300"
                  >
                    {/* Corner strip status or identifier */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">KOD: {b.id}</span>
                        <span className="font-black text-xs text-gray-900 dark:text-zinc-100 mt-0.5">{b.fullName}</span>
                      </div>
                      {getStatusBadge(b.status)}
                    </div>

                    {/* Booking metadata */}
                    <div className="grid grid-cols-3 gap-2.5 border-t border-b border-gray-100/60 dark:border-zinc-800/40 py-2.5 my-3.5 text-center">
                      <div className="flex flex-col justify-center">
                        <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Tarih</span>
                        <span className="text-xs font-black text-gray-700 dark:text-zinc-200 mt-1">{b.date}</span>
                      </div>
                      <div className="flex flex-col justify-center border-l border-r border-gray-100/60 dark:border-zinc-800/40">
                        <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Saat</span>
                        <span className="text-xs font-black text-gray-700 dark:text-zinc-200 mt-1">{b.timeSlot}</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Kişi</span>
                        <span className="text-xs font-black text-gray-700 dark:text-zinc-200 mt-1">{b.guestsCount} Kişi</span>
                      </div>
                    </div>

                    {b.notes && (
                      <div className="mt-2.5 p-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850/60 rounded-xl">
                        <p className="text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold uppercase mb-0.5">Notlar</p>
                        <p className="text-[10px] text-gray-600 dark:text-zinc-350 font-bold">{b.notes}</p>
                      </div>
                    )}

                    {/* Cancellability */}
                    {b.status === 'Onaylandı' && (
                      <div className="mt-3.5 flex justify-end">
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="px-3 py-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 text-gray-400 rounded-lg transition-colors duration-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer border border-transparent hover:border-red-100/40"
                          title="Rezervasyonu İptal Et"
                        >
                          <Trash2 size={11} /> İptal Et
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact details & Opening Hours Card */}
          <div className="bg-brand-600 text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10">
              <Utensils size={180} />
            </div>
            
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-brand-100">Çalışma Saatleri</h4>
            <div className="mt-3.5 space-y-2 text-xs font-bold text-white/90">
              <div className="flex justify-between border-b border-brand-500/40 pb-2">
                <span>Pazartesi - Cumartesi:</span>
                <span className="font-mono">11:30 - 22:30</span>
              </div>
              <div className="flex justify-between border-b border-brand-500/40 pb-2">
                <span>Pazar:</span>
                <span className="font-mono">12:00 - 22:00</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Adres:</span>
                <span className="text-right max-w-[180px] text-[11px] leading-tight text-white/80">
                  Fikirtepe Caddesi No: 12 Kadıköy, İstanbul
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-[11px] bg-black/10 px-3.5 py-2.5 rounded-2xl border border-white/10">
              <span className="font-extrabold">📞 Rezervasyon Destek</span>
              <span className="font-mono font-black">0216 555 00 00</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
