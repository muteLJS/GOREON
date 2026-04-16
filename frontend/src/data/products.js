import ProductHeroImage from "@/assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";
import DetailImage from "@/assets/img/intel-core-ultra5-250kf-plus-detail-description-genuine.jpg";
import LifestyleImage from "@/assets/img/amd-ryzen5-7400f-raphael-detail-description.jpg";
import ProductImage from "@/assets/products/product-example.jpg";

export const PRODUCTS = [
  {
    id: 1,
    name: "LG전자 2026 그램 프로16 16Z95U-GS5WK",
    brand: "LG전자",
    rating: 4,
    image: ProductImage,
    price: 1000000,
  },
  {
    id: 2,
    name: "삼성전자 갤럭시북5 프로 NT960XHA-KD72G",
    brand: "삼성전자",
    rating: 5,
    image: ProductImage,
    price: 1489000,
  },
  {
    id: 3,
    name: "레노버 아이디어패드 슬림5 16AHP9",
    brand: "레노버",
    rating: 4,
    image: ProductImage,
    price: 849000,
  },
  {
    id: 4,
    name: "ASUS 비보북 S 15 OLED S5507QA",
    brand: "ASUS",
    rating: 3,
    image: ProductImage,
    price: 1249000,
  },
  {
    id: 5,
    name: "HP 파빌리온 Aero 13-bg0010AU",
    brand: "HP",
    rating: 4,
    image: ProductImage,
    price: 929000,
  },
  {
    id: 6,
    name: "MSI 모던 15 H AI C1MG-U7",
    brand: "MSI",
    rating: 5,
    image: ProductImage,
    price: 1159000,
  },
];

const DETAIL_OVERRIDES = {
  1: {
    subtitle: "가벼운 휴대성과 생산성을 함께 노리는 프리미엄 노트북",
    promoImage: DetailImage,
    secondaryImage: LifestyleImage,
    keyPoints: [
      {
        title: "휴대성과 화면 균형",
        body: "16형 화면과 휴대성을 함께 고려하는 사용자에게 맞는 구성을 중심으로 살펴볼 수 있습니다.",
      },
      {
        title: "업무와 학습에 적합",
        body: "문서 작업, 온라인 미팅, 웹 기반 생산성 툴처럼 일상적인 작업 흐름에 무난하게 대응합니다.",
      },
      {
        title: "장시간 사용 고려",
        body: "이동이 많은 환경에서도 부담을 줄이기 쉬운 구성을 기대할 수 있습니다.",
      },
    ],
  },
  default: {
    subtitle: "일상 작업부터 콘텐츠 소비까지 폭넓게 대응하는 실속형 선택",
    promoImage: ProductHeroImage,
    secondaryImage: LifestyleImage,
    keyPoints: [
      {
        title: "실사용 중심 구성",
        body: "문서 작업, 강의 수강, 영상 시청, 가벼운 편집처럼 자주 하는 작업을 무난하게 처리하기 좋습니다.",
      },
      {
        title: "합리적인 가격대",
        body: "예산을 크게 벗어나지 않으면서도 체감 성능과 사용 편의성을 챙기기 쉬운 구성을 지향합니다.",
      },
      {
        title: "범용성 높은 선택",
        body: "학생, 직장인, 일반 사용자까지 폭넓게 고려할 수 있는 기본기에 집중한 제품군입니다.",
      },
    ],
  },
};

const DEFAULT_REVIEW_IMAGES = [ProductImage, ProductImage, ProductImage, ProductImage];

function buildReviews(product) {
  const baseReviews = [
    {
      id: 1,
      author: "User**6",
      date: "2026.04.07",
      rating: 5,
      body: `${product.name} 기준으로 일상 작업과 멀티태스킹이 무난해서 만족스럽습니다. 화면과 휴대성 밸런스도 괜찮은 편입니다.`,
      images: DEFAULT_REVIEW_IMAGES,
      helpfulCount: 12,
    },
    {
      id: 2,
      author: "User**8",
      date: "2026.04.09",
      rating: 4,
      body: "초기 세팅 이후 바로 사용하기 편했고, 가격 대비 구성도 나쁘지 않았습니다. 기본 용도로는 충분히 만족스럽습니다.",
      images: DEFAULT_REVIEW_IMAGES,
      helpfulCount: 7,
    },
  ];

  if (product.id !== 1) {
    return baseReviews;
  }

  return [
    ...baseReviews,
    {
      id: 3,
      author: "gram**1",
      date: "2026.04.10",
      rating: 5,
      body: "화면이 넓어서 문서 작업할 때 답답하지 않았고 무게도 부담이 적었습니다. 외근이나 학교 이동이 많은 편인데 들고 다니기 편한 점이 가장 만족스러웠습니다.",
      images: DEFAULT_REVIEW_IMAGES,
      helpfulCount: 18,
    },
    {
      id: 4,
      author: "note**2",
      date: "2026.04.11",
      rating: 3,
      body: "부팅 속도와 기본 작업 반응이 빨라서 바로 실사용에 들어가기 좋았습니다. 팬 소음도 거슬리지 않는 수준이라 카페나 도서관에서 쓰기 무난했습니다.",
      images: DEFAULT_REVIEW_IMAGES,
      helpfulCount: 9,
    },
    {
      id: 5,
      author: "office**7",
      date: "2026.04.12",
      rating: 4,
      body: "화상회의, 브라우저 탭 여러 개, 엑셀 작업을 동시에 돌려도 안정적으로 쓸 수 있었습니다. 키보드 타건감도 나쁘지 않아서 장시간 입력 작업에도 괜찮았습니다.",
      images: DEFAULT_REVIEW_IMAGES,
      helpfulCount: 24,
    },
    {
      id: 6,
      author: "daily**4",
      date: "2026.04.14",
      rating: 2,
      body: "충전기 포함해서 들고 다녀도 전체적으로 가볍게 느껴졌고 마감도 깔끔했습니다. 디자인이 무난해서 업무용과 개인용 둘 다 쓰기 좋다는 인상을 받았습니다.",
      images: DEFAULT_REVIEW_IMAGES,
      helpfulCount: 5,
    },
  ];
}

function buildSpecs(product) {
  return [
    ["브랜드", product.brand ?? "브랜드 정보 준비중"],
    ["상품명", product.name],
    ["가격", `₩${Number(product.price).toLocaleString("ko-KR")}`],
    ["평점", `${product.rating ?? 0} / 5`],
    ["배송", "평일 오후 2시 이전 주문 시 당일 출고"],
    ["구성", "상세 스펙 정보 연동 예정"],
  ];
}

function buildOptions(product) {
  return [
    { id: "default", label: "기본 옵션", price: product.price },
    { id: "bundle", label: "기본 액세서리 포함", price: product.price + 50000 },
  ];
}

export function getProductById(id) {
  return PRODUCTS.find((product) => String(product.id) === String(id)) ?? null;
}

export function getProductDetailById(id) {
  const product = getProductById(id);

  if (!product) {
    return null;
  }

  const overrides = DETAIL_OVERRIDES[product.id] ?? DETAIL_OVERRIDES.default;
  const heroImage = product.image ?? ProductImage;
  const reviews = buildReviews(product);
  const photoCount = reviews.filter((review) => (review.images?.length ?? 0) > 0).length;

  return {
    id: String(product.id),
    brand: product.brand ?? product.name.split(" ")[0],
    title: product.name,
    subtitle: overrides.subtitle,
    shortDescription: `${product.name}의 주요 정보와 구매 포인트를 한눈에 확인할 수 있도록 정리한 상품 상세 페이지입니다.`,
    price: product.price,
    rating: product.rating ?? 0,
    reviewCount: reviews.length,
    photoCount,
    shipping: "평일 오후 2시 이전 주문 시 당일 출고",
    heroImage,
    promoImage: overrides.promoImage ?? heroImage,
    secondaryImage: overrides.secondaryImage ?? heroImage,
    gallery: [heroImage, heroImage, heroImage, heroImage, heroImage],
    options: buildOptions(product),
    keyPoints: overrides.keyPoints,
    specs: buildSpecs(product),
    reviews,
  };
}
