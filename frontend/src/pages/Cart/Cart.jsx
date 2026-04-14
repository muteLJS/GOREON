/* -------------------------------------------------------------------------- */
/* [페이지] 장바구니 (Cart)                                                    */
/* 설명: 장바구니 상품 목록, 배송지 입력, 결제 금액 UI를 보여주는 페이지입니다. */
/* -------------------------------------------------------------------------- */

import "./Cart.scss";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ProductList from "components/ProductList/ProductList";

const FALLBACK_CART_ITEMS = Array.from({ length: 6 }, (_, index) => ({
  id: `fallback-cart-item-${index + 1}`,
  productId: index + 1,
  category: "CPU",
  name: "인텔 코어 i5-14세대 14400F (랩터레이크 리프레시) (벌크팩 정품)",
  option: "옵션명:용량,뷰 등등",
  price: 20000,
  quantity: 1,
}));

const INITIAL_DELIVERY_FORM = {
  recipient: "",
  phone: "",
  address: "",
  addressDetail: "",
};

function formatPrice(price) {
  return `₩${price.toLocaleString("ko-KR")}`;
}

function normalizeCartItem(item, index) {
  return {
    id: item.id ?? `cart-item-${index}`,
    productId: item.productId ?? item.id ?? index + 1,
    category: item.category ?? "상품",
    name: item.name ?? item.title ?? "상품명",
    option: item.option ?? item.spec ?? "옵션 정보가 없습니다.",
    price: Number(item.price) || 0,
    quantity: item.quantity ?? 1,
  };
}

function createCartItemKey(item) {
  return [item.category, item.name, item.option, item.price].join("::");
}

function aggregateCartItems(items) {
  const cartItemMap = new Map();

  items.forEach((item) => {
    const cartItemKey = createCartItemKey(item);
    const currentItem = cartItemMap.get(cartItemKey);

    if (currentItem) {
      currentItem.quantity += item.quantity;
      return;
    }

    cartItemMap.set(cartItemKey, {
      ...item,
      id: cartItemKey,
    });
  });

  return Array.from(cartItemMap.values());
}

function createPaymentRows(items) {
  return items.map((item) => ({
    id: item.id,
    label: `${item.quantity} X ${item.name}`,
    amount: formatPrice(item.price * item.quantity),
  }));
}

function Cart() {
  const storeCartItems = useSelector((state) => state.cart.items);

  const defaultCartItems = useMemo(() => {
    const normalizedCartItems =
      storeCartItems.length === 0
        ? FALLBACK_CART_ITEMS
        : storeCartItems.map((item, index) => normalizeCartItem(item, index));

    return aggregateCartItems(normalizedCartItems);
  }, [storeCartItems]);

  const [cartItems, setCartItems] = useState(defaultCartItems);
  const [selectedIds, setSelectedIds] = useState(defaultCartItems.map((item) => item.id));
  const [deliveryForm, setDeliveryForm] = useState(INITIAL_DELIVERY_FORM);

  useEffect(() => {
    setCartItems(defaultCartItems);
    setSelectedIds(defaultCartItems.map((item) => item.id));
  }, [defaultCartItems]);

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedIds.includes(item.id)),
    [cartItems, selectedIds]
  );
  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;
  const productCount = selectedItems.reduce((total, item) => total + item.quantity, 0);
  const productTotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const orderTotal = productTotal;
  const paymentRows = useMemo(() => createPaymentRows(selectedItems), [selectedItems]);

  const removeCartItem = (targetId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== targetId));
    setSelectedIds((prevIds) => prevIds.filter((id) => id !== targetId));
  };

  const handleQuantityChange = (targetId, nextQuantity) => {
    if (nextQuantity < 1) {
      removeCartItem(targetId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === targetId
          ? {
              ...item,
              quantity: nextQuantity,
            }
          : item
      )
    );
  };

  const handleItemSelect = (targetId) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(targetId) ? prevIds.filter((id) => id !== targetId) : [...prevIds, targetId],
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : cartItems.map((item) => item.id));
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      return;
    }

    setCartItems((prevItems) => prevItems.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  const handleDeliveryChange = ({ target }) => {
    const { name, value } = target;

    setDeliveryForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <section className="cart-page">
      <div className="cart-page__hero">
        <h2 className="cart-page__title">장바구니</h2>

        <div className="cart-page__progress" aria-label="주문 단계">
          <div className="cart-page__progress-track" />
          <div className="cart-page__progress-step cart-page__progress-step--active">
            <span>1</span>
            <strong>장바구니</strong>
          </div>
          <div className="cart-page__progress-step">
            <span>2</span>
            <strong>결제</strong>
          </div>
        </div>
      </div>

      <div className="cart-page__layout">
        <section className="cart-page__items-section" aria-label="장바구니 상품">
          <div className="cart-page__section-top">
            <label className="cart-page__select-all">
              <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
              <span className="cart-page__checkbox-mark" />
              <span>전체선택</span>
            </label>

            <button
              type="button"
              className="cart-page__delete-button"
              onClick={handleDeleteSelected}
            >
              삭제
            </button>
          </div>

          <div className="cart-page__items-box">
            {cartItems.length > 0 ? (
              <ProductList
                items={cartItems}
                selectedIds={selectedIds}
                onSelectItem={handleItemSelect}
                onChangeQuantity={handleQuantityChange}
              />
            ) : (
              <div className="cart-page__empty">
                <p>장바구니에 담긴 상품이 없습니다.</p>
              </div>
            )}
          </div>
        </section>

        <div className="cart-page__side">
          <section className="cart-page__info-section">
            <h3 className="cart-page__section-title">배송지 확인</h3>

            <div className="cart-page__form-box">
              <label className="cart-page__field">
                <span>수령인</span>
                <div className="cart-page__input-wrap">
                  <input
                    type="text"
                    name="recipient"
                    value={deliveryForm.recipient}
                    onChange={handleDeliveryChange}
                    placeholder="받는 분 이름을 입력해 주세요."
                  />
                </div>
              </label>

              <label className="cart-page__field">
                <span>연락처</span>
                <div className="cart-page__input-wrap">
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryForm.phone}
                    onChange={handleDeliveryChange}
                    placeholder="010-0000-0000"
                  />
                </div>
              </label>

              <div className="cart-page__field">
                <span>배송지</span>

                <div className="cart-page__address-row">
                  <div className="cart-page__input-wrap">
                    <input
                      type="text"
                      name="address"
                      value={deliveryForm.address}
                      onChange={handleDeliveryChange}
                      placeholder="주소를 검색하세요"
                    />
                  </div>
                  <button type="button" className="cart-page__address-button">
                    검색
                  </button>
                </div>

                <div className="cart-page__address-row">
                  <div className="cart-page__input-wrap">
                    <input
                      type="text"
                      name="addressDetail"
                      value={deliveryForm.addressDetail}
                      onChange={handleDeliveryChange}
                      placeholder="상세 주소를 입력하세요."
                    />
                  </div>
                  <button type="button" className="cart-page__address-button">
                    저장
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="cart-page__info-section">
            <h3 className="cart-page__section-title">결제 금액</h3>

            <div className="cart-page__payment-box">
              <div className="cart-page__payment-title">상품 총 {productCount}건</div>

              <div className="cart-page__payment-list">
                {paymentRows.map((row) => (
                  <div className="cart-page__payment-row" key={row.id}>
                    <span>{row.label}</span>
                    <strong>{row.amount}</strong>
                  </div>
                ))}

                <div className="cart-page__payment-row">
                  <span>배송비</span>
                  <strong>무료배송</strong>
                </div>
              </div>

              <div className="cart-page__payment-total">
                <span>총 주문 금액</span>
                <strong>{formatPrice(orderTotal)}</strong>
              </div>
            </div>
          </section>

          <Link to="/payment" className="cart-page__checkout-button">
            결제하기
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Cart;
