
import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LoveUnlock',
  description:
    'Answer daily questions to unlock a special song for your loved one!',
  manifest: '/manifest.json', // Link to the Web App Manifest
  applicationName: 'LoveUnlock',
  appleWebApp: {
    capable: true, // Enables PWA features on iOS
    statusBarStyle: 'default', // Can be 'black', 'black-translucent'
    title: 'LoveUnlock', // Title shown when added to home screen
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.svg', type: 'image/svg+xml', sizes: '192x192' },
      { url: '/icons/icon-512x512.svg', type: 'image/svg+xml', sizes: '512x512' },
    ],
    apple: [
      // Recommended: A 180x180 PNG icon is often preferred for iOS.
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      // Fallback or other specific sizes using existing SVGs
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
  other: {
    'msapplication-tap-highlight': 'no', // Disables the tap highlight on Windows Phone
  }
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover', // Essential for safe-area-inset-* to work
  themeColor: '#FFC0CB', // Matches manifest theme_color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable}`}>
      <body className="antialiased flex flex-col min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <AuthProvider>
          <main className="flex-grow overflow-y-auto">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
