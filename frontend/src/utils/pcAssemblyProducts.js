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

const pcAssemblyProductMap = new Map(pcAssemblyProducts.map((product) => [product.id, product]));

const categoryPriceMap = pcAssemblyProducts.reduce((acc, product) => {
  acc[product.category] = [...(acc[product.category] ?? []), product.price].sort((a, b) => a - b);
  return acc;
}, {});

const normalizeNumber = (value) => Number(value) || 0;

const getPriceTier = (category, price) => {
  const prices = categoryPriceMap[category] ?? [];
  if (!prices.length || !price) return "middle";

  const cheaperCount = prices.filter((categoryPrice) => categoryPrice <= price).length;
  const percentile = cheaperCount / prices.length;

  if (percentile >= 0.67) return "high";
  if (percentile <= 0.34) return "low";
  return "middle";
};

const getSelectedProduct = (item) => pcAssemblyProductMap.get(item.productId) ?? item;

const getItemName = (item) => item.name ?? "";

const getItemOption = (item) => item.option ?? "";

const getCapacityGb = (item) => {
  const source = `${getItemOption(item)} ${getItemName(item)}`;
  const tbMatch = source.match(/(\d+(?:\.\d+)?)\s*TB/i);
  if (tbMatch) return Number(tbMatch[1]) * 1024;

  const gbMatch = source.match(/(\d+(?:\.\d+)?)\s*GB/i);
  if (gbMatch) return Number(gbMatch[1]);

  return 0;
};

const getPowerWatt = (item) => {
  const match = getItemName(item).match(/(\d{3,4})\s*W/i);
  return match ? Number(match[1]) : 0;
};

const getGpuMemoryGb = (item) => {
  const match = getItemName(item).match(/D\d\s*(\d+)\s*GB/i);
  return match ? Number(match[1]) : 0;
};

const getCpuClass = (item) => {
  const name = getItemName(item).toLowerCase();
  if (/ryzen\s*9|라이젠9|core\s*i9|코어\s*i9|ultra\s*9|울트라9/.test(name)) return "high";
  if (/ryzen\s*7|라이젠7|core\s*i7|코어\s*i7|ultra\s*7|울트라7/.test(name)) return "high";
  if (/ryzen\s*5|라이젠5|core\s*i5|코어\s*i5|ultra\s*5|울트라5/.test(name)) return "middle";
  if (/ryzen\s*3|라이젠3|core\s*i3|코어\s*i3/.test(name)) return "low";
  return getPriceTier(item.category, item.price);
};

const getGpuClass = (item) => {
  const name = getItemName(item);
  const modelMatch = name.match(/RTX\s*(\d{4})/i);
  const model = modelMatch ? Number(modelMatch[1]) : 0;
  const memoryGb = getGpuMemoryGb(item);

  if (model >= 5070 || memoryGb >= 12) return "high";
  if (model >= 5060 || memoryGb >= 8) return "middle";
  return getPriceTier(item.category, item.price);
};

const getGenericLevel = (item) => {
  const product = getSelectedProduct(item);
  const rating = normalizeNumber(product.rating ?? item.rating);
  const tier = getPriceTier(item.category, item.price);

  if (rating >= 4 || tier === "high") return "ok";
  if (rating <= 2 && tier === "low") return "error";
  return "warning";
};

const getCategoryPerformance = (item) => {
  const product = getSelectedProduct(item);
  const analysisItem = { ...product, ...item, price: normalizeNumber(item.price ?? product.price) };

  switch (analysisItem.category) {
    case "CPU": {
      const cpuClass = getCpuClass(analysisItem);
      if (cpuClass === "high") return { level: "ok", message: "상위 작업/게임 성능권" };
      if (cpuClass === "middle") return { level: "warning", message: "일반 작업은 충분, 고사양 작업은 확인 필요" };
      return { level: "error", message: "고사양 작업 기준 CPU 성능 부족 가능" };
    }
    case "그래픽카드": {
      const gpuClass = getGpuClass(analysisItem);
      const memoryGb = getGpuMemoryGb(analysisItem);
      if (gpuClass === "high") return { level: "ok", message: `GPU 성능 여유${memoryGb ? ` · VRAM ${memoryGb}GB` : ""}` };
      if (gpuClass === "middle") return { level: "warning", message: `FHD/QHD 중심 권장${memoryGb ? ` · VRAM ${memoryGb}GB` : ""}` };
      return { level: "error", message: "그래픽 성능/VRAM 확인 필요" };
    }
    case "램": {
      const capacityGb = getCapacityGb(analysisItem);
      if (capacityGb >= 32) return { level: "ok", message: `메모리 용량 충분 · ${capacityGb}GB` };
      if (capacityGb >= 16) return { level: "warning", message: `기본 사용 가능 · ${capacityGb}GB` };
      return { level: "error", message: "RAM 용량 확인 필요" };
    }
    case "저장장치": {
      const capacityGb = getCapacityGb(analysisItem);
      if (capacityGb >= 2048) return { level: "ok", message: `저장공간 여유 · ${capacityGb / 1024}TB` };
      if (capacityGb >= 1024) return { level: "warning", message: "일반 사용 가능 · 1TB급" };
      return { level: "error", message: "저장공간 부족 가능" };
    }
    case "파워": {
      const watt = getPowerWatt(analysisItem);
      if (watt >= 850) return { level: "ok", message: `고성능 구성 여유 · ${watt}W` };
      if (watt >= 700) return { level: "warning", message: `중급 구성 권장 · ${watt}W` };
      return { level: "error", message: watt ? `파워 용량 확인 필요 · ${watt}W` : "파워 용량 확인 필요" };
    }
    case "메인보드":
      return getGenericLevel(analysisItem) === "ok"
        ? { level: "ok", message: "확장성/선호도 양호" }
        : { level: "warning", message: "소켓·메모리 규격 확인 필요" };
    case "케이스":
      return getGenericLevel(analysisItem) === "ok"
        ? { level: "ok", message: "가격대/선호도 양호" }
        : { level: "warning", message: "그래픽카드 길이·쿨링 공간 확인 필요" };
    default:
      return { level: "warning", message: "상세 스펙 확인 필요" };
  }
};

export const getPcAssemblyPerformanceChecks = (selectedItems = []) =>
  selectedItems.map((item) => {
    const analysis = getCategoryPerformance(item);
    return {
      id: item.id,
      level: analysis.level,
      text: analysis.message,
    };
  });

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
