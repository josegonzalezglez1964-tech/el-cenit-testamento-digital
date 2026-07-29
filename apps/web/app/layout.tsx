import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'sonner';

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

export default function RootLayout({ children }: { children: React.ReactNoexport defauturn (
export default function RootLayout({ erexport default function RootLayout}`}>
      <body className="font-sans antialiased">
                              aster position="top-right" richColors />
      </body>
    </html>
  );
}
