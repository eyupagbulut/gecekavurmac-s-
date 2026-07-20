import { Product } from './types';
import PILAV_KAVURMA_IMG from './src/assets/images/pilav_ustu_kavurma_new_v2_1784501731312.jpg';
import EKMEK_ARASI_IMG from './src/assets/images/ekmek_arasi_no_peppers_1784501761947.jpg';
import KAVURMA_PORSIYON_IMG from './src/assets/images/sade_kavurma_no_peppers_1784501747512.jpg';
import MENU_DRINK_IMG from './src/assets/images/pilav_ustu_kavurma_icecek_1784498357074.jpg';
import LOGO_IMG from './src/assets/images/gece_kavurmacisi_logo_1784498372590.jpg';

// Using high-quality generated images to represent the menu items visually
const IMAGES = {
  PILAV_KAVURMA: PILAV_KAVURMA_IMG,
  EKMEK_ARASI: EKMEK_ARASI_IMG,
  KAVURMA_PORSIYON: KAVURMA_PORSIYON_IMG,
  MENU_DRINK: MENU_DRINK_IMG,
  LOGO: LOGO_IMG,
};

export { LOGO_IMG };

export const INITIAL_MENU: Product[] = [
  {
    id: 'ekmek-arasi-kavurma',
    name: 'Ekmek Arası',
    description: 'Taze çıtır ekmek arasında özel baharatlarla harmanlanmış geleneksel dana kavurma.',
    image: IMAGES.EKMEK_ARASI,
    category: 'ekmek',
    variants: [
      { id: 'ek-100', weight: '100 gr', price: 400, calories: 540, protein: 37 },
      { id: 'ek-150', weight: '150 gr', price: 550, calories: 670, protein: 51 },
      { id: 'ek-200', weight: '200 gr', price: 700, calories: 800, protein: 65 },
    ]
  },
  {
    id: 'sade-kavurma',
    name: 'Kavurma',
    description: 'Pilavsız, saf lezzet arayanlar için tabakta sade dana kavurma.',
    image: IMAGES.KAVURMA_PORSIYON,
    category: 'porsiyon',
    variants: [
      { id: 'kp-100', weight: '100 gr', price: 400, calories: 260, protein: 28 },
      { id: 'kp-150', weight: '150 gr', price: 550, calories: 390, protein: 42 },
      { id: 'kp-200', weight: '200 gr', price: 700, calories: 520, protein: 56 },
    ]
  },
  {
    id: 'pilav-kavurma',
    name: 'Pilav Üstü Kavurma',
    description: 'Tereyağlı leziz pirinç pilavı üzerinde lokum kıvamında dana kavurma.',
    image: IMAGES.PILAV_KAVURMA,
    category: 'pilav',
    variants: [
      { id: 'pk-100', weight: '100 gr', price: 500, calories: 620, protein: 33 },
      { id: 'pk-150', weight: '150 gr', price: 650, calories: 750, protein: 47 },
      { id: 'pk-200', weight: '200 gr', price: 800, calories: 880, protein: 61 },
    ]
  },
  {
    id: 'avantajli-menuler',
    name: 'Avantajlı Menüler',
    description: 'Buz gibi serinletici içecek ve lezzetli kavurmanın bir araya geldiği doyurucu menüler.',
    image: IMAGES.MENU_DRINK,
    category: 'menu',
    variants: [
      { id: 'menu-ek-100', weight: 'Ekmek Arası 100 gr + İçecek', price: 450, calories: 680, protein: 37 },
      { id: 'menu-p-100', weight: 'Pilav Üstü 100 gr + İçecek', price: 550, calories: 760, protein: 33 },
      { id: 'menu-p-200', weight: 'Pilav Üstü 200 gr + İçecek', price: 850, calories: 1020, protein: 61 },
    ]
  }
];

export const SERVICE_AREAS = ['Fikirtepe', 'Merdivenköy'];

export const PAYMENT_METHODS = [
  'Nakit',
  'Kredi Kartı',
  'Sodexo',
  'Multinet',
  'Setcard',
  'Edenred',
  'Token Flex',
  'Metropol'
];