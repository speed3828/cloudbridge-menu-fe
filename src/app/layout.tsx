import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/contexts/ToastContext';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cloudbridge Menu',
  description: 'Interactive menu platform powered by Cloudbridge',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ErrorBoundary fallback={<div>Something went wrong</div>} children={children}>
          <ToastProvider children={children}>
            <PerformanceMonitor />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 