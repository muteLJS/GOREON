export const CATEGORY_MENU = [
  {
    key: "pc",
    title: "PC",
    items: [
      { label: "노트북", type: "notebook" },
      { label: "데스크탑", type: "desktop" },
      { label: "모니터", type: "monitor" },
      { label: "키보드", type: "keyboard" },
      { label: "마우스", type: "mouse" },
      { label: "PC 주변기기", type: "pc-accessory" },
      { label: "PC 부품", type: "pc-parts" },
    ],
  },
  {
    key: "mobile",
    title: "모바일",
    items: [
      { label: "스마트폰", type: "smartphone" },
      { label: "스마트워치", type: "smartwatch" },
      { label: "이어폰", type: "earphone" },
    ],
  },
  {
    key: "tablet",
    title: "태블릿",
    items: [
      { label: "태블릿", type: "tablet" },
      { label: "태블릿 액세서리", type: "tablet-accessory" },
      { label: "펜슬", type: "pencil" },
      { label: "키보드 케이스", type: "keyboard-case" },
    ],
  },
  {
    key: "home",
    title: "생활가전",
    items: [
      { label: "프린터", type: "printer" },
      { label: "공유기", type: "router" },
      { label: "스피커", type: "speaker" },
      { label: "보조배터리", type: "power-bank" },
    ],
  },
];

export const BRAND_MENU = [
  {
    key: "premium",
    title: "프리미엄",
    items: [
      { label: "Apple", type: "apple" },
      { label: "Samsung", type: "samsung" },
      { label: "LG", type: "lg" },
    ],
  },
  {
    key: "value",
    title: "가성비",
    items: [
      { label: "HP", type: "hp" },
      { label: "Lenovo", type: "lenovo" },
      { label: "Dell", type: "dell" },
    ],
  },
  {
    key: "gaming",
    title: "게이밍",
    items: [
      { label: "MSI", type: "msi" },
      { label: "ASUS", type: "asus" },
      { label: "Acer", type: "acer" },
    ],
  },
];

export const DESKTOP_NAV_ITEMS = [
  { key: "category", label: "품목", sections: CATEGORY_MENU, variant: "category" },
  { key: "brand", label: "브랜드", sections: BRAND_MENU, variant: "brand" },
  { key: "pc-build", label: "PC 조립", to: "/pc-assembly" },
];

export const MOBILE_NAV_TABS = DESKTOP_NAV_ITEMS.map(({ key, label }) => ({
  key,
  label,
}));

export const SEARCH_SUGGESTIONS = [
  "유튜브 편집용 노트북",
  "FPS 게임에 맞는 모니터",
  "대학생 추천 노트북 50만원 이하",
  "부모님 선물용 태블릿",
];
