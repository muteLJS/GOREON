import productsData from "@/data/products_list.json";

export const PC_ASSEMBLY_CATEGORIES = [
  "CPU",
  "램",
  "메인보드",
  "그래픽카드",
  "저장장치",
  "케이스",
  "파워",
];

const TAG_CATEGORY_MAP = {
  CPU: "CPU",
  메모리: "램",
  메인보드: "메인보드",
  그래픽카드: "그래픽카드",
  SSD: "저장장치",
  케이스: "케이스",
  파워서플라이: "파워",
};

const parsePrice = (price) => {
  if (typeof price === "number") return price;
  const normalized = String(price ?? "").replace(/[^\d]/g, "");
  return Number(normalized) || 0;
};

const getProductOption = (product) => {
  const firstOption = product.priceOptions?.[0]?.optionName;
  if (firstOption) return firstOption;
  const tagCategory = product.tag?.find((tag) => TAG_CATEGORY_MAP[tag]);
  return tagCategory ?? "기본옵션";
};

const getPcCategory = (product) => {
  const tags = product.tag ?? [];
  const matchedTag = tags.find((tag) => TAG_CATEGORY_MAP[tag]);
  return matchedTag ? TAG_CATEGORY_MAP[matchedTag] : null;
};

export const pcAssemblyProducts = productsData
  .map((product) => {
    const category = getPcCategory(product);
    if (!category) return null;

    return {
      ...product,
      category,
      option: getProductOption(product),
      price: parsePrice(product.price),
      rating: Number(product.rating) || 0,
    };
  })
  .filter(Boolean);

export const getPcAssemblyRecommendations = (selectedItems = []) => {
  const selectedProductIds = new Set(selectedItems.map((item) => item.productId));

  return PC_ASSEMBLY_CATEGORIES.map((category) =>
    pcAssemblyProducts.find(
      (product) => product.category === category && !selectedProductIds.has(product.id),
    ),
  )
    .filter(Boolean)
    .slice(0, 3);
};
