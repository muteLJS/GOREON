const normalizeIdentifier = (value) => {
  const normalized = String(value ?? "").trim();

  if (!normalized || normalized === "undefined" || normalized === "null" || normalized === "NaN") {
    return null;
  }

  return normalized;
};

const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;

const extractObjectIdLikeValue = (value) => {
  const normalized = normalizeIdentifier(value);

  if (!normalized) {
    return null;
  }

  if (OBJECT_ID_PATTERN.test(normalized)) {
    return normalized;
  }

  const prefixedObjectId = normalized.match(/^[a-f0-9]{24}/i);
  return prefixedObjectId ? prefixedObjectId[0] : null;
};

export const getProductObjectId = (product) => {
  if (product && typeof product === "object") {
    return normalizeIdentifier(
      product._id ??
        product.productId ??
        extractObjectIdLikeValue(product.id) ??
        product.product?._id ??
        product.product?.productId ??
        extractObjectIdLikeValue(product.product?.id) ??
        null,
    );
  }

  return extractObjectIdLikeValue(product) ?? normalizeIdentifier(product);
};

export const getLegacyProductId = (product) => {
  if (!product || typeof product !== "object") {
    return null;
  }

  return normalizeIdentifier(product.legacyId ?? product.id ?? null);
};

export const getProductListKey = (product, fallback = "") =>
  getProductObjectId(product) ??
  getLegacyProductId(product) ??
  normalizeIdentifier(product?.name ?? fallback) ??
  fallback;

export const compareProductsByNewest = (left, right) =>
  String(getProductObjectId(right) ?? "").localeCompare(String(getProductObjectId(left) ?? ""));

export const buildProductDetailPath = (product) => {
  const productId = getProductObjectId(product);
  return productId ? `/product/${productId}` : null;
};
