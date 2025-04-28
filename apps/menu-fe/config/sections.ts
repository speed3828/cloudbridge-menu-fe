export type MenuSection = {
  key: string;          // URL /menu/[key]
  label: string;        // 탭 제목 (한국어)
  icon: string;         // 이모지 or lucide-react 아이콘
};

export const SECTIONS: MenuSection[] = [
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