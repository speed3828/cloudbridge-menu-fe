import React from 'react'
import Head from 'next/head'

/**
 * 홈 페이지 컴포넌트
 */
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Menu Landing Page</title>
        <meta name="description" content="Menu landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Menu
        </h1>
      </main>
    </div>
  )
}

export default Home 