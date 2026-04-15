export const FALLBACK_CART_ITEMS = Array.from({ length: 6 }, (_, index) => ({
  id: `fallback-cart-item-${index + 1}`,
  productId: index + 1,
  category: "CPU",
  name: "인텔 코어 i5-14세대 14400F (랩터레이크 리프레시) (벌크팩 정품)",
  option: "옵션명:용량,뷰 등등",
  price: 20000,
  quantity: 1,
}));

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

  return {
    id: item.id ?? `cart-item-${index}`,
    productId: item.productId ?? item.id ?? index + 1,
    category: item.category ?? "상품",
    name: item.name ?? item.title ?? "상품명",
    option: item.option ?? item.spec ?? "옵션 정보가 없습니다.",
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
      id: key,
    });
  });

  return Array.from(itemsByKey.values());
}

export function createCartItems(items) {
  return mergeCartItems(items.map((item, index) => toCartItem(item, index)));
}

export function getCartItems(storeCartItems) {
  const sourceItems = storeCartItems.length > 0 ? storeCartItems : FALLBACK_CART_ITEMS;

  return createCartItems(sourceItems);
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
