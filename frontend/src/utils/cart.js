import { getProductObjectId } from "@/utils/productIdentity";

export const EMPTY_SHIPPING_FORM = {
  postalCode: "",
  recipient: "",
  phone: "",
  address: "",
  addressDetail: "",
};

export function formatPrice(price) {
  return `₩${Number(price || 0).toLocaleString("ko-KR")}`;
}

export function toCartItem(item, index) {
  const quantity = Number(item.quantity) || 1;
  const productId = getProductObjectId(item);

  return {
    id: item.id ?? `cart-item-${index}`,
    productId,
    _id: productId,
    category: item.category ?? "상품",
    name: item.name ?? item.title ?? "상품명",
    option: item.option ?? item.spec ?? "옵션 정보가 없습니다.",
    image: item.image ?? item.imageSrc ?? item.thumbnailImage ?? item.thumbnail ?? "",
    price: Number(item.price) || 0,
    quantity: quantity > 0 ? quantity : 1,
  };
}

function getCartItemKey(item) {
  return [item.category, item.name, item.option, item.price].join("::");
}

export function mergeCartItems(items) {
  const itemsByKey = new Map();

  items.forEach((item) => {
    const key = getCartItemKey(item);
    const currentItem = itemsByKey.get(key);

    if (currentItem) {
      currentItem.quantity += item.quantity;
      return;
    }

    itemsByKey.set(key, {
      ...item,
    });
  });

  return Array.from(itemsByKey.values());
}

export function createCartItems(items) {
  return mergeCartItems(items.map((item, index) => toCartItem(item, index)));
}

export function getCartItems(storeCartItems) {
  return createCartItems(storeCartItems);
}

export function summarizeOrder(items) {
  const productCount = items.reduce((total, item) => total + item.quantity, 0);
  const orderTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    productCount,
    orderTotal,
    summaryLines: items.map((item) => ({
      id: item.id,
      label: `${item.quantity} X ${item.name}`,
      amount: formatPrice(item.price * item.quantity),
    })),
  };
}
