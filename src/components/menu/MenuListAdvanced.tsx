/**
 * 고급 메뉴 목록 컴포넌트 - CSS 클래스 기반 스타일링 적용
 */
import React from 'react';
import type { MenuItem } from '@/types/menu';
import styles from './MenuListAdvanced.module.css';

interface MenuListAdvancedProps {
  items: MenuItem[];
  layout?: 'grid' | 'list';
  onSelectItem?: (item: MenuItem) => void;
}

export const MenuListAdvanced: React.FC<MenuListAdvancedProps> = ({
  items,
  layout = 'grid',
  onSelectItem
}) => {
  // CSS 클래스 계산
  const rootClassName = `${styles.container} ${layout === 'grid' ? styles.gridLayout : styles.listLayout}`;
  
  // 항목 선택 핸들러
  const handleSelectItem = (item: MenuItem) => {
    onSelectItem?.(item);
  };

  // 그리드 또는 목록 형태의 항목 렌더링
  const renderItems = () => {
    return items.map((item) => {
      // 가격 표시를 위한 클래스 결정
      let priceClass = styles.price;
      
      if (item.discount) {
        priceClass = `${styles.price} ${styles.discounted}`;
      }
      
      // 태그 렌더링
      const renderTags = () => {
        if (!item.tags || item.tags.length === 0) return null;
        
        return (
          <div className={styles.tags}>
            {item.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        );
      };
      
      // 가용성 클래스 결정
      const availabilityClass = item.isAvailable 
        ? styles.available 
        : styles.unavailable;
        
      // 항목 클래스 결정 (인기/추천 메뉴에 따라 다름)
      let itemClass = styles.item;
      if (item.popular) itemClass = `${itemClass} ${styles.popular}`;
      if (item.recommended) itemClass = `${itemClass} ${styles.recommended}`;
      
      return (
        <div 
          key={item.id}
          className={`${itemClass} ${availabilityClass}`}
          onClick={() => handleSelectItem(item)}
        >
          {/* 이미지 영역 */}
          <div className={styles.imageContainer}>
            {item.imageUrl || item.image ? (
              <img 
                src={item.imageUrl || item.image} 
                alt={item.name} 
                className={styles.image}
              />
            ) : (
              <div className={styles.noImage}>이미지 없음</div>
            )}
            
            {!item.isAvailable && (
              <div className={styles.soldOutBadge}>품절</div>
            )}
          </div>
          
          {/* 콘텐츠 영역 */}
          <div className={styles.content}>
            <h3 className={styles.title}>{item.name}</h3>
            <p className={styles.description}>{item.description}</p>
            
            <div className={styles.priceContainer}>
              {item.discount ? (
                <>
                  <span className={styles.originalPrice}>
                    {item.discount.originalPrice}
                  </span>
                  <span className={priceClass}>
                    {typeof item.price === 'number' 
                      ? item.price.toLocaleString() + '원' 
                      : item.price}
                  </span>
                  <span className={styles.discountBadge}>
                    {item.discount.percentage}% 할인
                  </span>
                </>
              ) : (
                <span className={priceClass}>
                  {typeof item.price === 'number' 
                    ? item.price.toLocaleString() + '원' 
                    : item.price}
                </span>
              )}
            </div>
            
            {renderTags()}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={rootClassName}>
      {items.length === 0 ? (
        <div className={styles.noItems}>
          <p>표시할 메뉴 항목이 없습니다.</p>
        </div>
      ) : (
        renderItems()
      )}
    </div>
  );
}; 