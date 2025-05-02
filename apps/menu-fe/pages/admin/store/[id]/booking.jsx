import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * Admin Store Booking Management Page
 */
function AdminStoreBookingPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // 데이터 불러오기
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // TODO: 실제 API 구현
          // const storeResponse = await fetch(`/api/admin/store/${id}`);
          // const storeData = await storeResponse.json();
          // setStore(storeData);
          
          // const bookingsResponse = await fetch(`/api/admin/store/${id}/bookings`);
          // const bookingsData = await bookingsResponse.json();
          // setBookings(bookingsData);
          
          // 임시 데이터
          setStore({
            id,
            name: '양평 캠핑샵',
            title: '캠핑용품 대여/판매',
            phone: '010-8888-9999',
          });
          
          setBookings([
            {
              id: '1',
              storeId: id,
              storeName: '양평 캠핑샵',
              name: '김철수',
              phone: '010-1234-5678',
              date: '2023-05-20',
              time: '14:00',
              people: 4,
              message: '텐트와 테이블 세트 대여 문의드립니다.',
              status: 'pending',
              createdAt: '2023-05-15T10:30:00Z'
            },
            {
              id: '2',
              storeId: id,
              storeName: '양평 캠핑샵',
              name: '이영희',
              phone: '010-9876-5432',
              date: '2023-05-21',
              time: '10:00',
              people: 2,
              status: 'confirmed',
              createdAt: '2023-05-14T15:45:00Z'
            },
            {
              id: '3',
              storeId: id,
              storeName: '양평 캠핑샵',
              name: '박지민',
              phone: '010-5555-7777',
              date: '2023-05-19',
              time: '16:30',
              people: 6,
              message: '바베큐 세트도 대여 가능할까요?',
              status: 'cancelled',
              createdAt: '2023-05-13T09:20:00Z'
            },
            {
              id: '4',
              storeId: id,
              storeName: '양평 캠핑샵',
              name: '최유진',
              phone: '010-2222-3333',
              date: '2023-05-18',
              time: '11:00',
              people: 3,
              status: 'completed',
              createdAt: '2023-05-12T14:10:00Z'
            }
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id]);
  
  // 예약 상태 업데이트 핸들러
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      // TODO: 실제 API 구현
      // const response = await fetch(`/api/admin/booking/${bookingId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update booking status');
      // }
      
      // 임시 데이터 업데이트
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      
      alert('예약 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('예약 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  // 필터링된 예약 목록
  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);
  
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
  
  if (!store) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">상점을 찾을 수 없습니다</h1>
          <button
            onClick={() => router.push('/admin/store')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            상점 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  // 상태에 따른 배지 색상
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 상태 텍스트 매핑
  const statusText = {
    pending: '대기중',
    confirmed: '확정됨',
    cancelled: '취소됨',
    completed: '완료됨'
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>예약 관리 - {store.name} - 관리자</title>
        <meta name="description" content="상점 예약 관리 페이지" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{store.name} - 예약 관리</h1>
          <p className="text-gray-600 mt-1">{store.title}</p>
        </div>
        
        {/* 필터 */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <label htmlFor="status-filter" className="font-medium text-gray-700">상태 필터:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">전체 보기</option>
              <option value="pending">대기중</option>
              <option value="confirmed">확정됨</option>
              <option value="cancelled">취소됨</option>
              <option value="completed">완료됨</option>
            </select>
          </div>
        </div>
        
        {/* 예약 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>조건에 맞는 예약이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      고객 정보
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      예약 일시
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      인원
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록일
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.date}</div>
                        <div className="text-sm text-gray-500">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.people}명
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                          {statusText[booking.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {booking.status === 'pending' && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded"
                            >
                              확정
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                            >
                              취소
                            </button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'completed')}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded"
                            >
                              완료
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                            >
                              취소
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* 메시지가 있는 예약에 대해 추가 정보 */}
        {filteredBookings.some(booking => booking.message) && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">예약 메시지</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-200">
              {filteredBookings
                .filter(booking => booking.message)
                .map(booking => (
                  <div key={`message-${booking.id}`} className="p-4">
                    <div className="flex justify-between">
                      <div className="font-medium text-gray-900">{booking.name} - {booking.date} {booking.time}</div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                        {statusText[booking.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{booking.message}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminStoreBookingPage; 