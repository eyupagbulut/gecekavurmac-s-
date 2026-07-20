import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Quick OAuth Popup Callback Interceptor
if (window.opener && window.location.hash.includes('access_token=')) {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');
  
  if (token) {
    window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', token }, window.location.origin);
  }

  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #09090b; color: white; text-align: center; padding: 20px;">
        <div style="font-size: 48px; margin-bottom: 16px; animation: scale 1s ease-in-out infinite alternate;">🍖</div>
        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 8px; color: #f97316;">Kavurmacı Fikirtepe</h2>
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">Workspace Bağlantısı Başarılı!</h3>
        <p style="color: #a1a1aa; font-size: 13px; max-width: 320px; line-height: 1.5;">Yetkilendirme tamamlandı. Verileriniz güvenle eşitleniyor. Bu pencere otomatik olarak kapanacaktır.</p>
        <button onclick="window.close()" style="margin-top: 24px; background-color: #f97316; hover:background-color: #ea580c; color: white; border: none; padding: 10px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s;">Pencereyi Kapat</button>
      </div>
    `;
  }
  
  setTimeout(() => {
    window.close();
  }, 1200);
} else {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
