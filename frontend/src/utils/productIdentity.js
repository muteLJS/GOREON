const normalizeIdentifier = (value) => {
  const normalized = String(value ?? "").trim();

  if (!normalized || normalized === "undefined" || normalized === "null" || normalized === "NaN") {
    return null;
  }

  return normalized;
};

export const getProductObjectId = (product) => {
  if (product && typeof product === "object") {
    return normalizeIdentifier(
      product._id ?? product.productId ?? product.product?._id ?? product.product?.productId ?? null,
    );
  }

  return normalizeIdentifier(product);
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
