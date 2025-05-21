/**
 * 메뉴 필터 컴포넌트 - CSS 클래스 기반 스타일링 적용
 */
import React from 'react';
import type { MenuFilter as MenuFilterType } from '@/types/menu';
import styles from './MenuFilter.module.css';

interface MenuFilterProps {
  filter: MenuFilterType;
  onFilterChange: (filter: MenuFilterType) => void;
  categories: string[];
  tags: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export const MenuFilter: React.FC<MenuFilterProps> = ({
  filter,
  onFilterChange,
  categories,
  tags,
  priceRange
}) => {
  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    const newFilter = { ...filter };
    if (newFilter.category === category) {
      // 이미 선택된 카테고리를 다시 클릭하면 선택 취소
      newFilter.category = undefined;
    } else {
      newFilter.category = category;
    }
    onFilterChange(newFilter);
  };

  // 태그 변경 핸들러
  const handleTagChange = (tag: string) => {
    const newFilter = { ...filter };
    
    if (!newFilter.tags) {
      newFilter.tags = [tag];
    } else if (newFilter.tags.includes(tag)) {
      // 이미 선택된 태그를 다시 클릭하면 선택 취소
      newFilter.tags = newFilter.tags.filter(t => t !== tag);
      if (newFilter.tags.length === 0) {
        newFilter.tags = undefined;
      }
    } else {
      newFilter.tags = [...newFilter.tags, tag];
    }
    
    onFilterChange(newFilter);
  };

  // 가격 범위 변경 핸들러
  const handlePriceRangeChange = (min: number, max: number) => {
    const newFilter = { ...filter };
    
    if (min === priceRange.min && max === priceRange.max) {
      // 전체 범위가 선택되면 가격 필터 제거
      newFilter.priceRange = undefined;
    } else {
      newFilter.priceRange = { min, max };
    }
    
    onFilterChange(newFilter);
  };

  // 검색어 변경 핸들러
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter };
    const query = e.target.value.trim();
    
    if (query === '') {
      newFilter.searchQuery = undefined;
    } else {
      newFilter.searchQuery = query;
    }
    
    onFilterChange(newFilter);
  };

  // 유효성 필터 변경 핸들러
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter };
    newFilter.showOnlyAvailable = e.target.checked;
    onFilterChange(newFilter);
  };

  // 모든 필터 초기화 핸들러
  const handleClearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>메뉴 필터</h3>
        <button 
          className={styles.clearButton}
          onClick={handleClearFilters}
        >
          필터 초기화
        </button>
      </div>

      {/* 검색어 필터 */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>검색</h4>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="메뉴 이름 또는 설명 검색"
            className={styles.searchInput}
            value={filter.searchQuery || ''}
            onChange={handleSearchQueryChange}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>카테고리</h4>
        <div className={styles.categoryContainer}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${filter.category === category ? styles.categoryActive : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 태그 필터 */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>태그</h4>
        <div className={styles.tagsContainer}>
          {tags.map(tag => (
            <label
              key={tag}
              className={`${styles.tagLabel} ${filter.tags?.includes(tag) ? styles.tagActive : ''}`}
            >
              <input
                type="checkbox"
                className={styles.tagCheckbox}
                checked={filter.tags?.includes(tag) || false}
                onChange={() => handleTagChange(tag)}
              />
              <span className={styles.tagName}>{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 가격 범위 필터 */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>가격 범위</h4>
        <div className={styles.priceRangeContainer}>
          <div className={styles.priceLabels}>
            <span>{priceRange.min.toLocaleString()}원</span>
            <span>{priceRange.max.toLocaleString()}원</span>
          </div>
          <div className={styles.priceButtons}>
            <button
              className={`${styles.priceButton} ${!filter.priceRange ? styles.priceActive : ''}`}
              onClick={() => handlePriceRangeChange(priceRange.min, priceRange.max)}
            >
              전체
            </button>
            <button
              className={`${styles.priceButton} ${filter.priceRange?.max === 10000 ? styles.priceActive : ''}`}
              onClick={() => handlePriceRangeChange(0, 10000)}
            >
              ~1만원
            </button>
            <button
              className={`${styles.priceButton} ${filter.priceRange?.min === 10000 && filter.priceRange?.max === 20000 ? styles.priceActive : ''}`}
              onClick={() => handlePriceRangeChange(10000, 20000)}
            >
              1~2만원
            </button>
            <button
              className={`${styles.priceButton} ${filter.priceRange?.min === 20000 ? styles.priceActive : ''}`}
              onClick={() => handlePriceRangeChange(20000, priceRange.max)}
            >
              2만원~
            </button>
          </div>
        </div>
      </div>

      {/* 유효성 필터 */}
      <div className={styles.filterSection}>
        <label className={styles.availabilityLabel}>
          <input
            type="checkbox"
            className={styles.availabilityCheckbox}
            checked={filter.showOnlyAvailable || false}
            onChange={handleAvailabilityChange}
          />
          <span>판매 가능한 메뉴만 보기</span>
        </label>
      </div>
    </div>
  );
}; 