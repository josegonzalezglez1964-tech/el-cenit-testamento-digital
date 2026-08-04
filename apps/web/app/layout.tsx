import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { SessionProvider } from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-merriweather' });

export const metadata: Metadata = {
  title: 'El Cénit · Testamento Digital de Tenerife',
  description: 'Protegiendo el legado de Canarias en la era digital. Testamento digital seguro, legal y accesible.',
  keywords: ['testamento digital', 'Tenerife', 'Canarias', 'herencia', 'DNIe', 'firma electrónica'],
  authors: [{ name: 'El Cénit' }],
  openGraph: {
    title: 'El Cénit · Testamento Digital de Tenerife',
    description: 'Protegiendo el legado de Canarias en la era digital',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          <Navbar />
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster position="top-right" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}