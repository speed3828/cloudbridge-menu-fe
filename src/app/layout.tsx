import * as React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import FunctionalErrorBoundary from '@/components/FunctionalErrorBoundary';
import { ToastProvider } from '@/contexts/ToastContext';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { QueryProvider } from '@/providers/QueryProvider';
import { NetworkErrorHandler } from '@/components/NetworkErrorHandler';
import '@/config/axios-config';

const inter = Inter({ subsets: ['latin'] });

// Define a local interface for metadata
interface PageMetadata {
  title?: string;
  description?: string;
  [key: string]: any;
}

export const metadata: PageMetadata = {
  title: 'Cloudbridge Menu',
  description: 'Interactive menu platform powered by Cloudbridge',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <FunctionalErrorBoundary fallback={<div>Something went wrong</div>}>
          <ToastProvider>
            <QueryProvider>
              <NetworkErrorHandler />
              {children}
              <PerformanceMonitor />
            </QueryProvider>
          </ToastProvider>
        </FunctionalErrorBoundary>
      </body>
    </html>
  );
} 