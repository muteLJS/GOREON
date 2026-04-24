import api from "@/utils/api";
import { getProductObjectId } from "@/utils/productIdentity";

let productCatalogCache = null;
let productCatalogPromise = null;

export const normalizeProductRecord = (product = {}) => {
  const objectId = getProductObjectId(product);

  return {
    ...product,
    _id: objectId,
    productId: objectId,
  };
};

const extractProductList = (response) => {
  const payload = response?.data?.data ?? response?.data ?? [];
  return Array.isArray(payload) ? payload : [];
};

export const fetchProducts = async ({ params, signal } = {}) => {
  const response = await api.get("/products", {
    params,
    signal,
  });

  return extractProductList(response)
    .map((product) => normalizeProductRecord(product))
    .filter((product) => product._id);
};

export const fetchProductById = async (productId, { signal } = {}) => {
  const response = await api.get(`/products/${productId}`, { signal });
  return normalizeProductRecord(response?.data?.data ?? response?.data ?? {});
};

export const fetchProductCatalog = async ({ force = false } = {}) => {
  if (!force && productCatalogCache) {
    return productCatalogCache;
  }

  if (!force && productCatalogPromise) {
    return productCatalogPromise;
  }

  productCatalogPromise = fetchProducts()
    .then((products) => {
      productCatalogCache = products;
      return products;
    })
    .finally(() => {
      productCatalogPromise = null;
    });

  return productCatalogPromise;
};

export const findProductByObjectId = (products, productId) => {
  const targetId = getProductObjectId(productId);
  return products.find((product) => product._id === targetId) ?? null;
};

export const findProductByName = (products, productName) =>
  products.find((product) => product.name === productName) ?? null;
