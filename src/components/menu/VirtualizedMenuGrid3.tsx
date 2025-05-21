/**
 * VirtualizedMenuGrid3 컴포넌트 - 메뉴 아이템을 효율적으로 렌더링하는 가상화 그리드 (인라인 스타일 제거)
 */
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { MenuItem } from '@/types/menu';
import { MenuItem as MenuItemComponent } from './MenuItem';
import './VirtualizedMenuGrid2.css';

interface VirtualizedMenuGridProps {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
}

// 가장 가까운 미리 정의된 높이 클래스를 찾는 유틸리티 함수
const getHeightClass = (height: number): string => {
  const heights = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 15000, 20000];
  const closest = heights.reduce((prev, curr) => {
    return (Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev);
  });
  return `h${closest}`;
};

// 가장 가까운 미리 정의된 위치 클래스를 찾는 유틸리티 함수
const getPositionClass = (position: number): string => {
  const positions = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000];
  const closest = positions.reduce((prev, curr) => {
    return (Math.abs(curr - position) < Math.abs(prev - position) ? curr : prev);
  });
  return `top${closest}`;
};

// 가장 가까운 미리 정의된 행 높이 클래스를 찾는 유틸리티 함수
const getRowHeightClass = (height: number): string => {
  const heights = [320, 340, 360, 380, 400];
  const closest = heights.reduce((prev, curr) => {
    return (Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev);
  });
  return `rowh${closest}`;
};

export const VirtualizedMenuGrid3 = React.memo(({ 
  items,
  onSelectItem,
}: VirtualizedMenuGridProps) => {
  const [isBrowser, setIsBrowser] = React.useState(false);
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const [columnCount, setColumnCount] = React.useState(1);
  
  // 브라우저 환경 감지와 열 개수 계산을 위한 함수 메모이제이션
  const calculateColumns = React.useCallback(() => {
    if (parentRef.current) {
      const width = parentRef.current.offsetWidth;
      
      // 반응형 열 개수 계산 개선
      if (width < 640) { // 모바일
        setColumnCount(1);
      } else if (width < 768) { // 태블릿 소형
        setColumnCount(2);
      } else if (width < 1024) { // 태블릿 대형
        setColumnCount(3);
      } else if (width < 1280) { // 노트북
        setColumnCount(4);
      } else { // 데스크톱
        setColumnCount(5);
      }
    }
  }, []);
  
  // 행 개수 계산을 메모이제이션
  const rowCount = React.useMemo(() => 
    Math.ceil(items.length / columnCount), 
    [items.length, columnCount]
  );
  
  // 아이템 선택 핸들러 메모이제이션
  const handleSelectItem = React.useCallback((item: MenuItem) => {
    onSelectItem?.(item);
  }, [onSelectItem]);
  
  // 컴포넌트가 브라우저 환경에서 마운트되면 isBrowser를 true로 설정
  React.useEffect(() => {
    setIsBrowser(true);
    
    // 초기 열 개수 계산 및 리사이즈 이벤트 핸들러 설정
    calculateColumns();
    
    const handleResize = () => {
      calculateColumns();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateColumns]);
  
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320, // 각 행의 예상 높이
    overscan: 5,
  });

  // 서버 사이드 렌더링 중이거나 아직 마운트되지 않았을 때의 폴백 UI
  if (!isBrowser) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className="itemWrapper">
            <MenuItemComponent
              item={item}
              onSelect={handleSelectItem}
            />
          </div>
        ))}
      </div>
    );
  }

  // 컨텐츠 영역의 클래스를 계산
  const contentHeightClass = getHeightClass(rowVirtualizer.getTotalSize());
  const contentClassName = `content ${contentHeightClass}`;

  return (
    <div 
      ref={parentRef}
      className="container"
    >
      <div className={contentClassName}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowStartIndex = virtualRow.index * columnCount;
          const rowItems = items.slice(
            rowStartIndex,
            Math.min(rowStartIndex + columnCount, items.length)
          );

          // 행의 클래스를 계산
          const positionClass = getPositionClass(virtualRow.start);
          const rowHeightClass = getRowHeightClass(virtualRow.size);
          const colsClass = `cols${columnCount}`;
          const rowClassName = `row ${positionClass} ${rowHeightClass} ${colsClass}`;

          return (
            <div
              key={String(virtualRow.key)}
              className={rowClassName}
            >
              {rowItems.map((item) => (
                <div key={item.id} className="itemWrapper">
                  <MenuItemComponent
                    item={item}
                    onSelect={handleSelectItem}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});

// 디버깅을 위한 컴포넌트 이름 설정
VirtualizedMenuGrid3.displayName = 'VirtualizedMenuGrid3'; 