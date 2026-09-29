import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import 'modern-normalize';
import './globals.css';

import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Природні Мандри',
  description:
    'Перевірені місця для відпочинку в Україні з фото та відгуками мандрівників',
  // TODO(Олександр): openGraph після першого деплою на Vercel
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={montserrat.variable} suppressHydrationWarning>
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster position="top-right" />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
