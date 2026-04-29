const REPORTED_REVIEWS_STORAGE_PREFIX = "reportedReviewIds";

const normalizeStorageValue = (value) => String(value ?? "").trim();

export const createReportedReviewId = (...parts) => {
  const normalizedParts = parts.map(normalizeStorageValue).filter(Boolean);

  return normalizedParts.length > 0 ? normalizedParts.join("::") : "";
};

const getReportedReviewUserKey = (userInfo) =>
  normalizeStorageValue(userInfo?._id) ||
  normalizeStorageValue(userInfo?.id) ||
  normalizeStorageValue(userInfo?.email) ||
  normalizeStorageValue(userInfo?.name) ||
  "guest";

const getReportedReviewsStorageKey = (userInfo) =>
  `${REPORTED_REVIEWS_STORAGE_PREFIX}:${getReportedReviewUserKey(userInfo)}`;

export const loadReportedReviewIds = (userInfo) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedIds = window.localStorage.getItem(getReportedReviewsStorageKey(userInfo));
    const parsedIds = storedIds ? JSON.parse(storedIds) : [];

    return Array.isArray(parsedIds) ? parsedIds.map(normalizeStorageValue).filter(Boolean) : [];
  } catch {
    return [];
  }
};

export const saveReportedReviewIds = (userInfo, ids) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      getReportedReviewsStorageKey(userInfo),
      JSON.stringify([...new Set(ids.map(normalizeStorageValue).filter(Boolean))]),
    );
  } catch {
    // localStorage 저장 실패 시에도 현재 화면 상태는 유지합니다.
  }
};

export const hasReportedReviewId = (userInfo, reviewId) =>
  loadReportedReviewIds(userInfo).includes(normalizeStorageValue(reviewId));

export const addReportedReviewId = (userInfo, reviewId) => {
  const normalizedReviewId = normalizeStorageValue(reviewId);

  if (!normalizedReviewId) {
    return [];
  }

  const nextIds = [...new Set([...loadReportedReviewIds(userInfo), normalizedReviewId])];
  saveReportedReviewIds(userInfo, nextIds);

  return nextIds;
};

export const removeReportedReviewId = (userInfo, reviewId) => {
  const normalizedReviewId = normalizeStorageValue(reviewId);
  const nextIds = loadReportedReviewIds(userInfo).filter((id) => id !== normalizedReviewId);

  saveReportedReviewIds(userInfo, nextIds);

  return nextIds;
};
