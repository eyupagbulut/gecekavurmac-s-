import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  Mail, HardDrive, FileText, Presentation, 
  CheckCircle, AlertCircle, Sparkles, Send, 
  ExternalLink, LogOut, Shield, Key, Loader2,
  FileJson, RefreshCw, Plus, Trash2, Check, Download
} from 'lucide-react';

export const GoogleWorkspacePanel: React.FC = () => {
  const { products, report, submittedRatings, addToast } = useMenu();
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('google_access_token'));
  const [clientId, setClientId] = useState<string>(() => localStorage.getItem('google_client_id') || '548840654087-u3m44sc200g5t8v9k88g76g7a9as96eb.apps.googleusercontent.com'); // Default fallback client ID
  const [activeSubTab, setActiveSubTab] = useState<'gmail' | 'drive' | 'docs' | 'slides'>('gmail');
  const [isLoading, setIsLoading] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  
  // Gmail states
  const [emailTo, setEmailTo] = useState('birdencafe@gmail.com');
  const [emailSubject, setEmailSubject] = useState('Kavurmacı Fikirtepe Günlük Satış Raporu');
  const [emailBody, setEmailBody] = useState('');
  
  // Doc states
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);
  
  // Slides states
  const [createdSlidesUrl, setCreatedSlidesUrl] = useState<string | null>(null);

  // Default Fallback Client ID setup
  useEffect(() => {
    localStorage.setItem('google_client_id', clientId);
  }, [clientId]);

  // Sync access token to localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('google_access_token', accessToken);
    } else {
      localStorage.removeItem('google_access_token');
    }
  }, [accessToken]);

  // Set up OAuth message listener
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const token = event.data.token;
        setAccessToken(token);
        addToast({
          title: "Google Workspace Bağlandı! 🔑",
          message: "Google hesabınız başarıyla yetkilendirildi.",
          type: 'success',
          duration: 4000
        });
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [addToast]);

  // Generate Google Auth URL and open popup
  const handleConnect = () => {
    if (!clientId.trim()) {
      alert("Lütfen geçerli bir Google Client ID girin.");
      return;
    }

    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/presentations'
    ];

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: window.location.origin,
      response_type: 'token',
      scope: scopes.join(' '),
      state: 'kavurmaci_kadikoy_auth'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    // Open in a standard popup window
    const width = 550;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      'google_oauth_popup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      alert("Açılır pencere engelleyici aktif! Lütfen bu site için popuplara izin verin.");
    }
  };

  const handleDisconnect = () => {
    setAccessToken(null);
    setDriveFiles([]);
    setCreatedDocUrl(null);
    setCreatedSlidesUrl(null);
    addToast({
      title: "Bağlantı Kesildi",
      message: "Google Workspace yetkilendirmesi kaldırıldı.",
      type: 'info',
      duration: 3000
    });
  };

  // Helper: Base64Url encode for Gmail
  const makeRawEmail = (to: string, subject: string, htmlContent: string) => {
    const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
    const emailParts = [
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      htmlContent
    ];
    const email = emailParts.join('\r\n');
    return btoa(unescape(encodeURIComponent(email)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  // Pre-generate report content for Gmail
  const loadSalesReportTemplate = () => {
    const todayStr = new Date().toLocaleDateString('tr-TR');
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f3f4f6; border-radius: 16px;">
        <div style="background-color: #18181b; padding: 24px; border-radius: 12px; text-align: center; color: white;">
          <h2 style="margin: 0; color: #f97316; font-size: 24px;">Kavurmacı Fikirtepe</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #a1a1aa;">Günlük İşletme Raporu - ${todayStr}</p>
        </div>
        
        <div style="margin-top: 24px;">
          <h3 style="color: #374151; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">📊 Finansal Özet</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Toplam Ciro:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #10b981;">${report.totalRevenue.toLocaleString('tr-TR')} ₺</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Toplam Sipariş Adedi:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e40af;">${report.totalOrders} Sipariş</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">En Çok Satan Ürün:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #f97316;">${report.topSellingItem || 'Pilav Üstü Kavurma'}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 24px;">
          <h3 style="color: #374151; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">🍖 Güncel Menü & Fiyat Listesi</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
            <tr style="background-color: #f9fafb; text-align: left;">
              <th style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Ürün Adı</th>
              <th style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Varyant (Ağırlık)</th>
              <th style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Fiyat</th>
            </tr>
            ${products.map(p => 
              p.variants.map((v, idx) => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${idx === 0 ? p.name : ''}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">${v.weight}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: bold;">${v.price} ₺</td>
                </tr>
              `).join('')
            ).join('')}
          </table>
        </div>

        <div style="margin-top: 24px; padding: 15px; background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px;">
          <p style="margin: 0; font-size: 12px; color: #c2410c; line-height: 1.6; text-align: center;">
            Bu e-posta Kavurmacı Fikirtepe Yönetici Paneli entegrasyonu kullanılarak otomatik olarak üretilmiş ve gönderilmiştir.
          </p>
        </div>
      </div>
    `;
    setEmailSubject(`Kavurmacı Fikirtepe Günlük Satış Raporu - ${todayStr}`);
    setEmailBody(html);
  };

  const loadFeedbackTemplate = () => {
    const todayStr = new Date().toLocaleDateString('tr-TR');
    const totalFeedbacks = submittedRatings?.length || 0;
    const avgScore = totalFeedbacks > 0 
      ? (submittedRatings.reduce((sum, r) => sum + r.rating, 0) / totalFeedbacks).toFixed(1)
      : '5.0';

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f3f4f6; border-radius: 16px;">
        <div style="background-color: #18181b; padding: 24px; border-radius: 12px; text-align: center; color: white;">
          <h2 style="margin: 0; color: #f59e0b; font-size: 24px;">⭐ Müdavim Lezzet Karnesi Özeti</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #a1a1aa;">Müşteri Geri Bildirim Özet Raporu - ${todayStr}</p>
        </div>

        <div style="margin-top: 24px; display: flex; justify-content: space-around; background-color: #f9fafb; padding: 15px; border-radius: 12px; text-align: center;">
          <div>
            <div style="font-size: 12px; color: #6b7280;">Değerlendirme Sayısı</div>
            <div style="font-size: 20px; font-weight: bold; color: #111827; margin-top: 4px;">${totalFeedbacks} Adet</div>
          </div>
          <div>
            <div style="font-size: 12px; color: #6b7280;">Ortalama Puan</div>
            <div style="font-size: 20px; font-weight: bold; color: #f59e0b; margin-top: 4px;">${avgScore} / 5.0</div>
          </div>
        </div>

        <div style="margin-top: 24px;">
          <h3 style="color: #374151; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">💬 Son Müdavim Yorumları</h3>
          ${submittedRatings && submittedRatings.length > 0 
            ? submittedRatings.map(r => `
              <div style="padding: 12px; border-bottom: 1px solid #f3f4f6;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: bold; font-size: 13px; color: #111827;">Sipariş #${r.orderId}</span>
                  <span style="color: #f59e0b; font-weight: bold;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style="margin: 6px 0 0 0; font-style: italic; font-size: 12px; color: #4b5563;">"${r.feedbackText || 'Yorum bırakılmadı.'}"</p>
                <div style="margin-top: 4px;">
                  ${r.highlights?.map(hl => `<span style="display: inline-block; background-color: #ffedd5; color: #c2410c; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">${hl}</span>`).join('') || ''}
                </div>
              </div>
            `).join('')
            : '<p style="text-align: center; color: #9ca3af; font-size: 13px; padding: 20px 0;">Henüz müşteri geri bildirimi bulunmamaktadır.</p>'
          }
        </div>
      </div>
    `;
    setEmailSubject(`Kavurmacı Fikirtepe Müdavim Karnesi Özeti - ${todayStr}`);
    setEmailBody(html);
  };

  useEffect(() => {
    if (accessToken) {
      loadSalesReportTemplate();
    }
  }, [accessToken]);

  // Actions
  const handleSendEmail = async () => {
    if (!accessToken) return;
    if (!window.confirm("Bu e-postayı Gmail hesabınız üzerinden göndermek istediğinize emin misiniz?")) {
      return;
    }

    setIsLoading(true);
    try {
      const raw = makeRawEmail(emailTo, emailSubject, emailBody);
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      addToast({
        title: "E-Posta Gönderildi! 📧",
        message: `${emailTo} adresine rapor başarıyla ulaştırıldı.`,
        type: 'success',
        duration: 4000
      });
    } catch (err: any) {
      console.error(err);
      alert("E-posta gönderimi sırasında bir hata oluştu: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupToDrive = async () => {
    if (!accessToken) return;
    if (!window.confirm("Kavurmacı Fikirtepe menü ve ciro bilgilerini Google Drive'a yedek dosyası olarak yüklemek istiyor musunuz?")) {
      return;
    }

    setIsLoading(true);
    try {
      const backupData = {
        backupDate: new Date().toISOString(),
        totalRevenue: report.totalRevenue,
        totalOrders: report.totalOrders,
        topSellingItem: report.topSellingItem,
        products: products,
        feedbacks: submittedRatings || []
      };

      const todayStr = new Date().toISOString().split('T')[0];
      const filename = `Kavurmaci_Kadikoy_Yedek_${todayStr}.json`;

      // Google Drive v3 Multipart/Simple upload
      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/related; boundary=foo_bar_boundary'
        },
        body: [
          '--foo_bar_boundary',
          'Content-Type: application/json; charset=UTF-8',
          '',
          JSON.stringify({
            name: filename,
            mimeType: 'application/json',
            description: 'Kavurmacı Fikirtepe otomatik sistem yedekleme dosyası.'
          }),
          '--foo_bar_boundary',
          'Content-Type: application/json',
          '',
          JSON.stringify(backupData, null, 2),
          '--foo_bar_boundary--'
        ].join('\r\n')
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      addToast({
        title: "Yedekleme Tamamlandı! 💾",
        message: `Google Drive'a '${filename}' olarak yüklendi.`,
        type: 'success',
        duration: 4500
      });

      fetchDriveFiles();
    } catch (err: any) {
      console.error(err);
      alert("Yedekleme hatası: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDriveFiles = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch("https://www.googleapis.com/drive/v3/files?pageSize=6&fields=files(id,name,mimeType,webViewLink,iconLink)&orderBy=createdTime%20desc", {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDriveFiles(data.files || []);
      }
    } catch (err) {
      console.error("Error fetching drive files:", err);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchDriveFiles();
    }
  }, [accessToken, activeSubTab]);

  const handleCreateGoogleDoc = async () => {
    if (!accessToken) return;
    if (!window.confirm("Google Docs'ta şık bir 'Günlük İşletme Özeti' rapor dokümanı oluşturulsun mu?")) {
      return;
    }

    setIsLoading(true);
    setCreatedDocUrl(null);
    try {
      const todayStr = new Date().toLocaleDateString('tr-TR');
      // 1. Create empty document
      const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: `Kavurmacı Fikirtepe - Günlük İşletme Raporu (${todayStr})` })
      });

      if (!createRes.ok) throw new Error(await createRes.text());
      const doc = await createRes.json();
      const documentId = doc.documentId;

      // 2. Format styled text batch requests
      const totalFeedbacks = submittedRatings?.length || 0;
      const avgScore = totalFeedbacks > 0 
        ? (submittedRatings.reduce((sum, r) => sum + r.rating, 0) / totalFeedbacks).toFixed(1)
        : '5.0';

      const contentText = 
        `KAVURMACI FİKİRTEPE - GÜNLÜK İŞLETME RAPORU\n` +
        `Rapor Tarihi: ${todayStr}\n\n` +
        `--------------------------------------------------\n\n` +
        `📊 FİNANSAL ÖZET\n` +
        `• Toplam Ciro: ${report.totalRevenue.toLocaleString('tr-TR')} ₺\n` +
        `• Toplam Sipariş Sayısı: ${report.totalOrders} Adet\n` +
        `• Ortalama Sipariş Tutarı: ${(report.totalRevenue / (report.totalOrders || 1)).toFixed(1)} ₺\n` +
        `• En Popüler Lezzet: ${report.topSellingItem || 'Pilav Üstü Kavurma'}\n\n` +
        `⭐️ MÜŞTERİ MEMNUNİYET KARNESİ\n` +
        `• Toplam Geri Bildirim: ${totalFeedbacks} Adet\n` +
        `• Ortalama Müdavim Skoru: ${avgScore} / 5.0 Yıldız\n\n` +
        `🍖 MENÜ DURUMU VE FİYATLANDIRMA\n` +
        products.map(p => `• ${p.name}: ${p.variants.map(v => `${v.weight} (${v.price} ₺)`).join(', ')}`).join('\n') + '\n\n' +
        `📝 MÜŞTERİ YORUMLARI\n` +
        (submittedRatings && submittedRatings.length > 0 
          ? submittedRatings.map(r => `- Sipariş #${r.orderId} [${r.rating}/5 Yıldız]: "${r.feedbackText || 'Yorum yok'}"`).join('\n')
          : '- Henüz bir müşteri geri bildirimi yazılmadı.') + '\n';

      const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                text: contentText,
                location: { index: 1 }
              }
            }
          ]
        })
      });

      if (!updateRes.ok) throw new Error(await updateRes.text());

      const finalUrl = `https://docs.google.com/document/d/${documentId}/edit`;
      setCreatedDocUrl(finalUrl);

      addToast({
        title: "Doküman Oluşturuldu! 📝",
        message: "Google Docs dosyanız başarıyla hazırlandı.",
        type: 'success',
        duration: 5000
      });
    } catch (err: any) {
      console.error(err);
      alert("Döküman oluşturma başarısız: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoogleSlides = async () => {
    if (!accessToken) return;
    if (!window.confirm("Google Slides'ta 'Kavurmacı Fikirtepe Lezzetleri ve Sunumu' slayt destesi oluşturulsun mu?")) {
      return;
    }

    setIsLoading(true);
    setCreatedSlidesUrl(null);
    try {
      const todayStr = new Date().toLocaleDateString('tr-TR');
      // 1. Create empty presentation
      const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: `Kavurmacı Fikirtepe - Slayt Sunumu (${todayStr})` })
      });

      if (!createRes.ok) throw new Error(await createRes.text());
      const slides = await createRes.json();
      const presentationId = slides.presentationId;

      // 2. Add styled slides and content to Slides
      // For slides, we can use batchUpdate to customize shape text, backgrounds etc.
      // We'll perform a simple createSlide and text insertion
      const updateRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            // Create Slide 1 (Intro)
            {
              createSlide: {
                insertionIndex: 1,
                slideLayoutReference: {
                  predefinedLayout: "TITLE"
                },
                placeholderIdBindings: [
                  { layoutPlaceholder: { type: "TITLE" }, objectId: "title_id" },
                  { layoutPlaceholder: { type: "SUBTITLE" }, objectId: "subtitle_id" }
                ]
              }
            },
            // Insert Text into Title
            {
              insertText: {
                objectId: "title_id",
                text: "Kavurmacı Fikirtepe\nEsnaf Usulü Kavurma & Pilav"
              }
            },
            {
              insertText: {
                objectId: "subtitle_id",
                text: `Günlük Lezzet ve Satış Sunumu - Raporlama: ${todayStr}\nCiro: ${report.totalRevenue.toLocaleString('tr-TR')} ₺ | Sipariş: ${report.totalOrders}`
              }
            }
          ]
        })
      });

      if (!updateRes.ok) throw new Error(await updateRes.text());

      const finalUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;
      setCreatedSlidesUrl(finalUrl);

      addToast({
        title: "Sunum Slaytı Hazır! 📊",
        message: "Google Slides sunumunuz başarıyla oluşturuldu.",
        type: 'success',
        duration: 5000
      });
    } catch (err: any) {
      console.error(err);
      alert("Slayt oluşturma başarısız: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
      {/* Workspace Branding Header */}
      <div className="p-6 bg-gradient-to-r from-zinc-900 to-zinc-950 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">Google Workspace Entegrasyon Paneli</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Müdavim verilerinizi Gmail, Drive, Docs ve Slides ile entegre ederek raporlar, dökümanlar ve sunumlar hazırlayın.
          </p>
        </div>

        {accessToken ? (
          <div className="flex items-center gap-3 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-200">Workspace Bağlı</span>
            </div>
            <button 
              onClick={handleDisconnect}
              className="text-zinc-400 hover:text-red-400 p-1 rounded-lg transition"
              title="Bağlantıyı Kes"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700">
              <Key className="w-3.5 h-3.5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Google Client ID" 
                value={clientId} 
                onChange={(e) => setClientId(e.target.value)}
                className="bg-transparent border-none text-[11px] text-zinc-200 focus:outline-none w-48 font-mono"
              />
            </div>
            <button 
              onClick={handleConnect}
              className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-brand-600/10"
            >
              <Shield className="w-4 h-4" />
              Google ile Yetkilendir
            </button>
          </div>
        )}
      </div>

      {!accessToken ? (
        <div className="p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand-600">
            <Shield className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-800">Workspace Bağlantısı Gerekli</h3>
            <p className="text-sm text-gray-500">
              Menü yedeklerini Drive'a yüklemek, satış raporlarını e-posta ile göndermek veya Google Doküman / Slayt hazırlamak için güvenli Google yetkilendirmesini tamamlamanız gerekir.
            </p>
          </div>
          <div className="pt-2">
            <button 
              onClick={handleConnect}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md transition"
            >
              <Shield className="w-4 h-4" /> Google Hesabını Bağla
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Sub Navigation */}
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50 p-4 space-y-1">
            <button 
              onClick={() => setActiveSubTab('gmail')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition font-medium text-sm ${activeSubTab === 'gmail' ? 'bg-white shadow-sm text-brand-600 border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Gmail (E-Posta Raporu)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            </button>

            <button 
              onClick={() => setActiveSubTab('drive')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition font-medium text-sm ${activeSubTab === 'drive' ? 'bg-white shadow-sm text-brand-600 border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4" />
                <span>Google Drive (Yedekleme)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </button>

            <button 
              onClick={() => setActiveSubTab('docs')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition font-medium text-sm ${activeSubTab === 'docs' ? 'bg-white shadow-sm text-brand-600 border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Google Docs (Döküman)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </button>

            <button 
              onClick={() => setActiveSubTab('slides')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition font-medium text-sm ${activeSubTab === 'slides' ? 'bg-white shadow-sm text-brand-600 border border-gray-100' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-2.5">
                <Presentation className="w-4 h-4" />
                <span>Google Slides (Slayt)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6">
            {activeSubTab === 'gmail' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-lg">Gmail ile Otomatik Satış Raporu</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Enfes kavurma siparişlerinizi ve ciro durumunuzu dilediğiniz e-posta adresine anında gönderin.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={loadSalesReportTemplate}
                      className="bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 border border-brand-100/50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Finansal Şablonu Yükle
                    </button>
                    <button 
                      onClick={loadFeedbackTemplate}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 border border-amber-100/50"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Müdavim Karne Şablonu
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Alıcı E-Posta Adresi</label>
                      <input 
                        type="email" 
                        value={emailTo} 
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="w-full p-3 border border-gray-100 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Örn: yonetici@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">E-Posta Konusu</label>
                      <input 
                        type="text" 
                        value={emailSubject} 
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full p-3 border border-gray-100 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="E-posta konusunu girin..."
                      />
                    </div>
                    <div className="pt-3">
                      <button 
                        onClick={handleSendEmail}
                        disabled={isLoading || !emailTo}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-200 text-white font-extrabold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-brand-600/10"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Gmail Üzerinden Gönder
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">E-Posta İçerik Önizleme (HTML)</label>
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 h-64 overflow-y-auto text-xs prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: emailBody || '<p class="text-gray-400 italic">E-posta şablonu yükleniyor...</p>' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'drive' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-lg">Google Drive Entegrasyonu</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Menü varyantlarını, ciro ve müdavim listelerinizi güvenli şekilde Drive'a aktarın.</p>
                  </div>
                  <button 
                    onClick={handleBackupToDrive}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-blue-600/10"
                  >
                    <Download className="w-4 h-4" /> Menüyü Drive'a Yedekle (.json)
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-blue-500" /> Google Drive'daki Son Dosyalarınız
                  </h4>
                  {driveFiles.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs text-gray-400">Drive'da henüz bu uygulama ile yüklenen veya düzenlenen dosya bulunamadı.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {driveFiles.map((file) => (
                        <div key={file.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center hover:bg-gray-100/50 transition">
                          <div className="flex items-center gap-3 truncate">
                            {file.mimeType?.includes('json') ? (
                              <FileJson className="w-8 h-8 text-blue-500 shrink-0" />
                            ) : file.mimeType?.includes('document') ? (
                              <FileText className="w-8 h-8 text-indigo-500 shrink-0" />
                            ) : (
                              <Presentation className="w-8 h-8 text-yellow-500 shrink-0" />
                            )}
                            <div className="truncate">
                              <p className="text-xs font-bold text-gray-800 truncate">{file.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{file.mimeType?.split('.').pop()}</p>
                            </div>
                          </div>
                          <a 
                            href={file.webViewLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-brand-600 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSubTab === 'docs' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-extrabold text-gray-800 text-lg">Google Docs Doküman Raporlayıcı</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Ciro durumunu ve müdavim lezzet karnelerini otomatik olarak formatlı bir Google Dokümanı olarak yazın.</p>
                </div>

                <div className="max-w-md space-y-4">
                  <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl text-left space-y-3">
                    <h4 className="font-extrabold text-indigo-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Akıllı Şablon İçeriği
                    </h4>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      Doküman oluşturulduğunda sistem güncel satış verilerini, porsiyon fiyat listelerini ve son müşteri geri bildirimlerini başlıklar ve listeler halinde biçimlendirerek doğrudan dokümana ekleyecektir.
                    </p>
                  </div>

                  <button 
                    onClick={handleCreateGoogleDoc}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white font-extrabold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/10"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    Günlük Rapor Dokümanı Oluştur
                  </button>

                  {createdDocUrl && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-emerald-800">Döküman Başarıyla Hazırlandı!</p>
                          <p className="text-[10px] text-emerald-600">Dokümanı Google Docs'ta açıp düzenleyebilirsiniz.</p>
                        </div>
                      </div>
                      <a 
                        href={createdDocUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition"
                      >
                        Aç <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSubTab === 'slides' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-extrabold text-gray-800 text-lg">Google Slides Slayt Sunumu Oluşturucu</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Kavurmacı Fikirtepe menü vitrini ve günlük satış başarılarını şık bir Google Slayt destesi olarak kaydedin.</p>
                </div>

                <div className="max-w-md space-y-4">
                  <div className="p-5 bg-yellow-50 border border-yellow-100 rounded-3xl text-left space-y-3">
                    <h4 className="font-extrabold text-yellow-900 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Otomatik Slayt Tasarımı
                    </h4>
                    <p className="text-xs text-yellow-800 leading-relaxed">
                      Slayt şablonu; başlık sayfasını, ciro durumunu ve müdavim lezzet özetlerini büyük yazı fontlarıyla modern bir slayt destesi şeklinde sunar. Akıllı ekranlarda veya sunumlarda paylaşmak için idealdir.
                    </p>
                  </div>

                  <button 
                    onClick={handleCreateGoogleSlides}
                    disabled={isLoading}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 text-white font-extrabold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition shadow-md shadow-yellow-500/10"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Presentation className="w-4 h-4" />}
                    Sunum Slaytı Hazırla
                  </button>

                  {createdSlidesUrl && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-emerald-800">Sunum Slaytı Başarıyla Hazırlandı!</p>
                          <p className="text-[10px] text-emerald-600">Slaytı Google Slides üzerinde açabilirsiniz.</p>
                        </div>
                      </div>
                      <a 
                        href={createdSlidesUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition"
                      >
                        Aç <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
