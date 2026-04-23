export const getProductObjectId = (product) => {
  if (product && typeof product === "object") {
    const identifier = product._id ?? product.productId ?? null;
    return identifier === null || identifier === undefined ? null : String(identifier);
  }

  return product === null || product === undefined ? null : String(product);
};

export const buildProductDetailPath = (product) => {
  const productId = getProductObjectId(product);
  return productId ? `/product/${productId}` : null;
};
