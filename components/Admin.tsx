import React, { useState, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import { Product, ProductVariant } from '../types';
import { 
  LayoutDashboard, Package, Settings, LogOut, 
  TrendingUp, Users, DollarSign, Edit, Trash2, 
  Plus, Save, Upload, Image as ImageIcon, X,
  Star, MessageSquare, ThumbsUp, ThumbsDown
} from 'lucide-react';

interface AdminProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'bulk-edit' | 'feedback'>('dashboard');
  const { products, deleteProduct, addProduct, updateProduct, bulkUpdatePrices, report, submittedRatings } = useMenu();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bulk Edit State
  const [bulkPrices, setBulkPrices] = useState<{[key: string]: string}>({});

  const handleBulkChange = (productId: string, variantId: string, val: string) => {
    setBulkPrices(prev => ({ ...prev, [`${productId}-${variantId}`]: val }));
  };

  const saveBulkPrices = () => {
    const updates: {productId: string, variantId: string, newPrice: number}[] = [];
    Object.entries(bulkPrices).forEach(([key, value]) => {
      const [pId, vId] = key.split('-');
      const price = parseFloat(value as string);
      if (!isNaN(price)) {
        updates.push({ productId: pId, variantId: vId, newPrice: price });
      }
    });
    bulkUpdatePrices(updates);
    setBulkPrices({});
    alert("Fiyatlar güncellendi!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Yönetici Paneli</h2>
          <p className="text-xs text-gray-500">Kavurmacı Kadıköy</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <LayoutDashboard size={20} />
            <span>Genel Bakış</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'products' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Package size={20} />
            <span>Ürün Yönetimi</span>
          </button>
          <button 
            onClick={() => setActiveTab('bulk-edit')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'bulk-edit' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <DollarSign size={20} />
            <span>Toplu Fiyat</span>
          </button>
          <button 
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'feedback' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <MessageSquare size={20} />
            <span>Geri Bildirimler</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 p-2">
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'dashboard' && 'Genel Bakış & Raporlar'}
            {activeTab === 'products' && 'Ürünleri Düzenle'}
            {activeTab === 'bulk-edit' && 'Toplu Fiyat Güncelleme'}
            {activeTab === 'feedback' && 'Müdavim Lezzet Karneleri & Geri Bildirimler'}
          </h1>
          <div className="text-sm text-gray-500">Admin: Yetkili</div>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Toplam Ciro</p>
                    <h3 className="text-3xl font-bold text-gray-900">{report.totalRevenue.toLocaleString('tr-TR')} ₺</h3>
                  </div>
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <TrendingUp size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Toplam Sipariş</p>
                    <h3 className="text-3xl font-bold text-gray-900">{report.totalOrders}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Package size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">En Çok Satan</p>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{report.topSellingItem}</h3>
                  </div>
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                    <Users size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-end mb-6">
                <button 
                  onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                  className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-700"
                >
                  <Plus size={20} /> Ürün Ekle
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-gray-600">Ürün</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Kategori</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">Varyantlar</th>
                      <th className="p-4 text-sm font-semibold text-gray-600">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-gray-200" alt={p.name} />
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{p.description}</div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600 capitalize">{p.category}</td>
                        <td className="p-4 text-sm text-gray-600">
                          {p.variants.map(v => `${v.weight} (${v.price}₺)`).join(', ')}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                            <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bulk-edit' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex justify-between items-center mb-6">
                 <p className="text-gray-500">Tüm ürünlerin fiyatlarını buradan hızlıca değiştirebilirsiniz.</p>
                 <button onClick={saveBulkPrices} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                   <Save size={18} /> Kaydet
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <img src={p.image} className="w-8 h-8 rounded object-cover" />
                        {p.name}
                      </h3>
                      <div className="space-y-3">
                        {p.variants.map(v => (
                          <div key={v.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{v.weight}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">Mevcut: {v.price}₺</span>
                              <input 
                                type="number" 
                                placeholder={v.price.toString()}
                                value={bulkPrices[`${p.id}-${v.id}`] || ''}
                                onChange={(e) => handleBulkChange(p.id, v.id, e.target.value)}
                                className="w-24 p-1 border border-gray-300 rounded text-right"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Toplam Geri Bildirim</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{submittedRatings?.length || 0} Adet</h3>
                  </div>
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                    <MessageSquare size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Ortalama Lezzet Puanı</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <h3 className="text-3xl font-bold text-gray-900">
                        {submittedRatings && submittedRatings.length > 0 
                          ? (submittedRatings.reduce((sum, r) => sum + r.rating, 0) / submittedRatings.length).toFixed(1)
                          : '5.0'}
                      </h3>
                      <Star size={20} className="fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                    <Star size={24} className="fill-amber-400" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Müşteri Memnuniyet Oranı</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-1">
                      {submittedRatings && submittedRatings.length > 0
                        ? `${Math.round((submittedRatings.filter(r => r.rating >= 4).length / submittedRatings.length) * 100)}%`
                        : '100%'}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <ThumbsUp size={24} />
                  </div>
                </div>
              </div>

              {/* Feedbacks list */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100 text-left">
                  <h3 className="font-bold text-gray-800 text-base">Gelen Lezzet Geri Bildirimleri</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Sipariş sonrası 15. dakikada müşterilerimiz tarafından doldurulan karne detayları.</p>
                </div>

                {!submittedRatings || submittedRatings.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                      <MessageSquare size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-700">Henüz Değerlendirme Yok</p>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto">Sipariş verildikten ve teslim edildikten 15 dakika sonra müşterilerimizin doldurduğu formlar burada listelenecektir.</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 text-left">
                    {submittedRatings.map((item, index) => (
                      <div key={index} className="p-6 space-y-4">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Sipariş: #{item.orderId}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex text-amber-400">
                                {Array.from({ length: 5 }).map((_, starIdx) => (
                                  <Star 
                                    key={starIdx} 
                                    size={16} 
                                    className={starIdx < item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} 
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-gray-500">
                                ({item.rating} / 5 Yıldız)
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400">
                              Değerlendirme Tarihi: {new Date(item.createdAt).toLocaleString('tr-TR')}
                            </p>
                          </div>

                          {/* Highlights */}
                          {item.highlights && item.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 justify-end">
                              {item.highlights.map((hl, hlIdx) => (
                                <span key={hlIdx} className="text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100/50 px-2 py-0.5 rounded-lg">
                                  {hl}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Customer feedback text */}
                        {item.feedbackText ? (
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-700 font-medium">
                            "{item.feedbackText}"
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Müşteri özel bir yorum bırakmadı.</p>
                        )}

                        {/* Item breakdowns */}
                        {item.itemsFeedback && Object.keys(item.itemsFeedback).length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Porsiyon Bazlı Memnuniyet</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(item.itemsFeedback).map(([key, val]) => (
                                <div key={key} className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg border border-gray-100 text-xs">
                                  <span className="font-semibold text-gray-700 truncate mr-3">{val.name}</span>
                                  {val.liked ? (
                                    <span className="flex items-center gap-1 text-green-600 font-bold text-[10px] bg-green-50 px-1.5 py-0.5 rounded">
                                      <ThumbsUp size={11} /> Lezzetli
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-red-600 font-bold text-[10px] bg-red-50 px-1.5 py-0.5 rounded">
                                      <ThumbsDown size={11} /> Geliştirilmeli
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSave={(p) => {
            if (editingProduct) updateProduct(p);
            else addProduct(p);
            setIsModalOpen(false);
          }} 
        />
      )}
    </div>
  );
};

// Simple Login Screen
export const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin123') {
      onLogin();
    } else {
      alert("Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Yönetici Girişi</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
            <input type="text" value={user} onChange={e => setUser(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700">Giriş Yap</button>
        </form>
        <div className="mt-4 text-center text-xs text-gray-400">
           Maksimum 2 oturum izni.
        </div>
      </div>
    </div>
  );
}

// Modal for Adding/Editing Product
const ProductModal: React.FC<{ product: Product | null, onClose: () => void, onSave: (p: Product) => void }> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Product>(product || {
    id: Date.now().toString(),
    name: '',
    description: '',
    image: '',
    category: 'pilav',
    variants: [{ id: 'v1', weight: '100 GR', price: 0 }]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantChange = (idx: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[idx] = { ...newVariants[idx], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { id: Date.now().toString(), weight: '', price: 0 }] });
  };

  const removeVariant = (idx: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== idx) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">{product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Ürün Adı</label>
               <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Kategori</label>
               <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full p-2 border rounded">
                 <option value="pilav">Pilav</option>
                 <option value="ekmek">Ekmek Arası</option>
                 <option value="porsiyon">Porsiyon</option>
                 <option value="menu">Menü</option>
               </select>
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" rows={2} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Resim</label>
            <div className="flex items-center gap-4">
              {formData.image && <img src={formData.image} className="w-20 h-20 object-cover rounded-lg border" />}
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Upload size={18} /> Bilgisayardan Yükle
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold">Varyantlar & Fiyatlar</label>
              <button onClick={addVariant} type="button" className="text-brand-600 text-sm hover:underline">+ Varyant Ekle</button>
            </div>
            {formData.variants.map((v, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input placeholder="Gramaj / İsim" value={v.weight} onChange={e => handleVariantChange(idx, 'weight', e.target.value)} className="flex-1 p-2 border rounded" />
                <input type="number" placeholder="Fiyat" value={v.price} onChange={e => handleVariantChange(idx, 'price', parseFloat(e.target.value))} className="w-24 p-2 border rounded" />
                <button onClick={() => removeVariant(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">İptal</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Kaydet</button>
        </div>
      </div>
    </div>
  );
};