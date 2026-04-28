import "./Main.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";
import AICharacter from "components/AICharacter/AICharacter";
import Review_user from "assets/icons/review_user.svg";
import Book from "assets/icons/main/book.svg";
import Direct from "assets/icons/main/direct.svg";
import Game from "assets/icons/main/game.svg";
import Lighting from "assets/icons/main/lighting.svg";
import Together from "assets/icons/main/together.svg";
import More from "components/more/More";
import PackageCard from "components/PackageCard/PackageCard";
import PromptButtonList from "components/PromptButtonList/PromptButtonList";
import ReviewCard from "components/ReviewCard/ReviewCard";
import UpdateSubCard from "components/UpdateSubCard/UpdateSubCard";
import CartIconButton from "components/CartIconButton/CartIconButton";
import WishlistIconButton from "components/WishlistIconButton/WishlistIconButton";
import EventModal from "components/EventModal/EventModal";
import Modal from "components/Modal/Modal";
import { findProductByName } from "@/api/products";
import useProductCatalog from "@/hooks/useProductCatalog";
import { addAiRecommendationHistory } from "@/store/slices/aiRecommendationHistory";
import api from "@/utils/api";
import { getProductListKey, getProductObjectId } from "@/utils/productIdentity";
import { fetchAiRecommendations } from "@/utils/recommendations";
import {
  createAiRecommendationHistoryEntry,
  normalizeAiRecommendationProduct,
} from "@/utils/aiRecommendationMappers";
import newProduct1 from "assets/products/newProduct1.png";
import newProduct2 from "assets/products/newProduct2.png";
import newProduct3 from "assets/products/newProduct3.png";

const EMPTY_AI_PLACEHOLDER = "검색어를 입력해주세요!";

const UPDATE_SHOWCASE_CONFIG = [
  {
    productName: "LG전자 2026 그램 프로16 16Z95U-GS5WK",
    brand: "LG",
    description: "가벼운 휴대성과 큰 화면으로 작업과 강의에 모두 어울려요",
    featuredImage: newProduct1,
  },
  {
    productName: "삼성전자 갤럭시북6 프로 NT940XJG-K51A",
    brand: "삼성",
    description: "선명한 디스플레이와 안정적인 성능으로 멀티 작업에 좋아요",
    featuredImage: newProduct2,
  },
  {
    productName: "ASUS Gaming V16 V3607VM-RP005",
    brand: "ASUS",
    description: "게임과 콘텐츠 작업을 함께 고려한 고성능 노트북이에요",
    featuredImage: newProduct3,
  },
];

const UPDATE_MOBILE_EXTRA_CONFIG = {
  productName: "레노버 LOQ 15AHP10 R7 5060",
  brand: "레노버",
  description: "게이밍 입문부터 실사용까지 두루 어울리는 밸런스형 노트북이에요",
};

const CATEGORY_SECTION_CONFIG = [
  {
    id: "direct",
    label: "영상 편집",
    icon: Direct,
    items: [
      {
        productName: "APPLE 맥북프로14 M5프로 15코어 CPU, 16코어 GPU 실버",
        tags: ["#크리에이터", "#영상편집", "#고성능"],
      },
      {
        productName: "LG전자 2026 그램 프로16 16Z95U-GS5WK",
        tags: ["#대화면", "#휴대성", "#작업용"],
      },
      {
        productName: "삼성전자 갤럭시북6 프로 NT940XJG-K51A",
        tags: ["#프리미엄", "#멀티작업", "#노트북"],
      },
      {
        productName: "ASUS Gaming V16 V3607VM-RP005",
        tags: ["#그래픽", "#게이밍겸용", "#콘텐츠"],
      },
      {
        productName: "APPLE 2026 iPad Air 13 M4",
        tags: ["#태블릿", "#드로잉", "#가벼움"],
      },
      {
        productName: "APPLE 2026 iPad Air 11 M4",
        tags: ["#휴대성", "#필기", "#M시리즈"],
      },
    ],
  },
  {
    id: "game",
    label: "게이밍",
    icon: Game,
    items: [
      {
        productName: "ASUS Gaming V16 V3607VM-RP005",
        tags: ["#게이밍", "#ASUS", "#고성능"],
      },
      {
        productName: "레노버 LOQ 15AHP10 R7 5060",
        tags: ["#LOQ", "#FPS", "#가성비"],
      },
      {
        productName: "HP 오멘 16-ap0117AX",
        tags: ["#OMEN", "#몰입감", "#고사양"],
      },
      {
        productName: "HP 오멘 16-ap0074AX",
        tags: ["#HP", "#게이밍", "#노트북"],
      },
      {
        productName: "MSI 소드 GF76 HX B14WFK-i7 QHD",
        tags: ["#MSI", "#QHD", "#게임"],
      },
      {
        productName: "MSI 지포스 RTX 5070 게이밍 트리오 OC D7 12GB 트라이프로져4",
        tags: ["#RTX5070", "#그래픽카드", "#업그레이드"],
      },
    ],
  },
  {
    id: "student",
    label: "학생",
    icon: Book,
    items: [
      {
        productName: "LG전자 울트라PC 15U50T-GA5HK",
        tags: ["#가성비", "#문서작업", "#노트북"],
      },
      {
        productName: "HP 15-fc1061AU",
        tags: ["#실속형", "#온라인강의", "#휴대"],
      },
      {
        productName: "레노버 아이디어패드 Slim3 15IRU8 82X700HWKR WIN11",
        tags: ["#첫노트북", "#과제", "#윈도우"],
      },
      {
        productName: "ASUS 비보북 15 X1504VA-BQ4270W",
        tags: ["#ASUS", "#강의", "#입문"],
      },
      {
        productName: "삼성전자 갤럭시북5 NT750XHD-KC51G",
        tags: ["#삼성", "#대학생", "#휴대성"],
      },
      {
        productName: "APPLE 2025 iPad A16 11세대",
        tags: ["#태블릿", "#필기", "#가벼움"],
      },
    ],
  },
  {
    id: "together",
    label: "부모님",
    icon: Together,
    items: [
      {
        productName: "APPLE 2025 iPad Pro 11 M5",
        tags: ["#큰화면", "#영상통화", "#태블릿"],
      },
      {
        productName: "APPLE 2025 iPad A16 11세대",
        tags: ["#입문형", "#쉬운사용", "#iPad"],
      },
      {
        productName: "APPLE 2026 iPad Air 13 M4",
        tags: ["#대화면", "#OTT", "#가족공유"],
      },
      {
        productName: "APPLE 아이폰17 프로 256GB, 자급제",
        tags: ["#스마트폰", "#카메라", "#자급제"],
      },
      {
        productName: "APPLE 워치 SE 3세대 40mm 스타라이트 알루미늄",
        tags: ["#건강관리", "#워치", "#알림"],
      },
      {
        productName: "APPLE 2025 iPad Air 11 M3",
        tags: ["#가벼움", "#유튜브", "#태블릿"],
      },
    ],
  },
];

const PACKAGE_CARD_CONFIG = [
  {
    productName: "AMD 라이젠7-6세대 9800X3D (그래니트 릿지)",
    title: "영상편집 추천 조합",
    descriptionLines: ["고성능 CPU · 그래픽카드 중심", "편집 작업에 맞춘 구성"],
    detailItems: [
      { productName: "AMD 라이젠7-6세대 9800X3D (그래니트 릿지)", label: "CPU" },
      { productName: "MSI 지포스 RTX 5060 벤투스 2X OC D7 8GB", label: "VGA" },
      { productName: "TeamGroup DDR5-5600 CL46 Elite 서린", label: "RAM" },
      { productName: "Western Digital WD BLACK SN850X M.2 NVMe", label: "SSD" },
    ],
  },
  {
    productName: "AMD 라이젠7-5세대 7800X3D (라파엘)",
    title: "게이밍 추천 조합",
    descriptionLines: ["빠른 반응과 안정적인 프레임", "게임 플레이에 맞춘 구성"],
    detailItems: [
      { productName: "AMD 라이젠7-5세대 7800X3D (라파엘)", label: "CPU" },
      { productName: "MSI 지포스 RTX 5070 게이밍 트리오 OC D7 12GB 트라이프로져4", label: "VGA" },
      { productName: "ESSENCORE KLEVV DDR5-6000 CL30 CRAS V RGB WHITE 패키지 서린", label: "RAM" },
      { productName: "ESSENCORE KLEVV CRAS C910G M.2 NVMe", label: "SSD" },
    ],
  },
  {
    productName: "AMD 라이젠5-5세대 7500F (라파엘)",
    title: "사무용 추천 조합",
    descriptionLines: ["문서 작업과 온라인 강의에 적합한", "실속형 데스크탑 구성"],
    detailItems: [
      { productName: "AMD 라이젠5-5세대 7500F (라파엘)", label: "CPU" },
      { productName: "GIGABYTE B650M K 피씨디렉트", label: "메인보드" },
      { productName: "TeamGroup DDR5-5600 CL46 Elite 서린", label: "RAM" },
    ],
  },
];

const createFallbackMainProduct = (productName, overrides = {}) => ({
  _id: null,
  productId: null,
  legacyId: null,
  name: overrides.name ?? overrides.title ?? productName ?? "상품명",
  price: overrides.price ?? "0",
  image: overrides.image ?? "",
  rating: overrides.rating ?? 0,
  tag: overrides.tag ?? [],
  ...overrides,
});

const getMainProduct = (products, productName, overrides = {}) => {
  const product = findProductByName(products, productName);

  if (!product) {
    return createFallbackMainProduct(productName, overrides);
  }

  return {
    ...product,
    ...overrides,
    _id: product._id,
    productId: product._id,
    legacyId: product.id ?? null,
    name: overrides.name ?? product.name,
    price: overrides.price ?? product.price,
    image: overrides.image ?? product.image,
    rating: overrides.rating ?? product.rating ?? 0,
  };
};

const createMainProduct = (product = {}) => {
  const productId = getProductObjectId(product);

  return {
    ...product,
    _id: productId,
    productId,
    name: product.name ?? product.title ?? "상품명",
    price: product.price,
    image: product.image,
    rating: product.rating ?? 0,
    spec: product.spec,
    option: product.option,
    category: product.category ?? (Array.isArray(product.tag) ? product.tag.at(-1) : product.tag),
  };
};

const getPrimaryPriceOption = (product) => product.priceOptions?.[0]?.optionName ?? "기본 옵션";

const createUpdateSpecs = (product, brand) => [
  { label: "브랜드", value: brand },
  { label: "분류", value: "노트북" },
  { label: "옵션", value: getPrimaryPriceOption(product) },
  { label: "평점", value: `${product.rating} / 5` },
];

const createUpdateShowcaseItem = (products, { productName, brand, description, featuredImage }) => {
  const product = getMainProduct(products, productName);

  return {
    ...product,
    title: product.name,
    description,
    featuredImage: featuredImage ?? product.image,
    thumbnailImage: product.image,
    specs: createUpdateSpecs(product, brand),
  };
};

const UPDATE_IMAGE_TRANSITION_DURATION = 220;
const CATEGORY_ITEMS_TRANSITION_DURATION = 420;

const toDisplayPrice = (product) => `￦${product.price}`;

const toPackageDetail = (product, label) => ({
  product,
  label: label ?? product.tag?.at(-1) ?? "상품",
  title: product.name,
  subtitle: product.priceOptions?.[0]?.optionName ?? product.tag?.join(" · ") ?? "",
  image: product.image,
});

const normalizeImageUrl = (value) => {
  const raw = String(value ?? "").trim();

  if (!raw || raw.startsWith("http:///")) {
    return "";
  }

  if (raw.startsWith("http://")) {
    return `https://${raw.slice("http://".length)}`;
  }

  return raw;
};

const SkeletonImage = ({
  src,
  alt,
  className = "",
  skeletonClassName = "",
  containerClassName = "skeleton-image-container",
}) => {
  const imageSrc = normalizeImageUrl(src);

  if (!imageSrc) {
    return (
      <Skeleton
        className={`skeleton-image ${className} ${skeletonClassName}`.trim()}
        containerClassName={containerClassName}
      />
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
};

const getAiReviewProductId = (product) => getProductObjectId(product);

const getProductRouteId = (product) => getProductObjectId(product);

const formatAiReviewUserName = (name) => {
  const trimmedName = String(name ?? "").trim();

  if (!trimmedName || /^\?+$/.test(trimmedName)) {
    return "구매 고객";
  }

  return trimmedName;
};

const normalizeLatestAiReview = ({ product, review }) => {
  if (!review) {
    return null;
  }

  return {
    id: String(review._id ?? `${getAiReviewProductId(product)}-latest-review`),
    userImage: normalizeImageUrl(review.user?.profileImage) || Review_user,
    userName: formatAiReviewUserName(review.user?.name),
    productName: product.name,
    description: review.content || "구매 후 작성된 리뷰입니다.",
    rating: Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0))),
  };
};

const fetchLatestAiReviews = async ({ products, signal }) => {
  const reviewResults = await Promise.allSettled(
    products.map(async (product) => {
      const productId = getAiReviewProductId(product);

      if (!productId) {
        return null;
      }

      const response = await api.get(`/reviews/${productId}`, { signal });
      const reviews = Array.isArray(response.data) ? response.data : [];

      return normalizeLatestAiReview({ product, review: reviews[0] });
    }),
  );

  if (signal?.aborted) {
    throw new DOMException("Review request was aborted", "AbortError");
  }

  const latestReviews = reviewResults
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);

  const failedReviewRequests = reviewResults.filter((result) => result.status === "rejected");

  if (latestReviews.length === 0 && failedReviewRequests.length === reviewResults.length) {
    throw failedReviewRequests[0].reason;
  }

  return latestReviews;
};

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products: catalogProducts } = useProductCatalog();
  const [showAiResult, setShowAiResult] = useState(false);
  const [isAiSwitching, setIsAiSwitching] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [isAiInputEmptyError, setIsAiInputEmptyError] = useState(false);
  const [aiStatus, setAiStatus] = useState("idle");
  const [aiMessage, setAiMessage] = useState("");
  const [aiResults, setAiResults] = useState([]);
  const [aiErrorMessage, setAiErrorMessage] = useState("");
  const [aiReviewStatus, setAiReviewStatus] = useState("idle");
  const [aiReviewItems, setAiReviewItems] = useState([]);
  const [aiReviewMessage, setAiReviewMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("direct");
  const [visibleCategory, setVisibleCategory] = useState("direct");
  const [previousCategory, setPreviousCategory] = useState(null);
  const [isCategoryItemsTransitioning, setIsCategoryItemsTransitioning] = useState(false);
  const [selectedSpecProduct, setSelectedSpecProduct] = useState(null);
  const [selectedUpdateIndex, setSelectedUpdateIndex] = useState(0);
  const [hoveredUpdateIndex, setHoveredUpdateIndex] = useState(null);
  const [visibleUpdateIndex, setVisibleUpdateIndex] = useState(0);
  const [incomingUpdateIndex, setIncomingUpdateIndex] = useState(null);
  const [isUpdateImageTransitioning, setIsUpdateImageTransitioning] = useState(false);
  const [isDesktopCategory, setIsDesktopCategory] = useState(false);
  const [isTabletCategory, setIsTabletCategory] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(true);
  const [categorySwiperState, setCategorySwiperState] = useState({
    progress: 0,
    thumbWidth: 25,
  });
  const aiSwitchTimeoutRef = useRef(null);
  const aiRequestAbortRef = useRef(null);
  const updateImageTransitionTimeoutRef = useRef(null);
  const updateImageTransitionRafRef = useRef(null);
  const categoryTransitionTimeoutRef = useRef(null);
  const updateImageCacheRef = useRef(new Set());
  const aiResultSectionRef = useRef(null);
  const categorySwiperRef = useRef(null);
  const categoryProgressRef = useRef(null);
  const promptItems = [
    "🎬 유튜브용 편집용 노트북",
    "🎮 FPS 게임에 맞는 모니터",
    "📚 대학생 첫 노트북 50만원 이하",
    "👨‍👩‍👦 부모님 쉽게 쓸 테블릿",
    "🖨 가정용 프린터 추천",
  ];

  const updateShowcaseItems = useMemo(
    () => UPDATE_SHOWCASE_CONFIG.map((item) => createUpdateShowcaseItem(catalogProducts, item)),
    [catalogProducts],
  );

  const updateMobileItems = useMemo(
    () => [
      ...updateShowcaseItems,
      createUpdateShowcaseItem(catalogProducts, UPDATE_MOBILE_EXTRA_CONFIG),
    ],
    [catalogProducts, updateShowcaseItems],
  );

  const categorySections = useMemo(
    () =>
      CATEGORY_SECTION_CONFIG.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          getMainProduct(catalogProducts, item.productName, { tags: item.tags }),
        ),
      })),
    [catalogProducts],
  );

  const packageCards = useMemo(
    () =>
      PACKAGE_CARD_CONFIG.map((card) => ({
        product: getMainProduct(catalogProducts, card.productName),
        title: card.title,
        description: (
          <>
            {card.descriptionLines[0]} <br />
            {card.descriptionLines[1]}
          </>
        ),
        detailItems: card.detailItems.map((item) =>
          toPackageDetail(getMainProduct(catalogProducts, item.productName), item.label),
        ),
      })),
    [catalogProducts],
  );

  const targetUpdateIndex = hoveredUpdateIndex ?? selectedUpdateIndex;
  const targetUpdateItem = updateShowcaseItems[targetUpdateIndex] ?? updateShowcaseItems[0];
  const visibleUpdateItem = updateShowcaseItems[visibleUpdateIndex] ?? updateShowcaseItems[0];
  const incomingUpdateItem =
    incomingUpdateIndex === null ? null : (updateShowcaseItems[incomingUpdateIndex] ?? null);
  const isUpdatePreviewing =
    hoveredUpdateIndex !== null && hoveredUpdateIndex !== selectedUpdateIndex;
  const updateMobileRowStartIndices = Array.from(
    { length: Math.ceil(updateMobileItems.length / 2) },
    (_, rowIndex) => rowIndex * 2,
  );
  const selectedCategorySection =
    categorySections.find((section) => section.id === selectedCategory) ?? categorySections[0];
  const categoryItems = selectedCategorySection.items;
  const getCategoryItemsById = (categoryId) =>
    (categorySections.find((section) => section.id === categoryId) ?? categorySections[0])?.items ??
    [];
  const aiResultItems = aiResults;

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleAiInput = (e) => {
    const nextQuery = e.target.value;

    setAiQuery(nextQuery);

    if (nextQuery.trim()) {
      setIsAiInputEmptyError(false);
    }

    handleInput(e);
  };

  const startAiResultTransition = () => {
    if (showAiResult) {
      return;
    }

    if (aiSwitchTimeoutRef.current) {
      window.clearTimeout(aiSwitchTimeoutRef.current);
    }

    setIsAiSwitching(true);
    setShowAiResult(true);
    aiSwitchTimeoutRef.current = window.setTimeout(() => {
      setIsAiSwitching(false);
      aiSwitchTimeoutRef.current = null;
    }, 650);
  };

  const handlePromptSelect = (prompt) => {
    const promptWithoutEmoji = String(prompt)
      .replace(/^[^\p{L}\p{N}]+/u, "")
      .trim();
    setAiQuery(promptWithoutEmoji || prompt);
    setIsAiInputEmptyError(false);
  };

  const updateCategorySwiperState = (swiper = categorySwiperRef.current) => {
    if (!swiper || swiper.destroyed) {
      return;
    }

    const totalWidth = Math.max(swiper.virtualSize ?? 0, swiper.width ?? 0, 1);
    const visibleWidth = Math.max(swiper.width ?? 0, 1);
    const nextThumbWidth = (visibleWidth / totalWidth) * 100;

    setCategorySwiperState({
      progress: Math.max(0, Math.min(swiper.progress ?? 0, 1)),
      thumbWidth: Math.max(12, Math.min(nextThumbWidth, 100)),
    });
  };

  const moveCategorySwiperByProgress = (progress) => {
    const swiper = categorySwiperRef.current;

    if (!swiper || swiper.destroyed) {
      return;
    }

    swiper.setProgress(Math.max(0, Math.min(progress, 1)), 0);
    updateCategorySwiperState(swiper);
  };

  const handleCategoryProgressPointerDown = (event) => {
    const progressBar = categoryProgressRef.current;

    if (!progressBar) {
      return;
    }

    const updateFromPointer = (pointerEvent) => {
      const rect = progressBar.getBoundingClientRect();
      const progress = rect.width === 0 ? 0 : (pointerEvent.clientX - rect.left) / rect.width;
      moveCategorySwiperByProgress(progress);
    };

    const handlePointerMove = (pointerEvent) => {
      updateFromPointer(pointerEvent);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    event.preventDefault();
    updateFromPointer(event);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();

    const query = aiQuery.trim();

    if (!query) {
      setAiQuery("");
      setIsAiInputEmptyError(true);
      return;
    }

    setIsAiInputEmptyError(false);

    if (aiRequestAbortRef.current) {
      aiRequestAbortRef.current.abort();
    }

    const controller = new AbortController();
    aiRequestAbortRef.current = controller;

    setAiStatus("loading");
    setAiErrorMessage("");
    setAiMessage("조건에 맞는 상품을 찾는 중입니다.");
    setAiResults([]);
    setAiReviewStatus("idle");
    setAiReviewItems([]);
    setAiReviewMessage("");
    startAiResultTransition();

    try {
      const result = await fetchAiRecommendations({
        query,
        limit: 3,
        signal: controller.signal,
      });
      const nextResults = Array.isArray(result.products)
        ? result.products.map(normalizeAiRecommendationProduct)
        : [];
      const nextMessage =
        result.message ||
        (nextResults.length > 0
          ? "현재 상품 데이터 기준으로 조건에 가까운 제품을 골랐어요."
          : "조건에 맞는 상품을 찾지 못했어요. 조건을 조금 더 넓혀볼까요?");

      setAiResults(nextResults);
      setAiMessage(nextMessage);
      setAiStatus(nextResults.length > 0 ? "success" : "empty");
      setAiReviewStatus(nextResults.length > 0 ? "loading" : "idle");

      if (nextResults.length === 0) {
        return;
      }

      dispatch(
        addAiRecommendationHistory(
          createAiRecommendationHistoryEntry({
            query,
            message: nextMessage,
            products: nextResults,
          }),
        ),
      );

      try {
        const latestReviews = await fetchLatestAiReviews({
          products: nextResults,
          signal: controller.signal,
        });

        setAiReviewItems(latestReviews);
        setAiReviewStatus(latestReviews.length > 0 ? "success" : "empty");
        setAiReviewMessage(
          latestReviews.length > 0 ? "" : "추천 상품에 아직 등록된 구매 리뷰가 없습니다.",
        );
      } catch (reviewError) {
        if (reviewError.name === "CanceledError" || reviewError.name === "AbortError") {
          return;
        }

        setAiReviewStatus("error");
        setAiReviewMessage("추천 상품의 최신 구매 리뷰를 불러오지 못했습니다.");
      }
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        return;
      }

      setAiStatus("error");
      setAiErrorMessage("추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      setAiMessage("추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      setAiResults([]);
      setAiReviewStatus("idle");
      setAiReviewItems([]);
      setAiReviewMessage("");
    } finally {
      if (aiRequestAbortRef.current === controller) {
        aiRequestAbortRef.current = null;
      }
    }
  };

  const navigateToProduct = (product) => {
    const productId =
      typeof product === "object" && product !== null ? getProductRouteId(product) : product;

    if (productId !== undefined && productId !== null) {
      navigate(`/product/${productId}`);
    }
  };

  const stopCardAction = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    updateShowcaseItems.forEach((item) => {
      const imageSrc = item.featuredImage;

      if (!imageSrc || updateImageCacheRef.current.has(imageSrc)) {
        return;
      }

      const preloadImage = new window.Image();

      preloadImage.onload = () => {
        updateImageCacheRef.current.add(imageSrc);
      };
      preloadImage.onerror = () => {
        updateImageCacheRef.current.add(imageSrc);
      };
      preloadImage.src = imageSrc;
    });
  }, [updateShowcaseItems]);

  useEffect(() => {
    const targetItem = updateShowcaseItems[targetUpdateIndex] ?? updateShowcaseItems[0];

    if (!targetItem) {
      return undefined;
    }

    if (updateImageTransitionTimeoutRef.current) {
      window.clearTimeout(updateImageTransitionTimeoutRef.current);
      updateImageTransitionTimeoutRef.current = null;
    }

    if (updateImageTransitionRafRef.current) {
      window.cancelAnimationFrame(updateImageTransitionRafRef.current);
      updateImageTransitionRafRef.current = null;
    }

    if (visibleUpdateIndex === targetUpdateIndex) {
      setIncomingUpdateIndex(null);
      setIsUpdateImageTransitioning(false);
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finalizeTransition = () => {
      setVisibleUpdateIndex(targetUpdateIndex);
      setIncomingUpdateIndex(null);
      setIsUpdateImageTransitioning(false);
      updateImageTransitionTimeoutRef.current = null;
    };
    const runTransition = () => {
      if (prefersReducedMotion) {
        finalizeTransition();
        return;
      }

      setIncomingUpdateIndex(targetUpdateIndex);
      setIsUpdateImageTransitioning(false);

      updateImageTransitionRafRef.current = window.requestAnimationFrame(() => {
        updateImageTransitionRafRef.current = window.requestAnimationFrame(() => {
          setIsUpdateImageTransitioning(true);
        });
      });

      updateImageTransitionTimeoutRef.current = window.setTimeout(
        finalizeTransition,
        UPDATE_IMAGE_TRANSITION_DURATION,
      );
    };

    const nextImageSrc = targetItem.featuredImage;

    if (!nextImageSrc || updateImageCacheRef.current.has(nextImageSrc)) {
      runTransition();
      return undefined;
    }

    const nextImage = new window.Image();
    const handleReady = () => {
      updateImageCacheRef.current.add(nextImageSrc);
      runTransition();
    };

    nextImage.onload = handleReady;
    nextImage.onerror = handleReady;
    nextImage.src = nextImageSrc;

    return () => {
      nextImage.onload = null;
      nextImage.onerror = null;
    };
  }, [targetUpdateIndex, visibleUpdateIndex, updateShowcaseItems]);

  useEffect(
    () => () => {
      if (aiSwitchTimeoutRef.current) {
        window.clearTimeout(aiSwitchTimeoutRef.current);
      }

      if (aiRequestAbortRef.current) {
        aiRequestAbortRef.current.abort();
      }

      if (updateImageTransitionTimeoutRef.current) {
        window.clearTimeout(updateImageTransitionTimeoutRef.current);
      }

      if (updateImageTransitionRafRef.current) {
        window.cancelAnimationFrame(updateImageTransitionRafRef.current);
      }

      if (categoryTransitionTimeoutRef.current) {
        window.clearTimeout(categoryTransitionTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (selectedCategory === visibleCategory) {
      return undefined;
    }

    setCategorySwiperState((prev) => ({
      ...prev,
      progress: 0,
    }));

    if (categoryTransitionTimeoutRef.current) {
      window.clearTimeout(categoryTransitionTimeoutRef.current);
      categoryTransitionTimeoutRef.current = null;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setVisibleCategory(selectedCategory);
      setPreviousCategory(null);
      setIsCategoryItemsTransitioning(false);
      return undefined;
    }

    setPreviousCategory(visibleCategory);
    setVisibleCategory(selectedCategory);
    setIsCategoryItemsTransitioning(true);
    categoryTransitionTimeoutRef.current = window.setTimeout(() => {
      setPreviousCategory(null);
      setIsCategoryItemsTransitioning(false);
      categoryTransitionTimeoutRef.current = null;
    }, CATEGORY_ITEMS_TRANSITION_DURATION);

    return () => {
      if (categoryTransitionTimeoutRef.current) {
        window.clearTimeout(categoryTransitionTimeoutRef.current);
        categoryTransitionTimeoutRef.current = null;
      }
    };
  }, [selectedCategory, visibleCategory]);

  useEffect(() => {
    if (aiStatus !== "success" || aiResults.length === 0 || !showAiResult || !isDesktopCategory) {
      return undefined;
    }

    const scrollTimeoutIds = [];
    const recommendationImages = [];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollRecommendationRangeIntoView = () => {
      const recommendationItems = aiResultSectionRef.current?.querySelector(".recommends");
      const aiInputContainer = aiResultSectionRef.current?.querySelector(".AI_chat_container");

      if (!recommendationItems || !aiInputContainer) {
        return;
      }

      const recommendationRect = recommendationItems.getBoundingClientRect();
      const inputRect = aiInputContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const targetTop = recommendationRect.top + window.scrollY;
      const targetBottom = inputRect.bottom + window.scrollY;
      const targetHeight = targetBottom - targetTop;
      const targetScrollTop =
        targetHeight >= viewportHeight
          ? targetTop
          : targetTop - (viewportHeight - targetHeight) / 2;

      window.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    const scrollFrameId = window.requestAnimationFrame(() => {
      scrollRecommendationRangeIntoView();

      recommendationImages.push(
        ...(aiResultSectionRef.current?.querySelectorAll(".recommends img") ?? []),
      );
      recommendationImages.forEach((image) => {
        if (!image.complete) {
          image.addEventListener("load", scrollRecommendationRangeIntoView, { once: true });
        }
      });

      [450, 900, 1300].forEach((delay) => {
        scrollTimeoutIds.push(window.setTimeout(scrollRecommendationRangeIntoView, delay));
      });
    });

    return () => {
      window.cancelAnimationFrame(scrollFrameId);
      scrollTimeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      recommendationImages.forEach((image) => {
        image.removeEventListener("load", scrollRecommendationRangeIntoView);
      });
    };
  }, [aiResults.length, aiStatus, isDesktopCategory, showAiResult]);

  useEffect(() => {
    const resetAiSection = () => {
      if (aiSwitchTimeoutRef.current) {
        window.clearTimeout(aiSwitchTimeoutRef.current);
        aiSwitchTimeoutRef.current = null;
      }

      setShowAiResult(false);
      setIsAiSwitching(false);
      setAiStatus("idle");
      setAiMessage("");
      setAiErrorMessage("");
      setIsAiInputEmptyError(false);
      setAiResults([]);
      setAiReviewStatus("idle");
      setAiReviewItems([]);
      setAiReviewMessage("");
    };

    window.addEventListener("reset-main-ai-section", resetAiSection);

    return () => {
      window.removeEventListener("reset-main-ai-section", resetAiSection);
    };
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");

    const syncScreenState = () => {
      setIsDesktopCategory(desktopQuery.matches);
      setIsTabletCategory(tabletQuery.matches);
    };

    syncScreenState();

    const addListener = (query, handler) => {
      if (query.addEventListener) {
        query.addEventListener("change", handler);
      } else {
        query.addListener(handler);
      }
    };

    const removeListener = (query, handler) => {
      if (query.removeEventListener) {
        query.removeEventListener("change", handler);
      } else {
        query.removeListener(handler);
      }
    };

    addListener(desktopQuery, syncScreenState);
    addListener(tabletQuery, syncScreenState);

    return () => {
      removeListener(desktopQuery, syncScreenState);
      removeListener(tabletQuery, syncScreenState);
    };
  }, []);

  useEffect(() => {
    const swiper = categorySwiperRef.current;

    if (swiper && !swiper.destroyed) {
      swiper.slideTo(0, 0, false);
      swiper.update();
      updateCategorySwiperState(swiper);
    }

    const handleResize = () => {
      const currentSwiper = categorySwiperRef.current;

      if (currentSwiper && !currentSwiper.destroyed) {
        currentSwiper.update();
        updateCategorySwiperState(currentSwiper);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isDesktopCategory, isTabletCategory, selectedCategory, categoryItems.length]);

  const renderAiReviewContent = () => {
    if (aiStatus === "loading") {
      return (
        <div className="AI_review_state">
          추천 상품이 정리되면 상품별 최신 구매 리뷰를 함께 불러올게요.
        </div>
      );
    }

    if (aiStatus === "empty" || aiStatus === "error") {
      return (
        <div className="AI_review_state">
          추천 상품이 준비되면 실제 구매 리뷰를 상품별로 보여드릴게요.
        </div>
      );
    }

    if (aiReviewStatus === "loading") {
      return <div className="AI_review_state">추천 상품별 최신 구매 리뷰를 불러오는 중입니다.</div>;
    }

    if (aiReviewStatus === "error" || aiReviewStatus === "empty") {
      return (
        <div className="AI_review_state">
          {aiReviewMessage || "추천 상품에 아직 등록된 구매 리뷰가 없습니다."}
        </div>
      );
    }

    if (aiReviewItems.length === 0) {
      return (
        <div className="AI_review_state">
          AI 추천 상품을 선택하면 상품별 최신 구매 리뷰가 표시됩니다.
        </div>
      );
    }

    const isMobileAiReview = !isTabletCategory && !isDesktopCategory;

    if (isMobileAiReview) {
      return (
        <Swiper className="review_box review_swiper" slidesPerView={1.12} spaceBetween={12}>
          {aiReviewItems.map((review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard
                userImage={review.userImage}
                userName={review.userName}
                productName={review.productName}
                description={review.description}
                rating={review.rating}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    return (
      <div className="review_box">
        {aiReviewItems.map((review) => (
          <ReviewCard
            key={review.id}
            userImage={review.userImage}
            userName={review.userName}
            productName={review.productName}
            description={review.description}
            rating={review.rating}
          />
        ))}
      </div>
    );
  };

  const renderAiReviewSection = () => (
    <section className="main-page__section main-page__section--ai-review">
      <div className="back back--ai-review" />
      <div className="section__AI_Review sections section__AI_Review--revealed">
        <div className="text_box">
          <h2>AI 추천 제품 실제 구매 리뷰</h2>
          <h4>추천 상품 목록과 같은 순서로, 각 상품의 최신 구매 리뷰를 보여드립니다.</h4>
        </div>
        {renderAiReviewContent()}
      </div>
    </section>
  );

  const renderInitialAiSection = (isLeaving = false) => (
    <div className={`ai-stage__layer ai-stage__layer--initial ${isLeaving ? "is-leaving" : ""}`}>
      <div className="section__AI sections">
        <div className="AI_container">
          <div className="AI_description">
            <button>
              <div className="circle"></div>AI 전자기기 추천 서비스
            </button>
            <h2 className="AI_Main_text">
              복잡한 스펙 비교,
              <br /> 이제 <span className="input">AI 고르미</span>에게
              <br /> 맡기세요
            </h2>
            <p className="AI_sub_text">
              용도 · 예산 · 사용환경을 말하면
              <br /> 수천 개의 제품 중 딱 맞는 전자기기를 골라드려요
              <br />
              어려운 스펙 설명 없이, 쉽고 빠르게.
            </p>
            <div className="AI_Chat_row_2">
              <PromptButtonList items={promptItems} onSelect={handlePromptSelect} />
            </div>
          </div>
          <AICharacter className="AI_logo" />
        </div>
        <div className="AI_chat_container">
          <form action="#" method="POST" onSubmit={handleAiSubmit}>
            <div className="AI_Chat_row_1">
              <textarea
                className={isAiInputEmptyError ? "is-ai-input-error" : undefined}
                name="ai_chat"
                id="ai_chat"
                rows={1}
                placeholder={isAiInputEmptyError ? EMPTY_AI_PLACEHOLDER : "무엇이든 물어보세요!"}
                value={aiQuery}
                onChange={handleAiInput}
              />
              <button className="submit" type="submit" disabled={aiStatus === "loading"}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#0AA6A6" />
                  <path
                    d="M8 13L12 9L16 13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="AI_Chat_row_2">
              <PromptButtonList
                items={promptItems}
                variant="result"
                onSelect={handlePromptSelect}
              />
              <button
                className="submit"
                type="submit"
                disabled={aiStatus === "loading"}
                style={{ paddingRight: "0px" }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#0AA6A6" />
                  <path
                    d="M13 22L20 15L27 22"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderCategoryCard = (item) => {
    const product = createMainProduct(item);

    return (
      <div className="items" key={getProductListKey(item, item.name)}>
        <div className="item_img_box">
          <SkeletonImage src={item.image} alt={item.name} className="item_img" onClick={() => navigateToProduct(item)}/>
          <div className="icons" onClick={stopCardAction}>
            <CartIconButton product={product} size="sm" />
            <WishlistIconButton product={product} size="sm" />
          </div>
        </div>
        <button type="button" className="item_name" onClick={() => navigateToProduct(item)}>
          {item.name}
        </button>
        <div className="options">
          {item.tags.map((tag) => (
            <p key={tag}>{tag}</p>
          ))}
        </div>
        <p className="item_price">{toDisplayPrice(item)}</p>
        <div className="item_colors">
          <div className="color1 colors"></div>
          <div className="color2 colors"></div>
        </div>
      </div>
    );
  };

  const renderCategorySwiper = (categoryId, { layer = "active", isInteractive = true } = {}) => {
    const isDesktop = isDesktopCategory;
    const items = getCategoryItemsById(categoryId);

    return (
      <div
        className={`category-items-layer category-items-layer--${layer} ${
          isCategoryItemsTransitioning ? "is-transitioning" : ""
        }`.trim()}
        aria-hidden={!isInteractive}
      >
        <Swiper
          key={`category-swiper-${categoryId}-${
            isDesktop ? "desktop" : isTabletCategory ? "tablet" : "mobile"
          }`}
          className="item_box category_swiper"
          spaceBetween={isDesktop ? 20 : isTabletCategory ? 24 : 10}
          slidesPerView={isDesktop ? 3.15 : isTabletCategory ? 2.7 : 2.1}
          onSwiper={(swiper) => {
            if (isInteractive) {
              categorySwiperRef.current = swiper;
              updateCategorySwiperState(swiper);
            }
          }}
          onProgress={isInteractive ? updateCategorySwiperState : undefined}
          onSlideChange={isInteractive ? updateCategorySwiperState : undefined}
          allowTouchMove={isInteractive}
        >
          {items.map((item) => (
            <SwiperSlide key={getProductListKey(item, item.name)}>
              {renderCategoryCard(item)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  const renderCategoryItems = () => {
    const isDesktop = isDesktopCategory;

    return (
      <>
        <div className="category-items-stage">
          {renderCategorySwiper(visibleCategory, { layer: "active", isInteractive: true })}
          {previousCategory
            ? renderCategorySwiper(previousCategory, {
                layer: "previous",
                isInteractive: false,
              })
            : null}
        </div>
        <div
          className={`unfilled ${isDesktop ? "unfilled--desktop" : ""}`}
          ref={categoryProgressRef}
          onPointerDown={handleCategoryProgressPointerDown}
          role="slider"
          aria-label="목적별 추천 카테고리 위치"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(categorySwiperState.progress * 100)}
          tabIndex={0}
        >
          <div
            className={`filled ${isDesktop ? "filled--desktop" : ""}`}
            style={{
              width: `${categorySwiperState.thumbWidth}%`,
              left: `calc((100% - ${categorySwiperState.thumbWidth}%) * ${categorySwiperState.progress})`,
            }}
          ></div>
        </div>
      </>
    );
  };

  const renderPackageCards = () => (
    <>
      {packageCards.map((card) => (
        <PackageCard
          key={getProductListKey(card.product, card.title)}
          product={card.product}
          title={card.title}
          description={card.description}
          price={toDisplayPrice(card.product)}
          mainImage={card.product.image}
          detailItems={card.detailItems}
        />
      ))}
    </>
  );

  const renderPackageSectionItems = () => {
    if (isDesktopCategory) {
      return <div className="pakage_boxs">{renderPackageCards()}</div>;
    }

    return (
      <Swiper
        className="pakage_boxs pakage_swiper"
        slidesPerView="auto"
        spaceBetween={isTabletCategory ? 28 : 24}
      >
        {packageCards.map((card) => (
          <SwiperSlide key={`package-${getProductListKey(card.product, card.title)}`}>
            <PackageCard
              product={card.product}
              title={card.title}
              description={card.description}
              price={toDisplayPrice(card.product)}
              mainImage={card.product.image}
              detailItems={card.detailItems}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const renderResultAiSection = (isEntering = false) => (
    <div className={`ai-stage__layer ai-stage__layer--result ${isEntering ? "is-entering" : ""}`}>
      <div className="section__AI_result sections" ref={aiResultSectionRef}>
        {aiStatus === "loading" ? (
          <div className="AI_result_state">상품 데이터 기준으로 추천을 준비하고 있어요.</div>
        ) : null}
        {aiStatus === "error" ? (
          <div className="AI_result_state AI_result_state--error">{aiErrorMessage}</div>
        ) : null}
        {aiStatus === "empty" ? (
          <div className="AI_result_state">
            조건에 맞는 상품이 없습니다. 예산이나 용도를 넓혀보세요.
          </div>
        ) : null}
        {aiResultItems.length > 0 ? (
          <Swiper
            className="recommends"
            slidesPerView={1.4}
            spaceBetween={12}
            breakpoints={{
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {aiResultItems.map((item, index) => (
              <SwiperSlide key={`ai-result-${getProductListKey(item, String(index))}`}>
                <div
                  className="recommend"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigateToProduct(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigateToProduct(item);
                    }
                  }}
                >
                  <SkeletonImage src={item.image} alt={item.name} className="recommend_img" />
                  <div className="texts">
                    <p>{item.name}</p>
                    <p>{item.spec}</p>
                  </div>
                  <div className="go">
                    <p className="price">{toDisplayPrice(item)}</p>
                    <button
                      type="button"
                      className="chevron"
                      aria-label={`${item.name} 상세페이지로 이동`}
                      onClick={(event) => {
                        event.stopPropagation();
                        navigateToProduct(item);
                      }}
                    >
                      <svg viewBox="0 0 24 12">
                        <path d="M2 10L12 2L22 10" />
                      </svg>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
        <div className="AI_chat_response">
          <img src={Lighting} alt="Lighting" />
          <p>
            {aiMessage ||
              "자연어로 원하는 용도와 예산을 입력하면 상품 데이터 기준으로 추천해드릴게요."}
          </p>
        </div>
        <div className="AI_chat_container">
          <form action="#" method="POST" onSubmit={handleAiSubmit}>
            <div className="AI_Chat_row_1">
              <textarea
                className={isAiInputEmptyError ? "is-ai-input-error" : undefined}
                name="ai_chat"
                id="ai_chat"
                rows={1}
                placeholder={
                  isAiInputEmptyError ? EMPTY_AI_PLACEHOLDER : "대학생용 가벼운 노트북 추천해줘."
                }
                value={aiQuery}
                onChange={handleAiInput}
              />
              <button className="submit" type="submit" disabled={aiStatus === "loading"}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#0AA6A6" />
                  <path
                    d="M8 13L12 9L16 13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="AI_Chat_row_2">
              <PromptButtonList items={promptItems} onSelect={handlePromptSelect} />
              <button className="submit" type="submit" disabled={aiStatus === "loading"}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#0AA6A6" />
                  <path
                    d="M13 22L20 15L27 22"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <main className="main-page">
      <h1 className="hidden">메인 페이지</h1>
      <section
        className={`main-page__section main-page__section--ai ${
          showAiResult ? "is-ai-result" : "is-ai-initial"
        } ${isAiSwitching ? "is-ai-switching" : ""}`}
        data-hide-floating-chat
      >
        <div className={`back ${showAiResult ? "back--ai-result" : "back--ai"}`} />
        <div className="ai-stage">
          {!showAiResult || isAiSwitching ? renderInitialAiSection(isAiSwitching) : null}
          {showAiResult ? renderResultAiSection(isAiSwitching) : null}
        </div>
      </section>
      {showAiResult ? renderAiReviewSection() : null}
      <section className="main-page__section">
        <div className="back back--set-category" />
        <div className="section__Set_Category sections">
          <div className="category_top">
            <div className="main-texts">
              <h2>목적별 추천 카테고리</h2>
              <h4>어떤 용도로 사용하시나요? 목적에 맞는 제품을 바로 찾아드려요</h4>
            </div>
            <More />
          </div>
          <div className="categories" aria-label="목적별 추천 카테고리">
            {categorySections.map((section) => {
              const isActive = section.id === selectedCategory;

              return (
                <button
                  key={section.id}
                  type="button"
                  className={`category ${isActive ? "is-active" : ""}`.trim()}
                  onClick={() => setSelectedCategory(section.id)}
                  aria-pressed={isActive}
                >
                  <img src={section.icon} alt="" aria-hidden="true" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
          {renderCategoryItems()}
        </div>
      </section>
      <section className="main-page__section">
        <div className="back back--collaborates" />
        <div className="section__Collarborates sections">
          <div className="category_top">
            <div className="texts">
              <h2>추천 조합</h2>
              <h4>함께 사면 시너지 효과가 큰 제품 세트를 고르미가 골라드려요</h4>
            </div>
            <More className="more--desktop-only" />
          </div>
          {renderPackageSectionItems()}
        </div>
      </section>
      <section className="main-page__section">
        <div className="back back--new-update" />
        <div className="section__New_Update sections">
          <div className="category_top">
            <h2>최신 업데이트 상품</h2>
            <h4>새로 입고된 신제품과 업데이트된 상품이에요</h4>
            <More />
          </div>
          <div className="desktop">
            <div
              className="main_item"
              role="button"
              tabIndex={0}
              onClick={() => navigateToProduct(targetUpdateItem)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigateToProduct(targetUpdateItem);
                }
              }}
            >
              <div className={`main_item__image ${incomingUpdateItem ? "is-transitioning" : ""}`}>
                <SkeletonImage
                  key={`featured-current-${getProductListKey(visibleUpdateItem, "featured-current")}`}
                  src={visibleUpdateItem.featuredImage}
                  alt={visibleUpdateItem.title}
                  className={`featured_img featured_img--current ${
                    incomingUpdateItem && isUpdateImageTransitioning ? "is-subdued" : ""
                  }`}
                />
                {incomingUpdateItem && (
                  <SkeletonImage
                    key={`featured-next-${getProductListKey(incomingUpdateItem, "featured-next")}`}
                    src={incomingUpdateItem.featuredImage}
                    alt={incomingUpdateItem.title}
                    className={`featured_img featured_img--incoming ${
                      isUpdateImageTransitioning ? "is-visible" : ""
                    }`}
                  />
                )}
              </div>
              <div className="modal_info" onClick={stopCardAction}>
                <div className="options">
                  {targetUpdateItem.specs.map((spec) => (
                    <div className="option" key={spec.label}>
                      <p>{spec.label}</p>
                      <p className="item_info">{spec.value}</p>
                    </div>
                  ))}
                  <div className="option">
                    <p>가격</p>
                    <p className="item_info">{toDisplayPrice(targetUpdateItem)}</p>
                  </div>
                </div>
                <div className="icons">
                  <CartIconButton product={createMainProduct(targetUpdateItem)} size="sm" />
                  <WishlistIconButton product={createMainProduct(targetUpdateItem)} size="sm" />
                </div>
              </div>
            </div>
            <div className="sub_item">
              {updateShowcaseItems.map((item, index) => (
                <UpdateSubCard
                  key={getProductListKey(item, item.name)}
                  thumbnailImage={normalizeImageUrl(item.thumbnailImage)}
                  title={item.title}
                  description={item.description}
                  isActive={selectedUpdateIndex === index}
                  isPreview={hoveredUpdateIndex === index && isUpdatePreviewing}
                  onClick={() => setSelectedUpdateIndex(index)}
                  onMouseEnter={() => setHoveredUpdateIndex(index)}
                  onMouseLeave={() => setHoveredUpdateIndex(null)}
                  onFocus={() => setHoveredUpdateIndex(index)}
                  onBlur={() => setHoveredUpdateIndex(null)}
                  onChevronClick={() => navigateToProduct(item)}
                />
              ))}
            </div>
          </div>
          <div className="mobile">
            <div className="item_boxs">
              {updateMobileRowStartIndices.map((startIndex) => (
                <div className="item_row" key={`update-mobile-row-${startIndex}`}>
                  {updateMobileItems.slice(startIndex, startIndex + 2).map((item) => (
                    <div
                      className="item_box"
                      key={item.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigateToProduct(item)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          navigateToProduct(item);
                        }
                      }}
                    >
                      <div className="items">
                        <div className="item_img_box">
                          <SkeletonImage
                            src={item.thumbnailImage}
                            alt={item.name}
                            className="item_img"
                          />
                          <div className="icons">
                            <CartIconButton product={createMainProduct(item)} size="sm" />
                            <WishlistIconButton product={createMainProduct(item)} size="sm" />
                          </div>
                        </div>
                        <div className="item_texts">
                          <p className="item_name">{item.name}</p>
                          <p className="item_price">{toDisplayPrice(item)}</p>
                          <button
                            type="button"
                            className="item_spec"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedSpecProduct(item);
                            }}
                          >
                            주요스펙
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
      {selectedSpecProduct && (
        <Modal title="주요스펙" onClose={() => setSelectedSpecProduct(null)}>
          <div className="main-spec-modal">
            <div className="main-spec-modal__summary">
              <div className="main-spec-modal__image">
                <SkeletonImage
                  src={selectedSpecProduct.image}
                  alt={selectedSpecProduct.name}
                  className="main-spec-modal__img"
                />
              </div>
              <div className="main-spec-modal__product">
                <p className="main-spec-modal__name">{selectedSpecProduct.name}</p>
                <p className="main-spec-modal__price">{toDisplayPrice(selectedSpecProduct)}</p>
              </div>
            </div>
            <dl className="main-spec-modal__list">
              {selectedSpecProduct.specs?.map((spec) => (
                <div className="main-spec-modal__row" key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
            <div className="main-spec-modal__actions">
              <button
                type="button"
                className="main-spec-modal__button main-spec-modal__button--ghost"
                onClick={() => setSelectedSpecProduct(null)}
              >
                닫기
              </button>
              <button
                type="button"
                className="main-spec-modal__button main-spec-modal__button--primary"
                onClick={() => navigateToProduct(selectedSpecProduct)}
              >
                상세보기
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

export default Main;
