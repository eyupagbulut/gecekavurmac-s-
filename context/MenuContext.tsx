import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem, SalesReport, ActiveOrder, OrderStatus, OrderDetails, LoyaltyProfile, LoyaltyReward, LoyaltyHistoryItem, PastOrder, MealRating, Toast, TableBooking } from '../types';
import { INITIAL_MENU } from '../constants';

interface MenuContextType {
  products: Product[];
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartQuantity: (productId: string, variantId: string, delta: number) => void;
  clearCart: () => void;
  
  // Custom tracking
  activeOrder: ActiveOrder | null;
  placeOrder: (details: OrderDetails, total: number, items: CartItem[]) => void;
  cancelActiveOrder: () => void;
  completeActiveOrder: () => void;

  // Meal Rating and Feedback
  submittedRatings: MealRating[];
  submitMealRating: (rating: MealRating) => void;
  dismissedRatingOrderIds: string[];
  dismissRating: (orderId: string) => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Theme state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Loyalty points system
  loyaltyProfile: LoyaltyProfile | null;
  registerLoyalty: (fullName: string, phone: string, email?: string) => void;
  claimReward: (rewardId: string) => void;
  addLoyaltyPoints: (amount: number, description: string) => void;
  activeRewards: LoyaltyReward[];

  // Order history
  pastOrders: PastOrder[];
  clearPastOrders: () => void;

  // Toast notifications system
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  requestNotificationPermission: () => void;

  // Admin functions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  bulkUpdatePrices: (updates: {productId: string, variantId: string, newPrice: number}[]) => void;
  
  // Reporting
  report: SalesReport;
  recordSale: (total: number, items: CartItem[]) => void;

  // Table Bookings State & Actions
  bookings: TableBooking[];
  addBooking: (booking: Omit<TableBooking, 'id' | 'status' | 'createdAt'>) => void;
  cancelBooking: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_MENU);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('kavurmaci_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('kavurmaci_theme', next);
      return next;
    });
  };

  const [report, setReport] = useState<SalesReport>({
    totalOrders: 124, // Mock initial data
    totalRevenue: 45200,
    topSellingItem: 'Pilav Kavurma'
  });

  const INITIAL_REWARDS: LoyaltyReward[] = [
    { id: 'r1', title: 'Bedava Ayran Kuponu', description: 'Kavurmanın yanına buz gibi köpüklü Ayran!', pointsCost: 100, code: 'LEZZET-AYRAN', isClaimed: false, iconType: 'ayran' },
    { id: 'r2', title: '50 ₺ İndirim Kuponu', description: 'Tüm siparişlerinizde anında geçerli 50 ₺ indirim.', pointsCost: 200, code: 'KAVURMA-KUPON50', isClaimed: false, iconType: 'indirim' },
    { id: 'r3', title: '120 ₺ İndirim Kuponu', description: 'Tüm siparişlerinizde anında geçerli 120 ₺ indirim.', pointsCost: 450, code: 'KAVURMA-KUPON120', isClaimed: false, iconType: 'indirim' },
    { id: 'r4', title: 'Bedava Ekmek Arası', description: 'Taş fırın çıtır ekmek arası enfes kavurma.', pointsCost: 800, code: 'LEZZET-EKMEK', isClaimed: false, iconType: 'ekmek' }
  ];

  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kavurmaci_loyalty_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pastOrders, setPastOrders] = useState<PastOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kavurmaci_past_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const clearPastOrders = () => {
    setPastOrders([]);
    localStorage.removeItem('kavurmaci_past_orders');
  };

  const [bookings, setBookings] = useState<TableBooking[]>(() => {
    try {
      const saved = localStorage.getItem('kavurmaci_table_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addBooking = (newBookingData: Omit<TableBooking, 'id' | 'status' | 'createdAt'>) => {
    const bookingId = `MASA-${Math.floor(100 + Math.random() * 900).toString()}`;
    const newBooking: TableBooking = {
      ...newBookingData,
      id: bookingId,
      status: 'Onaylandı',
      createdAt: Date.now()
    };

    setBookings(prev => {
      const updated = [newBooking, ...prev];
      localStorage.setItem('kavurmaci_table_bookings', JSON.stringify(updated));
      return updated;
    });

    addToast({
      title: "Rezervasyon Alındı! 📝",
      message: `${newBooking.date} günü saat ${newBooking.timeSlot} için ${newBooking.guestsCount} kişilik masanız onaylandı. Rezervasyon No: ${bookingId}`,
      type: 'success',
      duration: 6000
    });
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: 'İptal Edildi' as const } : b);
      localStorage.setItem('kavurmaci_table_bookings', JSON.stringify(updated));
      return updated;
    });

    addToast({
      title: "Rezervasyon İptal Edildi ❌",
      message: "Rezervasyonunuz başarıyla iptal edilmiştir.",
      type: 'info',
      duration: 5000
    });
  };

  const [submittedRatings, setSubmittedRatings] = useState<MealRating[]>(() => {
    try {
      const saved = localStorage.getItem('kavurmaci_submitted_ratings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [dismissedRatingOrderIds, setDismissedRatingOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kavurmaci_dismissed_ratings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const submitMealRating = (rating: MealRating) => {
    setSubmittedRatings(prev => {
      const updated = [rating, ...prev];
      localStorage.setItem('kavurmaci_submitted_ratings', JSON.stringify(updated));
      return updated;
    });

    // Add bonus loyalty points
    if (loyaltyProfile) {
      addLoyaltyPoints(15, `Lezzet Geri Bildirim Bonusu ⭐ (#${rating.orderId})`);
    }
  };

  const dismissRating = (orderId: string) => {
    setDismissedRatingOrderIds(prev => {
      if (prev.includes(orderId)) return prev;
      const updated = [...prev, orderId];
      localStorage.setItem('kavurmaci_dismissed_ratings', JSON.stringify(updated));
      return updated;
    });
  };

  const [activeRewards, setActiveRewards] = useState<LoyaltyReward[]>(() => {
    try {
      const saved = localStorage.getItem('kavurmaci_claimed_rewards');
      return saved ? JSON.parse(saved) : INITIAL_REWARDS;
    } catch {
      return INITIAL_REWARDS;
    }
  });

  const getMembershipTier = (totalEarned: number): 'Bronz' | 'Gümüş' | 'Altın' | 'Platin' => {
    if (totalEarned >= 1500) return 'Platin';
    if (totalEarned >= 800) return 'Altın';
    if (totalEarned >= 300) return 'Gümüş';
    return 'Bronz';
  };

  const registerLoyalty = (fullName: string, phone: string, email?: string) => {
    const welcomeHistory: LoyaltyHistoryItem[] = [
      {
        id: `LH-${Math.floor(1000 + Math.random() * 9000).toString()}`,
        type: 'kazanç',
        amount: 50,
        description: 'Hoş Geldin Üyelik Hediyesi 🎁',
        timestamp: Date.now()
      }
    ];

    const profile: LoyaltyProfile = {
      fullName,
      phone,
      email,
      points: 50,
      totalEarned: 50,
      history: welcomeHistory,
      membershipTier: 'Bronz'
    };

    setLoyaltyProfile(profile);
    localStorage.setItem('kavurmaci_loyalty_profile', JSON.stringify(profile));

    // Seed 2 mock historical orders so the profile looks complete immediately!
    const mockPastOrders: PastOrder[] = [
      {
        id: 'KVR-7841',
        items: [
          {
            productId: 'p1',
            variantId: 'v1',
            name: 'Pilav Üstü Kavurma (Standart)',
            price: 185,
            quantity: 1,
            weight: '150g'
          },
          {
            productId: 'p4',
            variantId: 'v4_1',
            name: 'Köpüklü Yayık Ayranı',
            price: 35,
            quantity: 1,
            weight: '300ml'
          }
        ],
        total: 220,
        details: {
          fullName,
          phone,
          address: 'Moda Caddesi, No: 44',
          neighborhood: 'Caferağa Mah.',
          paymentMethod: 'Nakit',
          note: 'Kavurma sıcak olsun lütfen, teşekkürler!'
        },
        status: 'Teslim Edildi',
        createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        completedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000
      },
      {
        id: 'KVR-3294',
        items: [
          {
            productId: 'p2',
            variantId: 'v2',
            name: 'Tombik Ekmek Arası Kavurma',
            price: 160,
            quantity: 2,
            weight: '120g'
          }
        ],
        total: 320,
        details: {
          fullName,
          phone,
          address: 'Moda Caddesi, No: 44',
          neighborhood: 'Caferağa Mah.',
          paymentMethod: 'Kredi Kartı',
          note: ''
        },
        status: 'Teslim Edildi',
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        completedAt: Date.now() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000
      }
    ];

    setPastOrders(mockPastOrders);
    localStorage.setItem('kavurmaci_past_orders', JSON.stringify(mockPastOrders));
  };

  const addLoyaltyPoints = (amount: number, description: string) => {
    setLoyaltyProfile(prev => {
      if (!prev) return null;
      const newPoints = prev.points + amount;
      const newTotalEarned = prev.totalEarned + amount;
      const newTier = getMembershipTier(newTotalEarned);
      const newHistoryItem: LoyaltyHistoryItem = {
        id: `LH-${Math.floor(1000 + Math.random() * 9000).toString()}`,
        type: 'kazanç',
        amount,
        description,
        timestamp: Date.now()
      };
      const updated = {
        ...prev,
        points: newPoints,
        totalEarned: newTotalEarned,
        membershipTier: newTier,
        history: [newHistoryItem, ...prev.history]
      };
      localStorage.setItem('kavurmaci_loyalty_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const claimReward = (rewardId: string) => {
    const reward = activeRewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (!loyaltyProfile) {
      alert("Lütfen önce bir Lezzet Kartı oluşturun!");
      return;
    }

    if (loyaltyProfile.points < reward.pointsCost) {
      alert("Üzgünüz, yeterli Lezzet Puanınız bulunmamaktadır.");
      return;
    }

    // Deduct points
    setLoyaltyProfile(prev => {
      if (!prev) return null;
      const newPoints = prev.points - reward.pointsCost;
      const newHistoryItem: LoyaltyHistoryItem = {
        id: `LH-${Math.floor(1000 + Math.random() * 9000).toString()}`,
        type: 'harcama',
        amount: reward.pointsCost,
        description: `Ödül Alındı: ${reward.title}`,
        timestamp: Date.now()
      };
      const updated = {
        ...prev,
        points: newPoints,
        history: [newHistoryItem, ...prev.history]
      };
      localStorage.setItem('kavurmaci_loyalty_profile', JSON.stringify(updated));
      return updated;
    });

    // Mark reward as claimed
    setActiveRewards(prev => {
      const updated = prev.map(r => r.id === rewardId ? { ...r, isClaimed: true } : r);
      localStorage.setItem('kavurmaci_claimed_rewards', JSON.stringify(updated));
      return updated;
    });
  };

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5005);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          addToast({
            title: 'Bildirim İzni Onaylandı! 🔔',
            message: 'Sipariş durum değişikliklerinde ve önemli güncellemelerde artık sizi bilgilendireceğiz.',
            type: 'success',
            duration: 4000
          });
        }
      });
    }
  };

  const triggerNativeNotification = (title: string, body: string) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.warn("Notification error:", e);
      }
    }
  };

  const playNotificationSound = (status: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (frequency: number, type: 'sine' | 'triangle' | 'square', duration: number, delay = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      if (status === 'Alındı') {
        playTone(523.25, 'sine', 0.15); // C5
      } else if (status === 'Hazırlanıyor') {
        playTone(523.25, 'sine', 0.1, 0); 
        playTone(659.25, 'sine', 0.15, 0.08); // C5 -> E5 rise
      } else if (status === 'Yolda') {
        playTone(587.33, 'triangle', 0.12, 0);
        playTone(698.46, 'triangle', 0.12, 0.08);
        playTone(880.00, 'sine', 0.2, 0.16); // D5 -> F5 -> A5
      } else if (status === 'Teslim Edildi') {
        playTone(523.25, 'sine', 0.12, 0);
        playTone(659.25, 'sine', 0.12, 0.08);
        playTone(783.99, 'sine', 0.12, 0.16);
        playTone(1046.50, 'sine', 0.3, 0.24);
      }
    } catch (error) {
      console.warn("Audio Context playback prevented by autoplay security strategy:", error);
    }
  };

  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() => {
    try {
      const saved = localStorage.getItem('kavurmaci_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Track status progression dynamically over time
  useEffect(() => {
    if (!activeOrder) return;
    if (activeOrder.status === 'Teslim Edildi') return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - activeOrder.createdAt;
      let nextStatus: OrderStatus = activeOrder.status;

      if (elapsed < 15000) {
        nextStatus = 'Alındı';
      } else if (elapsed < 45000) {
        nextStatus = 'Hazırlanıyor';
      } else if (elapsed < 90000) {
        nextStatus = 'Yolda';
      } else {
        nextStatus = 'Teslim Edildi';
      }

      if (nextStatus !== activeOrder.status) {
        setActiveOrder(prev => {
          if (!prev) return null;
          const updated = { ...prev, status: nextStatus };
          localStorage.setItem('kavurmaci_active_order', JSON.stringify(updated));
          return updated;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  // Watch activeOrder.status of existing orders to dispatch alerts
  const lastStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activeOrder) {
      lastStatusRef.current = null;
      return;
    }

    const currentStatus = activeOrder.status;

    if (lastStatusRef.current === null) {
      lastStatusRef.current = currentStatus;
      return;
    }

    if (lastStatusRef.current !== currentStatus) {
      let title = "Sipariş Durumu 🛎️";
      let message = "";
      
      switch (currentStatus) {
        case 'Alındı':
          title = "Sipariş Alındı! 🥩";
          message = `#${activeOrder.id} nolu siparişiniz başarıyla mutfağımıza ulaştı, onaylandı.`;
          break;
        case 'Hazırlanıyor':
          title = "Sipariş Hazırlanıyor! 🔥";
          message = "Taptaze, nefis meşe kömüründe pişmiş kavurmanız hazırlanmaya başlandı.";
          break;
        case 'Yolda':
          title = "Kuryemiz Yolda! 🛵💨";
          message = "Yemekleriniz sıcaklığını koruyacak termal taşıma kutusuyla yola çıktı!";
          break;
        case 'Teslim Edildi':
          title = "Siparişiniz Teslim Edildi! 🎉";
          message = "Afiyet olsun! Harika lezzet kapınıza ulaştı, özenle teslim edildi.";
          break;
      }

      addToast({
        title,
        message,
        type: 'status_update',
        status: currentStatus,
        duration: 8000
      });

      triggerNativeNotification(title, message);
      playNotificationSound(currentStatus);

      lastStatusRef.current = currentStatus;
    }
  }, [activeOrder?.status]);

  const placeOrder = (details: OrderDetails, total: number, items: CartItem[]) => {
    const orderId = `KVR-${Math.floor(1000 + Math.random() * 9000)}`;
    const order: ActiveOrder = {
      id: orderId,
      items: [...items],
      total,
      details,
      status: 'Alındı',
      createdAt: Date.now()
    };
    
    // Set status reference so status watcher has baseline
    lastStatusRef.current = 'Alındı';

    setActiveOrder(order);
    localStorage.setItem('kavurmaci_active_order', JSON.stringify(order));

    // Toast notification
    addToast({
      title: "Siparişiniz Alındı! 🥩",
      message: `${orderId} referans numarası ile siparişiniz sisteme kaydedildi. Canlı takibi başlatabilirsiniz.`,
      type: 'success',
      duration: 6000
    });

    triggerNativeNotification("Kavurmacı Kadıköy 🥩", `Siparişiniz ${orderId} başarıyla alındı!`);
    playNotificationSound('Alındı');

    // Award loyalty points (10% of total order value!)
    if (loyaltyProfile) {
      const pointsEarned = Math.round(total * 0.1);
      if (pointsEarned > 0) {
        addLoyaltyPoints(pointsEarned, `${orderId} Sipariş Kazancı 🍽️`);
      }
    }
  };

  const cancelActiveOrder = () => {
    if (activeOrder) {
      const newPast: PastOrder = {
        ...activeOrder,
        status: 'İptal Edildi',
        completedAt: Date.now()
      };
      setPastOrders(prev => {
        const updated = [newPast, ...prev];
        localStorage.setItem('kavurmaci_past_orders', JSON.stringify(updated));
        return updated;
      });

      addToast({
        title: "Sipariş İptal Edildi ❌",
        message: `${activeOrder.id} referans numaralı sipariş başarıyla iptal edildi.`,
        type: 'warning',
        duration: 5000
      });
    }
    
    lastStatusRef.current = null;
    setActiveOrder(null);
    localStorage.removeItem('kavurmaci_active_order');
  };

  const completeActiveOrder = () => {
    if (activeOrder) {
      const newPast: PastOrder = {
        ...activeOrder,
        status: 'Teslim Edildi',
        completedAt: Date.now()
      };
      setPastOrders(prev => {
        const updated = [newPast, ...prev];
        localStorage.setItem('kavurmaci_past_orders', JSON.stringify(updated));
        return updated;
      });

      addToast({
        title: "Sipariş Tamamlandı! 🎉",
        message: "Bizleri tercih ettiğiniz için teşekkür ederiz. Değerli geri bildirimlerinizi bekleriz!",
        type: 'success',
        duration: 6000
      });
    }
    
    lastStatusRef.current = null;
    setActiveOrder(null);
    localStorage.removeItem('kavurmaci_active_order');
  };

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === newItem.productId && i.variantId === newItem.variantId);
      if (existing) {
        return prev.map(i => 
          (i.productId === newItem.productId && i.variantId === newItem.variantId)
            ? { ...i, quantity: i.quantity + newItem.quantity } 
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCartItems(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateCartQuantity = (productId: string, variantId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCartItems([]);

  // Admin Actions
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const bulkUpdatePrices = (updates: {productId: string, variantId: string, newPrice: number}[]) => {
    setProducts(prev => prev.map(p => {
      const pUpdates = updates.filter(u => u.productId === p.id);
      if (pUpdates.length === 0) return p;

      const newVariants = p.variants.map(v => {
        const update = pUpdates.find(u => u.variantId === v.id);
        return update ? { ...v, price: update.newPrice } : v;
      });

      return { ...p, variants: newVariants };
    }));
  };

  const recordSale = (total: number, items: CartItem[]) => {
    setReport(prev => ({
      totalOrders: prev.totalOrders + 1,
      totalRevenue: prev.totalRevenue + total,
      topSellingItem: prev.topSellingItem // Simplified logic
    }));
  };

  return (
    <MenuContext.Provider value={{
      products,
      cartItems,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      activeOrder,
      placeOrder,
      cancelActiveOrder,
      completeActiveOrder,
      submittedRatings,
      submitMealRating,
      dismissedRatingOrderIds,
      dismissRating,
      searchQuery,
      setSearchQuery,
      theme,
      toggleTheme,
      loyaltyProfile,
      registerLoyalty,
      claimReward,
      addLoyaltyPoints,
      activeRewards,
      pastOrders,
      clearPastOrders,
      toasts,
      addToast,
      removeToast,
      requestNotificationPermission,
      addProduct,
      updateProduct,
      deleteProduct,
      bulkUpdatePrices,
      report,
      recordSale,
      bookings,
      addBooking,
      cancelBooking
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
};
