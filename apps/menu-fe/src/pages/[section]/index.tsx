import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

const SectionPage: NextPage = () => {
  const router = useRouter()
  const { section } = router.query

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{section} - Menu Section</title>
        <meta name="description" content={`${section} menu section`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {section} Section
        </h1>
      </main>
    </div>
  )
}

export default SectionPage 