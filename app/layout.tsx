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
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  minWidth: '280px',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--fs-text-small)',
                  color: 'var(--color-white)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                success: {
                  style: { background: 'var(--color-success)' },
                  iconTheme: {
                    primary: 'var(--color-white)',
                    secondary: 'var(--color-success)',
                  },
                },
                error: {
                  style: { background: 'var(--color-error)' },
                  iconTheme: {
                    primary: 'var(--color-white)',
                    secondary: 'var(--color-error)',
                  },
                },
              }}
            />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
