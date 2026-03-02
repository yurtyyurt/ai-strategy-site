import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PortfolioProvider } from '@/context/PortfolioContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Market Strategy',
  description: 'Portfolio strategy dashboard for AI-focused investments',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
