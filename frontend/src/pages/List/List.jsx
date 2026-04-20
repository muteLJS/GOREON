import { useState, useEffect } from "react";
import ListLayout from "@/layouts/ListLayout/ListLayout";
import { useSearchParams } from "react-router-dom";
const TYPE_LABEL_MAP = {
  laptop: "노트북",
  notebook: "노트북",
  desktop: "데스크탑",
  monitor: "모니터",
  keyboard: "키보드",
  mouse: "마우스",
  "pc-accessory": "PC 주변기기",
  "pc-part": "PC 부품",
  smartphone: "스마트폰",
  smartwatch: "스마트워치",
  earphone: "이어폰",
  tablet: "태블릿",
  "tablet-accessory": "태블릿 액세서리",
  pencil: "펜슬",
  "keyboard-case": "키보드 케이스",
  printer: "프린터",
  router: "공유기",
  webcam: "웹캠",
  "power-bank": "보조배터리",
  apple: "Apple",
  samsung: "Samsung",
  lg: "LG",
  hp: "HP",
  lenovo: "Lenovo",
  dell: "Dell",
  msi: "MSI",
  asus: "ASUS",
  acer: "Acer",
};
const List = () => {
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");
  const selectedTypeLabel = TYPE_LABEL_MAP[type] ?? type ?? "전체 상품";
  console.log(type);

  return (
    <div>
      <ListLayout />
    </div>
  );
};
export default List;
