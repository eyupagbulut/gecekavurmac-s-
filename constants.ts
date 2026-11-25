import { Product } from './types';
import PILAV_KAVURMA_IMG from './src/assets/images/pilav_ustu_kavurma_new_v2_1784501731312.jpg';
import PILAV_KAVURMA_ALT1 from './src/assets/images/pilav_ustu_kavurma_1784498341653.jpg';
import PILAV_KAVURMA_ALT2 from './src/assets/images/pilav_kavurma_1781715948644.jpg';

import EKMEK_ARASI_IMG from './src/assets/images/ekmek_arasi_no_peppers_1784501761947.jpg';
import EKMEK_ARASI_ALT1 from './src/assets/images/ekmek_arasi_kavurma_1781715918742.jpg';
import EKMEK_ARASI_ALT2 from './src/assets/images/ekmek_arasi_new_1784500774238.jpg';

import KAVURMA_PORSIYON_IMG from './src/assets/images/sade_kavurma_no_peppers_1784501747512.jpg';
import SADE_KAVURMA_ALT1 from './src/assets/images/sade_kavurma_new_1784500788937.jpg';
import SADE_KAVURMA_ALT2 from './src/assets/images/sade_kavurma_1781715933469.jpg';

import MENU_DRINK_IMG from './src/assets/images/pilav_ustu_kavurma_icecek_1784498357074.jpg';
import MENU_ALT1 from './src/assets/images/menu_drink_1781715963995.jpg';

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
    gallery: [
      EKMEK_ARASI_IMG,
      EKMEK_ARASI_ALT1,
      EKMEK_ARASI_ALT2,
      'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Özel Dinlendirilmiş Yerli Dana Eti (%100 Dana)',
      'Günlük Taş Fırın Çıtır Ekmek',
      'Doğal Kavurma İç Yağı & Sızma Zeytinyağı',
      'Doğal Deniz Tuzu & Taze Çekilmiş Karabiber',
      'Ağır Ateşte Mühürlenmiş Et Suyu'
    ],
    ingredientStory: 'Taş fırından taptaze ve sıcak çıkan çıtır ekmeğimiz, bakır kazanlarda 6 saat kısık ateşte kendi lezzetli yağında ağır ağır demlenmiş lokum gibi dana kavurma ile doldurulur. Katkı maddesi ve koruyucu içermez.',
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
    gallery: [
      KAVURMA_PORSIYON_IMG,
      SADE_KAVURMA_ALT1,
      SADE_KAVURMA_ALT2,
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      '%100 Dinlendirilmiş Dana Tranch & Kontrfile',
      'Geleneksel Özel Kavurma Yağı',
      'Saf Deniz Tuzu',
      'Karabiber & Özel Baharat Karışımı'
    ],
    ingredientStory: 'Hiçbir dolgu ve katkı maddesi olmadan, katıksız %100 öz dana etinin lokum gibi kıvamı. Bakır tencerelerde mühürlenip kısık ateşte pişirilerek zengin protein ve yüksek lezzet sunar.',
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
    gallery: [
      PILAV_KAVURMA_IMG,
      PILAV_KAVURMA_ALT1,
      PILAV_KAVURMA_ALT2,
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      '1. Sınıf Yerli Gönen Baldo Pirinç',
      'Halis Trabzon Yayık Tereyağı',
      'Özel Kısık Ateş Lokum Dana Kavurma',
      'Lezzetli Et Suyu Bulyonsuz Demleme'
    ],
    ingredientStory: 'Tereyağ kokulu, tane tane dökülen demlenmiş Baldo pirinç pilavı üzerine sıcacık servis edilen leziz dana kavurmamız Gece Kavurmacısının en çok tercih edilen imza tabağıdır.',
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
    gallery: [
      MENU_DRINK_IMG,
      MENU_ALT1,
      PILAV_KAVURMA_ALT1,
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Sıcak Kavurma veya Pilav Üstü Kavurma Porsiyonu',
      'Buz Gibi Bol Köpüklü Ayran / Kutu Meşrubat',
      'Sıcak Taş Fırın Çıtır Ekmek',
      'Kıtır Biber & Turşu Garnitürü'
    ],
    ingredientStory: 'Günün ve gecenin her saatinde lezzet krizlerinizi tek pakette çözen doyurucu menü kombosu. Seçiminize göre buz gibi soğuk içeceği ile servis edilir.',
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