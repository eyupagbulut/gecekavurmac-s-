import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Menu as MenuIcon, UserCog, Search, X, Award, History, Sun, Moon } from 'lucide-react';
import { CartDrawer } from './components/Cart';
import { Hero, ProductList } from './components/Store';
import { SpecialsCarousel } from './components/SpecialsCarousel';
import { Assistant } from './components/Assistant';
import { OrderStatusTracker } from './components/OrderStatusTracker';
import { MealFeedbackModal } from './components/MealFeedbackModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { LoyaltySystem } from './components/LoyaltySystem';
import { BookATable } from './components/BookATable';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { MenuProvider, useMenu } from './context/MenuContext';
import { AdminPanel, AdminLogin } from './components/Admin';
import { ToastOverlay } from './components/ToastOverlay';

// Sub-component to consume context (since App creates the provider)
const AppContent: React.FC = () => {
  const { cartItems, searchQuery, setSearchQuery, loyaltyProfile, theme, toggleTheme } = useMenu();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Admin State
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const scrollToLoyalty = () => {
    const element = document.getElementById('loyalty-hub');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTableBooking = () => {
    const element = document.getElementById('table-booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (showAdmin) {
    if (isAdminAuthenticated) {
      return <AdminPanel onLogout={() => { setIsAdminAuthenticated(false); setShowAdmin(false); }} />;
    }
    return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20 transition-colors duration-300">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm dark:shadow-zinc-950/20 py-3 border-b border-transparent dark:border-zinc-800/50' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${scrolled ? 'bg-brand-600 text-white' : 'bg-white text-brand-600'}`}>
              <MenuIcon size={24} />
            </div>
            <div className="flex flex-col shrink-0">
               <h1 className={`font-bold text-xl leading-none ${scrolled ? 'text-gray-900 dark:text-zinc-100' : 'text-white'}`}>Kavurmacı</h1>
               <span className={`text-xs ${scrolled ? 'text-gray-500 dark:text-zinc-400' : 'text-white/80'}`}>Kadıköy</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xs md:max-w-md mx-4 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className={`${scrolled ? 'text-gray-400 dark:text-zinc-500 group-focus-within:text-brand-600' : 'text-white/60 group-focus-within:text-gray-500'} transition-colors`} />
            </div>
            <input
              type="text"
              placeholder="Lezzet ara (ör: pilav, ekmek)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-1.5 pl-9 pr-8 text-sm rounded-full outline-none transition-all duration-300 border ${
                scrolled 
                  ? 'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:focus:ring-brand-500/20 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500' 
                  : 'bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:ring-4 focus:ring-white/10'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Aramayı Temizle"
              >
                <X size={14} className={`${!scrolled ? 'text-white/70 group-focus-within:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
             <div className={`hidden md:flex items-center gap-1 text-sm font-medium ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
                <MapPin size={16} />
                <span>Fikirtepe & Dumlupınar</span>
             </div>

             <div className="flex items-center gap-2">
               {/* Order History Action */}
               <button
                 onClick={() => setIsHistoryOpen(true)}
                 className={`p-3 rounded-full transition-colors relative hover:scale-105 duration-300 ${
                   scrolled 
                     ? 'text-gray-500 hover:text-gray-900' 
                     : 'text-white/70 hover:text-white'
                 }`}
                 title="Sipariş Geçmişim"
               >
                 <History size={20} />
               </button>

               {/* Theme Toggle Button */}
               <button
                 onClick={toggleTheme}
                 className={`p-3 rounded-full transition-colors hover:scale-105 duration-300 ${
                   scrolled 
                     ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100' 
                     : 'text-white/70 hover:text-white hover:bg-white/10'
                 }`}
                 title={theme === 'dark' ? 'Gündüz Modu' : 'Gece Modu'}
               >
                 {theme === 'dark' ? (
                   <Sun size={20} className="text-amber-400 fill-amber-400" />
                 ) : (
                   <Moon size={20} className="text-white" />
                 )}
               </button>

               <button
                onClick={() => setShowAdmin(true)}
                className={`p-3 rounded-full transition-colors ${
                  scrolled 
                    ? 'text-gray-500 hover:text-gray-900' 
                    : 'text-white/70 hover:text-white'
                }`}
                title="Yönetici Girişi"
               >
                 <UserCog size={20} />
               </button>

               {/* Loyalty Card Shortcut Indicator */}
               {loyaltyProfile ? (
                 <button
                  onClick={scrollToLoyalty}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-xs transition-all duration-300 hover:scale-105 ${
                    scrolled 
                      ? 'bg-orange-50 text-brand-600 hover:bg-orange-100 border border-orange-100' 
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/10'
                  }`}
                  title="Lezzet Puanlarım ve Sadakat Kartım"
                 >
                   <Award size={15} className="text-orange-500 animate-pulse fill-orange-500 shrink-0" />
                   <span>{loyaltyProfile.points} Puan</span>
                 </button>
               ) : (
                 <button
                  onClick={scrollToLoyalty}
                  className={`p-3 rounded-full transition-colors flex items-center justify-center relative group hover:scale-105 duration-300 ${
                    scrolled 
                      ? 'text-gray-500 hover:text-gray-900' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  title="Lezzet Kartı Oluştur, Bonus Puan Kazan!"
                 >
                   <Award size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full animate-ping" />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full" />
                 </button>
               )}

               <button 
                onClick={() => setIsCartOpen(true)}
                className={`relative p-3 rounded-full transition-colors ${
                  scrolled 
                    ? 'bg-gray-100 text-gray-800 hover:bg-brand-50 hover:text-brand-600' 
                    : 'bg-white/20 text-white hover:bg-white hover:text-brand-600'
                }`}
               >
                 <ShoppingBag size={20} />
                 {cartTotalItems > 0 && (
                   <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                     {cartTotalItems}
                   </span>
                 )}
               </button>
             </div>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <SpecialsCarousel />
        <ProductList />
        <BookATable />
        <LoyaltySystem />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Kavurmacı Kadıköy</h3>
            <p>Geleneksel lezzetleri modern hizmet anlayışıyla kapınıza getiriyoruz.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Hizmet Bölgeleri</h4>
            <ul className="space-y-2">
              <li>Fikirtepe Mahallesi</li>
              <li>Dumlupınar Mahallesi</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Müdavim Seçenekleri</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  🕒 Sipariş Geçmişim
                </button>
              </li>
              <li>
                <button 
                  onClick={scrollToTableBooking}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  📅 Masa Rezervasyonu
                </button>
              </li>
              <li>
                <button 
                  onClick={scrollToLoyalty}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  ⭐ Lezzet Kartı & Sadakat
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">İletişim</h4>
            <p>0216 555 00 00</p>
            <p>info@kavurmacikadikoy.com</p>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-gray-800 text-xs">
          © 2024 Kavurmacı Kadıköy. Tüm hakları saklıdır.
        </div>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <OrderHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onOpenCart={() => setIsCartOpen(true)}
      />
      <OrderStatusTracker />
      <MealFeedbackModal />
      <WhatsAppButton />
      <Assistant />
      <ToastOverlay />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MenuProvider>
      <AppContent />
    </MenuProvider>
  );
}

export default App;