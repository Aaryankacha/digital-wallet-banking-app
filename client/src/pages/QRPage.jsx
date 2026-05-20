import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/common/Navbar.jsx';

export default function QRPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  // Generate deep-link url for direct pre-filled sending
  const qrValue = `${window.location.origin}/send?to=${encodeURIComponent(user?.email || '')}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user?.email || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    // Create serializable copy of SVG
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    // Convert SVG to canvas to save as PNG
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      // Clean background
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw image
      context.drawImage(image, 32, 32, 448, 448);
      
      // Download link
      const pngURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngURL;
      downloadLink.download = `${user?.name || 'wallet'}_PayWave_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    image.src = blobURL;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Your Wallet QR Code 📱</h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Show this QR code to others to receive payments instantly.
          </p>
        </div>

        {/* QR Card */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-xl transition-all dark:border-dark-border dark:bg-dark-card">
          {/* Subtle glow effect */}
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-brand-600/10 blur-3xl" />

          {/* Name & Wallet Brand */}
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">PayWave Personal QR</span>
            <h2 className="mt-1 text-xl font-bold">{user?.name}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{user?.email}</p>
          </div>

          {/* QR Container */}
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-dark-border" ref={qrRef}>
            {user?.email ? (
              <QRCodeSVG
                value={qrValue}
                size={220}
                bgColor="#FFFFFF"
                fgColor="#0F172A"
                level="Q"
                includeMargin={false}
              />
            ) : (
              <div className="h-48 w-48 animate-pulse rounded bg-gray-100 dark:bg-dark-border" />
            )}
          </div>

          {/* Prompt */}
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            Scanning this QR will automatically open the Send Money page with your email pre-filled.
          </p>

          {/* Action buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold hover:bg-gray-100 dark:border-dark-border dark:bg-dark-border/40 dark:hover:bg-dark-border/80 transition-colors"
            >
              {copied ? '✅ Copied!' : '📋 Copy Email'}
            </button>
            <button
              onClick={downloadQR}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all active:scale-95"
            >
              📥 Save PNG
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
