import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'NEXALORA Demo — Platform Eksplorasi Jurusan & Karier Mandiri',
  robots: { index: false, follow: false },
  description: 'Rasakan belajarnya lewat cuplikan mini-kuliah nyata, pertimbangkan pilihannya secara transparan, dan rencanakan langkah berikutnya.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-canvas text-text-primary antialiased min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
