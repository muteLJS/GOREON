import EventCoupon5Image from "@/assets/event/eventCoupon.png";
import EventCoupon20Image from "@/assets/event/20discountCoupon.png";

export const EVENT_MODAL_STEPS = {
  INTRO: "intro",
  DRAWING: "drawing",
  RESULT: "result",
  MY_BENEFIT: "myBenefit",
};

export const EVENT_MODAL_DISMISS_STORAGE_KEY = "goreon-event-modal-dismiss-until";
export const EVENT_MODAL_LOGIN_ALERT = "로그인 후 이용 가능합니다.";

export const EVENT_MODAL_INTRO_CONTENT = {
  eyebrow: "오늘의 랜덤 혜택",
  title: "고르미가 선물을 고르는 중이에요!",
  infoTitle: "어떤 혜택이 나올까요?",
  infoDescription: "5%~20% 할인 쿠폰 또는 특별 사은품을 드려요!",
  primaryButtonLabel: "뽑기 시작하기",
  dismissLabel: "오늘 하루 안보기 X",
};

export const EVENT_MODAL_DRAWING_CONTENT = {
  eyebrow: "두근두근",
  title: "혜택을 뽑는 중...",
  caption: "잠시만 기다려주세요!",
  progressDuration: 3000,
};

export const EVENT_MODAL_COUPONS = [
  {
    id: "coupon-5",
    discountRate: 5,
    title: "5% 할인 쿠폰",
    resultTitle: "5% 할인 쿠폰",
    couponCode: "GOREON-5A3D",
    expireText: "3일 후 만료",
    image: EventCoupon5Image,
  },
  {
    id: "coupon-20",
    discountRate: 20,
    title: "20% 할인 쿠폰",
    resultTitle: "20% 할인 쿠폰",
    couponCode: "GOREON-20A3",
    expireText: "3일 후 만료",
    image: EventCoupon20Image,
  },
];

export const getRandomEventCoupon = () =>
  EVENT_MODAL_COUPONS[Math.floor(Math.random() * EVENT_MODAL_COUPONS.length)];

export const DEFAULT_EVENT_COUPON = EVENT_MODAL_COUPONS[0];

export const EVENT_MODAL_RESULT_CONTENT = {
  eyebrow: "축하해요!",
  titleSuffix: "에 당첨됐어요",
  codeLabel: "쿠폰 코드",
  copyButtonLabel: "복사",
  continueButtonLabel: "쇼핑 계속하기",
  benefitButtonLabel: "혜택 보러가기",
};

export const EVENT_MODAL_BENEFIT_CONFIGS = [
  {
    id: "benefit-coupon",
    headerTitle: "나의 뽑기 혜택",
    recommendationTitle: "이 쿠폰으로 추천해드려요",
    recommendationBadge: "AI 추천",
    recommendationDescription: "영상 편집에 딱 맞는 노트북을 모아봤어요",
    productQueryType: "laptop",
    productFallbackTag: "노트북",
    productLimit: 3,
  },
];
