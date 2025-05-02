import React from 'react';
import Head from 'next/head';

export default function MenuLanding() {
  return (
    <>
      <Head>
        <title>Cloudbridge Menu</title>
        <meta name="description" content="Interactive menu platform powered by Cloudbridge" />
      </Head>
      
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8">Welcome to Cloudbridge Menu</h1>
          <p className="text-xl mb-4">Your interactive menu platform</p>
        </div>
      </main>
    </>
  );
} 