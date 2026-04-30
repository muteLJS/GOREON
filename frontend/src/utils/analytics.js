const GA_ID = import.meta.env.VITE_GA_ID;

const SHOPPER_SEGMENT_STORAGE_KEY = "goreon:analytics:shopper-segment";

export const SHOPPER_SEGMENTS = {
  GUIDED: "guided_shopper",
  SELF_DISCOVERY: "self_discovery_shopper",
  HYBRID: "hybrid_shopper",
};

export const SHOPPING_BEHAVIOR_TYPES = {
  GUIDED: "guided",
  SELF_DISCOVERY: "self_discovery",
};

const getStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getStoredBehaviorState = () => {
  const storage = getStorage();

  if (!storage) {
    return {
      hasGuidedSignal: false,
      hasSelfDiscoverySignal: false,
      shopperSegment: "",
    };
  }

  try {
    const parsedState = JSON.parse(storage.getItem(SHOPPER_SEGMENT_STORAGE_KEY) || "{}");

    return {
      hasGuidedSignal: Boolean(parsedState.hasGuidedSignal),
      hasSelfDiscoverySignal: Boolean(parsedState.hasSelfDiscoverySignal),
      shopperSegment: parsedState.shopperSegment || "",
    };
  } catch {
    return {
      hasGuidedSignal: false,
      hasSelfDiscoverySignal: false,
      shopperSegment: "",
    };
  }
};

const saveBehaviorState = (state) => {
  const storage = getStorage();

  if (!storage) return;

  try {
    storage.setItem(SHOPPER_SEGMENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable in private mode or when quota is exceeded.
  }
};

const resolveShopperSegment = ({ hasGuidedSignal, hasSelfDiscoverySignal }) => {
  if (hasGuidedSignal && hasSelfDiscoverySignal) return SHOPPER_SEGMENTS.HYBRID;
  if (hasGuidedSignal) return SHOPPER_SEGMENTS.GUIDED;
  if (hasSelfDiscoverySignal) return SHOPPER_SEGMENTS.SELF_DISCOVERY;
  return "";
};

const sanitizeEventParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  );

const setUserProperties = (properties) => {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;

  window.gtag("set", "user_properties", sanitizeEventParams(properties));
};

export const syncShopperSegment = () => {
  const state = getStoredBehaviorState();
  const shopperSegment = resolveShopperSegment(state);

  if (!shopperSegment) return;

  setUserProperties({
    shopper_segment: shopperSegment,
    guided_shopper: state.hasGuidedSignal ? "yes" : "no",
    self_discovery_shopper: state.hasSelfDiscoverySignal ? "yes" : "no",
  });
};

// 🔹 페이지뷰
export const trackPageView = (path) => {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;

  syncShopperSegment();

  window.gtag("config", GA_ID, {
    page_path: path,
  });
};

// 🔹 공용 이벤트 함수
export const trackEvent = ({ action, category, label, value, params }) => {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;

  window.gtag(
    "event",
    action,
    sanitizeEventParams({
      event_category: category,
      event_label: label,
      value,
      ...params,
    }),
  );
};

export const trackShoppingBehavior = ({ behaviorType, signal, source, label, value, params }) => {
  const currentState = getStoredBehaviorState();
  const nextState = {
    hasGuidedSignal:
      currentState.hasGuidedSignal || behaviorType === SHOPPING_BEHAVIOR_TYPES.GUIDED,
    hasSelfDiscoverySignal:
      currentState.hasSelfDiscoverySignal ||
      behaviorType === SHOPPING_BEHAVIOR_TYPES.SELF_DISCOVERY,
  };
  const shopperSegment = resolveShopperSegment(nextState);
  const previousSegment = currentState.shopperSegment;
  const storedState = {
    ...nextState,
    shopperSegment,
  };

  saveBehaviorState(storedState);
  syncShopperSegment();

  trackEvent({
    action: "shopping_behavior_signal",
    category: "audience_segmentation",
    label: label ?? signal,
    value,
    params: {
      behavior_type: behaviorType,
      signal_name: signal,
      source,
      shopper_segment: shopperSegment,
      guided_shopper: storedState.hasGuidedSignal ? "yes" : "no",
      self_discovery_shopper: storedState.hasSelfDiscoverySignal ? "yes" : "no",
      ...params,
    },
  });

  if (shopperSegment && shopperSegment !== previousSegment) {
    trackEvent({
      action: `segment_${shopperSegment}`,
      category: "audience_segmentation",
      label: source,
      params: {
        signal_name: signal,
        shopper_segment: shopperSegment,
      },
    });
  }
};

export const trackGuidedShopping = ({ signal, source, label, value, params }) => {
  trackShoppingBehavior({
    behaviorType: SHOPPING_BEHAVIOR_TYPES.GUIDED,
    signal,
    source,
    label,
    value,
    params,
  });
};

export const trackSelfDiscoveryShopping = ({ signal, source, label, value, params }) => {
  trackShoppingBehavior({
    behaviorType: SHOPPING_BEHAVIOR_TYPES.SELF_DISCOVERY,
    signal,
    source,
    label,
    value,
    params,
  });
};

// 🔹 찜 클릭
export const trackWishlist = (productName) => {
  trackEvent({
    action: "click_wishlist",
    category: "engagement",
    label: productName,
  });
};

// 🔹 장바구니 클릭
export const trackAddToCart = (productName) => {
  trackEvent({
    action: "add_to_cart",
    category: "ecommerce",
    label: productName,
  });
};

// 🔹 상품 상세 조회
export const trackViewProduct = (productName) => {
  trackEvent({
    action: "view_product",
    category: "ecommerce",
    label: productName,
  });
};
