/**
 * VirtualizedMenuGrid 컴포넌트 - 메뉴 아이템을 효율적으로 렌더링하는 가상화 그리드
 */
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { MenuItem } from '@/types/menu';
// MenuItem 컴포넌트 임포트 방법 변경
import { MenuItemImage } from './MenuItemImage';
import styles from './VirtualizedMenuGrid.module.css';
import { getGridContentClass, getGridRowClass } from './VirtualizedMenuGridUtils'; // CSS 클래스 기반 유틸리티로 변경

interface VirtualizedMenuGridProps {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
}

// 간단한 MenuItem 컴포넌트 생성
const MenuItemComponent: React.FC<{item: MenuItem; onSelect?: (item: MenuItem) => void}> = ({
  item, onSelect
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div 
      className={styles.menuItem}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <MenuItemImage 
          src={item.imageUrl || '/placeholder.jpg'} 
          alt={item.name} 
          width={400} 
          height={300}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.name}</h3>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.price}>
          {item.price ? (
            <span>{typeof item.price === 'number' ? `₩${item.price.toLocaleString()}` : item.price}</span>
          ) : (
            <span>가격 정보 없음</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const VirtualizedMenuGrid = React.memo(({ 
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
          <div key={item.id} className={styles.itemWrapper}>
            <MenuItemComponent
              item={item}
              onSelect={handleSelectItem}
            />
          </div>
        ))}
      </div>
    );
  }

  // CSS 클래스와 CSS 변수 기반 접근법으로 변경
  const contentProps = getGridContentClass(rowVirtualizer.getTotalSize());

  return (
    <div 
      ref={parentRef}
      className={styles.gridContainer}
    >
      <div
        className={contentProps.className}
        style={contentProps.style}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowStartIndex = virtualRow.index * columnCount;
          const rowItems = items.slice(
            rowStartIndex,
            Math.min(rowStartIndex + columnCount, items.length)
          );

          // CSS 클래스와 CSS 변수 기반 접근법으로 변경
          const rowProps = getGridRowClass(
            virtualRow.start, 
            virtualRow.size, 
            columnCount
          );

          return (
            <div
              key={String(virtualRow.key)}
              className={rowProps.className}
              style={rowProps.style}
            >
              {rowItems.map((item) => (
                <div key={item.id} className={styles.itemWrapper}>
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
VirtualizedMenuGrid.displayName = 'VirtualizedMenuGrid'; 