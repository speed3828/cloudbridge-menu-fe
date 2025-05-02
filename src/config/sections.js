/**
 * @typedef {Object} MenuSection
 * @property {string} key - URL /menu/[key]
 * @property {string} label - 탭 제목 (한국어)
 * @property {string} icon - 이모지 or lucide-react 아이콘
 */

/**
 * Available menu sections configuration
 * @type {MenuSection[]}
 */
export const SECTIONS = [
  { key: 'store',   label: '양평 당근',   icon: '🥕' },  // 중고·구인
  { key: 'yogiyo',  label: '양평 요기요', icon: '🍽️' }, // 맛집·상점
  { key: 'tour',    label: '양평 여기어때', icon: '🗺️' }, // 관광·행사
  { key: 'welfare', label: '양평 복지',   icon: '❤️' },
  { key: 'gov',     label: '양평 행정',   icon: '📑' },
  { key: 'band',    label: '양평 밴드',   icon: '🎸' },
  { key: 'bazaar',  label: '양평 장터',   icon: '🧺' },
  { key: 'live',    label: '양평 LIVE',   icon: '📡' },
  { key: 'story',   label: '양평 스토리', icon: '📷' },
]; 