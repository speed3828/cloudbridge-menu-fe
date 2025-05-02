'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SECTIONS } from '@/config/sections';

/**
 * Home page component that redirects to the first section
 */
export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const redirect = async () => {
      try {
        await router.push(`/menu/${SECTIONS[0].key}`);
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    redirect();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return null;
} 