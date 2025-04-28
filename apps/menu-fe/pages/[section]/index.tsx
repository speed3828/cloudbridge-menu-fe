import { Metadata } from 'next'
import { useRouter } from 'next/router';
import { SECTIONS } from '@/config/sections';
import { useStoreList } from '@/hooks/useStoreList';
import StoreCard from '@/components/StoreCard';
import SkeletonList from '@/components/SkeletonList';
import MenuTabs from '@/components/MenuTabs';

export const metadata: Metadata = {
  title: 'Menu Section',
  description: 'Browse menu items by section',
}

interface SectionPageProps {
  params: {
    section: string
  }
}

export default function SectionPage() {
  const { query } = useRouter();
  const section = (query.section as string) ?? 'store';
  const { data, isLoading } = useStoreList(section);

  return (
    <div className="min-h-screen flex flex-col">
      <MenuTabs />

      {isLoading ? (
        <SkeletonList />
      ) : (
        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map(item => (
            <StoreCard key={item.id} store={item} />
          ))}
        </div>
      )}

      {/* 섹션 챗봇 iframe */}
      <div className="border-t mt-auto">
        <iframe
          title={`${section}-chatbot`}
          src={`https://bot.autoriseinsight.co.kr/?bot=${section}`}
          className="w-full h-96"
        />
      </div>
    </div>
  );
} 