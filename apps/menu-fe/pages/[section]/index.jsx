import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SECTIONS } from '../../config/sections';
import { useStoreList } from '../../hooks/useStoreList';
import StoreCard from '../../components/StoreCard';
import SkeletonList from '../../components/SkeletonList';
import MenuTabs from '../../components/MenuTabs';

/**
 * Section Page component - displays menu items filtered by section
 */
export default function SectionPage() {
  const { query } = useRouter();
  const section = query.section ?? 'store';
  const { data, isLoading } = useStoreList(section);
  
  // Get section metadata for title
  const sectionInfo = SECTIONS.find(s => s.key === section) || { 
    label: 'Menu Section', 
    description: 'Browse menu items by section'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{sectionInfo.label} - Cloudbridge Menu</title>
        <meta name="description" content={sectionInfo.description} />
      </Head>
      
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