import { Product } from './types';
import PILAV_KAVURMA_IMG from './src/assets/images/pilav_kavurma_1781715948644.jpg';
import EKMEK_ARASI_IMG from './src/assets/images/ekmek_arasi_kavurma_1781715918742.jpg';
import KAVURMA_PORSIYON_IMG from './src/assets/images/sade_kavurma_1781715933469.jpg';
import MENU_DRINK_IMG from './src/assets/images/menu_drink_1781715963995.jpg';

// Using high-quality generated images to represent the menu items visually
const IMAGES = {
  PILAV_KAVURMA: PILAV_KAVURMA_IMG,
  EKMEK_ARASI: EKMEK_ARASI_IMG,
  KAVURMA_PORSIYON: KAVURMA_PORSIYON_IMG,
  MENU_DRINK: MENU_DRINK_IMG,
};

export const INITIAL_MENU: Product[] = [
  {
    id: 'ekmek-arasi-kavurma',
    name: 'Ekmek Arası',
    description: 'Taze çıtır ekmek arasında özel baharatlarla harmanlanmış geleneksel dana kavurma.',
    image: IMAGES.EKMEK_ARASI,
    category: 'ekmek',
    variants: [
      { id: 'ek-100', weight: '100 gr', price: 400 },
      { id: 'ek-150', weight: '150 gr', price: 550 },
      { id: 'ek-200', weight: '200 gr', price: 700 },
    ]
  },
  {
    id: 'sade-kavurma',
    name: 'Kavurma',
    description: 'Pilavsız, saf lezzet arayanlar için tabakta sade dana kavurma.',
    image: IMAGES.KAVURMA_PORSIYON,
    category: 'porsiyon',
    variants: [
      { id: 'kp-100', weight: '100 gr', price: 400 },
      { id: 'kp-150', weight: '150 gr', price: 550 },
      { id: 'kp-200', weight: '200 gr', price: 700 },
    ]
  },
  {
    id: 'pilav-kavurma',
    name: 'Pilav Kavurma',
    description: 'Tereyağlı leziz pirinç pilavı üzerinde lokum kıvamında dana kavurma.',
    image: IMAGES.PILAV_KAVURMA,
    category: 'pilav',
    variants: [
      { id: 'pk-100', weight: '100 gr', price: 500 },
      { id: 'pk-150', weight: '150 gr', price: 650 },
      { id: 'pk-200', weight: '200 gr', price: 800 },
    ]
  },
  {
    id: 'avantajli-menuler',
    name: 'Avantajlı Menüler',
    description: 'Buz gibi serinletici içecek ve lezzetli kavurmanın bir araya geldiği doyurucu menüler.',
    image: IMAGES.MENU_DRINK,
    category: 'menu',
    variants: [
      { id: 'menu-ek-100', weight: 'Ekmek Arası 100 gr + İçecek', price: 450 },
      { id: 'menu-p-100', weight: 'Pilav Üstü 100 gr + İçecek', price: 550 },
      { id: 'menu-p-200', weight: 'Pilav Üstü 200 gr + İçecek', price: 850 },
    ]
  }
];

export const SERVICE_AREAS = ['Fikirtepe', 'Dumlupınar'];

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