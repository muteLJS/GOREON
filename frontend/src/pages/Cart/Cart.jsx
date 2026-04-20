/* -------------------------------------------------------------------------- */
/* [페이지] 장바구니 (Cart)                                                    */
/* 설명: 장바구니 상품 목록, 배송지 입력, 결제 금액 UI를 보여주는 페이지입니다. */
/* -------------------------------------------------------------------------- */

import "./Cart.scss";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import AddressModal from "../../components/AddressModal/AddressModal";
import ProductList from "../../components/ProductList/ProductList";
import { removeCartItems, updateCartQuantity } from "../../store/slices/cartSlice";
import { EMPTY_SHIPPING_FORM, formatPrice, getCartItems, summarizeOrder } from "../../utils/cart";

export default function Cart() {
  const dispatch = useDispatch();
  const storedCartItems = useSelector((state) => state.cart.items);
  const cartItems = useMemo(() => getCartItems(storedCartItems), [storedCartItems]);

  const [selectedItemIds, setSelectedItemIds] = useState(cartItems.map((item) => item.id));
  const [shippingForm, setShippingForm] = useState(EMPTY_SHIPPING_FORM);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    const cartItemIds = new Set(cartItems.map((item) => item.id));
    setSelectedItemIds((prevIds) => prevIds.filter((id) => cartItemIds.has(id)));
  }, [cartItems]);

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedItemIds.includes(item.id)),
    [cartItems, selectedItemIds],
  );
  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;
  const { productCount, orderTotal, summaryLines } = useMemo(
    () => summarizeOrder(selectedItems),
    [selectedItems],
  );

  const handleQuantityChange = (itemId, nextQuantity) => {
    dispatch(updateCartQuantity({ id: itemId, quantity: nextQuantity }));
  };

  const handleItemSelect = (itemId) => {
    setSelectedItemIds((prevIds) =>
      prevIds.includes(itemId) ? prevIds.filter((id) => id !== itemId) : [...prevIds, itemId],
    );
  };

  const handleSelectAll = () => {
    setSelectedItemIds(isAllSelected ? [] : cartItems.map((item) => item.id));
  };

  const handleDeleteSelected = () => {
    if (selectedItemIds.length === 0) {
      return;
    }

    dispatch(removeCartItems(selectedItemIds));
    setSelectedItemIds([]);
  };

  const handleShippingFieldChange = ({ target }) => {
    const { name, value } = target;

    setShippingForm((prevShippingForm) => ({
      ...prevShippingForm,
      [name]: value,
    }));
  };

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = useCallback(() => {
    setIsAddressModalOpen(false);
  }, []);

  const handleAddressSelect = useCallback(
    (data) => {
      const address = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

      setShippingForm((prevShippingForm) => ({
        ...prevShippingForm,
        postalCode: data.zonecode ?? "",
        address,
        addressDetail: "",
      }));
      closeAddressModal();
    },
    [closeAddressModal],
  );

  return (
    <section className="cart-page">
      <div className="cart-page__header">
        <h2 className="cart-page__title">장바구니</h2>

        <div className="cart-page__progress" aria-label="주문 단계">
          <div className="cart-page__progress-track" />
          <div className="cart-page__progress-step cart-page__progress-step--active">
            <Link to="/cart" className="cart-page__progress-link" aria-current="page">
              1
            </Link>
            <strong>장바구니</strong>
          </div>
          <div className="cart-page__progress-step">
            <Link
              to="/payment"
              state={{ orderItems: selectedItems, shippingForm }}
              className="cart-page__progress-link"
            >
              2
            </Link>
            <strong>결제</strong>
          </div>
          <div className="cart-page__progress-step">
            <Link to="/order-history" className="cart-page__progress-link">
              3
            </Link>
            <strong>주문내역</strong>
          </div>
        </div>
      </div>

      <div className="cart-page__layout">
        <section aria-label="장바구니 상품">
          <div className="cart-page__list-toolbar">
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

          <div className="cart-page__list-card">
            {cartItems.length > 0 ? (
              <ProductList
                items={cartItems}
                selectedIds={selectedItemIds}
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

        <div className="cart-page__sidebar">
          <section>
            <h3 className="cart-page__section-title">배송지 확인</h3>

            <div className="cart-page__address-card">
              <label className="cart-page__field">
                <span>수령인</span>
                <div className="cart-page__input">
                  <input
                    type="text"
                    name="recipient"
                    value={shippingForm.recipient}
                    onChange={handleShippingFieldChange}
                    placeholder="받는 분 이름을 입력해 주세요."
                  />
                </div>
              </label>

              <label className="cart-page__field">
                <span>연락처</span>
                <div className="cart-page__input">
                  <input
                    type="tel"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={handleShippingFieldChange}
                    placeholder="010-0000-0000"
                  />
                </div>
              </label>

              <div className="cart-page__field">
                <span>배송지</span>

                <div className="cart-page__input">
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingForm.postalCode}
                    placeholder="우편번호"
                    readOnly
                  />
                </div>

                <div className="cart-page__address-row">
                  <div className="cart-page__input">
                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      placeholder="주소를 검색하세요"
                      readOnly
                    />
                  </div>
                  <button
                    type="button"
                    className="cart-page__address-button"
                    onClick={openAddressModal}
                  >
                    검색
                  </button>
                </div>

                <div className="cart-page__input">
                  <input
                    type="text"
                    name="addressDetail"
                    value={shippingForm.addressDetail}
                    onChange={handleShippingFieldChange}
                    placeholder="상세 주소를 입력하세요."
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="cart-page__section-title">결제 금액</h3>

            <div className="cart-page__summary-card">
              <div className="cart-page__summary-count">상품 총 {productCount}건</div>

              <div className="cart-page__summary-list">
                {summaryLines.map((line) => (
                  <div className="cart-page__summary-line" key={line.id}>
                    <span>{line.label}</span>
                    <strong>{line.amount}</strong>
                  </div>
                ))}

                <div className="cart-page__summary-line">
                  <span>배송비</span>
                  <strong>무료배송</strong>
                </div>
              </div>

              <div className="cart-page__summary-total">
                <span>총 주문 금액</span>
                <strong>{formatPrice(orderTotal)}</strong>
              </div>
            </div>
          </section>

          <Link
            to="/payment"
            state={{ orderItems: selectedItems, shippingForm }}
            className="cart-page__checkout-button"
          >
            결제하기
          </Link>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
        onSelectAddress={handleAddressSelect}
      />
    </section>
  );
}
