import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// 지도 컴포넌트 (주소가 있을 경우 표시)
const MapSection = ({ address }) => {
  if (!address) return null;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">위치</h3>
      <div className="bg-gray-200 rounded-lg overflow-hidden h-64 flex items-center justify-center">
        <p className="text-gray-600 text-center p-4">
          {address}
          <br />
          <span className="text-sm">(지도 API 연동 필요)</span>
        </p>
      </div>
    </div>
  );
};

/**
 * 복지 프로그램 상세 페이지
 */
const WelfareDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [welfare, setWelfare] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 데이터 불러오기 (실제 환경에서는 useWelfareDetail 훅 사용)
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // TODO: 실제 API 구현
          // const response = await fetch(`/api/menu/welfare/${id}`);
          // const data = await response.json();
          // setWelfare(data);
          
          // 임시 데이터 - 실제로는 API에서 가져온 데이터 사용
          setWelfare({
            id: id,
            title: '노인 건강 관리 프로그램',
            target_group: '어르신',
            phone: '031-123-4567',
            address: '경기도 양평군 양평읍 중앙로 123',
            service_type: '건강관리',
            thumbnail: 'https://via.placeholder.com/800x400?text=Senior+Health+Program',
            description: '노인 건강 검진 및 운동 프로그램을 제공합니다. 주 2회 진행되며, 65세 이상 양평 거주 어르신이라면 누구나 참여 가능합니다. 참여를 원하시는 분은 전화로 문의해주세요.',
            status: 'approved',
            created_at: '2023-05-10T12:00:00Z'
          });
        } catch (error) {
          console.error('Error fetching welfare data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  if (!welfare) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">프로그램을 찾을 수 없습니다</h1>
          <button
            onClick={() => router.push('/welfare')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            프로그램 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{welfare.title} - 양평 복지</title>
        <meta name="description" content={welfare.description || '양평 복지 프로그램 상세 정보'} />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        {/* 뒤로가기 링크 */}
        <div className="mb-4">
          <Link href="/welfare" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            복지 프로그램 목록으로 돌아가기
          </Link>
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 헤더 및 썸네일 */}
          <div className="relative">
            <img
              src={welfare.thumbnail || 'https://via.placeholder.com/800x400?text=No+Image'}
              alt={welfare.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
              <div className="p-6 w-full">
                <div className="flex justify-between items-start">
                  <h1 className="text-white text-2xl font-bold">{welfare.title}</h1>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {welfare.target_group}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 상세 정보 */}
          <div className="p-6">
            {/* 서비스 유형 */}
            {welfare.service_type && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">서비스 유형</h3>
                <p className="text-gray-700">{welfare.service_type}</p>
              </div>
            )}
            
            {/* 상세 설명 */}
            {welfare.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">상세 설명</h3>
                <p className="text-gray-700 whitespace-pre-line">{welfare.description}</p>
              </div>
            )}
            
            {/* 연락처 정보 */}
            {welfare.phone && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">연락처</h3>
                <p className="text-gray-700">{welfare.phone}</p>
              </div>
            )}
            
            {/* 주소 정보 */}
            {welfare.address && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">주소</h3>
                <p className="text-gray-700">{welfare.address}</p>
              </div>
            )}
            
            {/* 지도 */}
            <MapSection address={welfare.address} />
            
            {/* 정보 업데이트 시간 */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
              마지막 업데이트: {new Date(welfare.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WelfareDetailPage; 