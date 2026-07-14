export interface ProductVariant {
  weight: string; // e.g., "100 GR"
  price: number;
  id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'pilav' | 'ekmek' | 'porsiyon' | 'menu';
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

export type PaymentMethod = 
  | 'Nakit' 
  | 'Kredi Kartı' 
  | 'Sodexo' 
  | 'Multinet' 
  | 'Setcard' 
  | 'Edenred' 
  | 'Token Flex' 
  | 'Metropol';

export interface OrderDetails {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  neighborhood: 'Fikirtepe' | 'Dumlupınar' | 'Diğer';
  note?: string;
  paymentMethod: PaymentMethod;
}

export interface SalesReport {
  totalOrders: number;
  totalRevenue: number;
  topSellingItem: string;
}

export type OrderStatus = 'Alındı' | 'Hazırlanıyor' | 'Yolda' | 'Teslim Edildi';

export interface ActiveOrder {
  id: string;
  items: CartItem[];
  total: number;
  details: OrderDetails;
  status: OrderStatus;
  createdAt: number;
}

export interface PastOrder {
  id: string;
  items: CartItem[];
  total: number;
  details: OrderDetails;
  status: 'Teslim Edildi' | 'İptal Edildi';
  createdAt: number;
  completedAt: number;
}

export interface LoyaltyHistoryItem {
  id: string;
  type: 'kazanç' | 'harcama';
  amount: number;
  description: string;
  timestamp: number;
}

export interface LoyaltyProfile {
  fullName: string;
  phone: string;
  email?: string;
  points: number;
  totalEarned: number;
  history: LoyaltyHistoryItem[];
  membershipTier: 'Bronz' | 'Gümüş' | 'Altın' | 'Platin';
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  code: string;
  isClaimed: boolean;
  iconType: 'ayran' | 'indirim' | 'pilav' | 'ekmek';
}

export interface MealRating {
  orderId: string;
  rating: number; // 1 to 5 stars
  feedbackText: string;
  highlights: string[]; // e.g., 'Lezzet', 'Sıcaklık', 'Hızlı Servis'
  itemsFeedback: {
    [productIdAndVariantId: string]: {
      name: string;
      liked: boolean;
    };
  };
  createdAt: number;
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'status_update';
  status?: string;
  duration?: number;
}

export interface TableBooking {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  notes?: string;
  status: 'Beklemede' | 'Onaylandı' | 'İptal Edildi';
  createdAt: number;
}


