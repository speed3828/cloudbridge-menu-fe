import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cloudbridge Menu',
  description: 'Interactive menu platform powered by Cloudbridge',
}

export default function MenuLanding() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Cloudbridge Menu</h1>
        <p className="text-xl mb-4">Your interactive menu platform</p>
      </div>
    </main>
  )
} 