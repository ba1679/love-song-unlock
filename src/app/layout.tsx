
import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The song, Our story - Daily Song Puzzles',
  description:
    'Answer daily questions to unlock a special song for your loved one!',
  manifest: '/manifest.json', // Link to the Web App Manifest
  applicationName: 'The song, Our story',
  appleWebApp: {
    capable: true, // Enables PWA features on iOS
    statusBarStyle: 'default', // Can be 'black', 'black-translucent'
    title: 'The song, Our story', // Title shown when added to home screen
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    // General icons (favicon, etc.)
    icon: [
      { url: '/icons/icon-192x192.svg', type: 'image/svg+xml', sizes: '192x192' },
      { url: '/icons/icon-512x512.svg', type: 'image/svg+xml', sizes: '512x512' },
    ],
    // Apple specific icons (for "Add to Home Screen")
    apple: [
      // Recommended: A 180x180 PNG icon is often preferred for iOS.
      // The user should create this file and place it in public/icons/apple-touch-icon.png
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      // Fallback or other specific sizes using existing SVGs
      { url: '/icons/icon-192x192.svg', type: 'image/svg+xml' }, // Default/fallback without specific size
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    // You can add other specific icon types if needed (e.g., shortcut, other)
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
      {/* The <head> tag is now automatically managed by Next.js via the metadata object */}
      <body className="antialiased flex flex-col min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
