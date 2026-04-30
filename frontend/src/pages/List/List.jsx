import ListLayout from "@/layouts/ListLayout/ListLayout";
import api from "@/utils/api";
import { trackSelfDiscoveryShopping } from "@/utils/analytics";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
const GROUP_LABEL_MAP = {
  pc: "PC",
  mobile: "모바일",
  tablet: "태블릿",
  home: "생활가전",
  premium: "프리미엄",
  value: "가성비",
  gaming: "게이밍",
};

const TYPE_LABEL_MAP = {
  laptop: "노트북",
  notebook: "노트북",
  desktop: "데스크탑",
  monitor: "모니터",
  keyboard: "키보드",
  mouse: "마우스",
  "pc-accessory": "PC 주변기기",
  "pc-part": "PC 부품",
  "pc-parts": "PC 부품",
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
  speaker: "스피커",
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
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const type = searchParams.get("type");
  const group = searchParams.get("group");
  const selectedTypeLabel =
    GROUP_LABEL_MAP[group] ?? TYPE_LABEL_MAP[type] ?? group ?? type ?? "전체 상품";
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setStatus("loading");
        const result = await api.get("/products", {
          params: {
            ...(type ? { type } : {}),
            ...(group ? { group } : {}),
          },
          signal: controller.signal,
        });
        setProducts(result.data.data);
        setStatus("success");
      } catch (error) {
        if (error.name === "CanceledError") return;
        setStatus("error");
        setErrorMessage("검색 결과를 불러오지 못했습니다.");
      }
    };
    if (type || group) {
      trackSelfDiscoveryShopping({
        signal: group ? "category_group_results_view" : "category_type_results_view",
        source: "list_page",
        label: selectedTypeLabel,
        params: {
          selected_type: type || "",
          selected_group: group || "",
        },
      });
      fetchData();
    } else {
      setProducts([]);
      setStatus("success");
    }

    return () => controller.abort();
  }, [group, selectedTypeLabel, type]);

  return (
    <div>
      <ListLayout
        errorMessage={errorMessage}
        status={status}
        filteredProducts={products}
        selectedType={type || group}
        selectedTypeLabel={selectedTypeLabel}
      />
    </div>
  );
};
export default List;
