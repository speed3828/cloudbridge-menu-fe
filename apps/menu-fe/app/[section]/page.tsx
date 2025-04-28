import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menu Section',
  description: 'Browse menu items by section',
}

interface SectionPageProps {
  params: {
    section: string
  }
}

export default function MenuSection({ params }: SectionPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Menu Section: {params.section}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Menu items will be populated here */}
        </div>
      </div>
    </main>
  )
} 