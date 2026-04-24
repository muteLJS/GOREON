import "./Payment.scss";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useToast } from "@/components/Toast/toastContext";
import AddressModal from "../../components/AddressModal/AddressModal";
import CreditCardIcon from "../../assets/icons/creditcard.svg";
import KakaoPayIcon from "../../assets/icons/kakaopay.svg";
import SamsungPayIcon from "../../assets/icons/samsungpay.svg";
import UserIcon from "../../assets/icons/user.svg";
import VisaIcon from "../../assets/icons/visa.svg";
import {
  EMPTY_SHIPPING_FORM,
  createCartItems,
  formatPrice,
  getCartItems,
  summarizeOrder,
} from "../../utils/cart";
import { removeCartItems } from "../../store/slices/cartSlice";
import api from "../../utils/api";

const PAYMENT_OPTIONS = [
  { id: "card", label: "신용 카드", icon: CreditCardIcon, iconAlt: "신용 카드", available: true },
  {
    id: "kakao-pay",
    label: "카카오 페이",
    icon: KakaoPayIcon,
    iconAlt: "카카오 페이",
    available: false,
  },
  {
    id: "samsung-pay",
    label: "삼성 페이",
    icon: SamsungPayIcon,
    iconAlt: "삼성 페이",
    available: false,
  },
];

const EMPTY_CARD_FORM = {
  cardNumber: "",
  cardHolder: "",
  expiryDate: "",
  cvc: "",
  saveCard: true,
};

function cx(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

function Section({ title, titleClassName, children }) {
  return (
    <section className="payment-page__section">
      {title ? (
        <h3 className={cx("payment-page__section-title", titleClassName)}>{title}</h3>
      ) : null}
      {children}
    </section>
  );
}

function MethodOption({ option, isSelected, onClick }) {
  return (
    <button
      type="button"
      className={cx(
        "payment-page__method-option",
        isSelected && "payment-page__method-option--active",
      )}
      onClick={() => onClick(option)}
      aria-pressed={isSelected}
      aria-disabled={!option.available}
    >
      <span className="payment-page__method-icon-box">
        <img src={option.icon} alt={option.iconAlt} className="payment-page__method-icon" />
      </span>
      <span className="payment-page__method-label">{option.label}</span>
    </button>
  );
}

function Field({ label, className, children }) {
  return (
    <label className={cx("payment-page__field", className)}>
      <span className="payment-page__field-label">{label}</span>
      {children}
    </label>
  );
}

function TextField({ icon, iconAlt = "", className, ...inputProps }) {
  return (
    <div className={cx("payment-page__input", className)}>
      {icon ? <img src={icon} alt={iconAlt} className="payment-page__input-icon" /> : null}
      <input {...inputProps} />
    </div>
  );
}

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const storedCartItems = useSelector((store) => store.cart.items);
  const initialShippingForm = useMemo(
    () => ({
      ...EMPTY_SHIPPING_FORM,
      ...state?.shippingForm,
    }),
    [state?.shippingForm],
  );

  const [selectedMethodId, setSelectedMethodId] = useState(PAYMENT_OPTIONS[0].id);
  const [cardForm, setCardForm] = useState(EMPTY_CARD_FORM);
  const [shippingForm, setShippingForm] = useState(initialShippingForm);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldRemovePurchasedCartItems = state?.checkoutSource !== "direct-buy";

  const orderItems = useMemo(() => {
    if (Array.isArray(state?.orderItems)) {
      return createCartItems(state.orderItems);
    }

    return getCartItems(storedCartItems);
  }, [state?.orderItems, storedCartItems]);

  const { productCount, orderTotal, summaryLines } = useMemo(
    () => summarizeOrder(orderItems),
    [orderItems],
  );

  useEffect(() => {
    setShippingForm(initialShippingForm);
  }, [initialShippingForm]);

  const handleCardFieldChange = ({ target }) => {
    const { name, value, type, checked } = target;

    setCardForm((prevCardForm) => ({
      ...prevCardForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleShippingFieldChange = ({ target }) => {
    const { name, value } = target;

    setShippingForm((prevShippingForm) => ({
      ...prevShippingForm,
      [name]: value,
    }));
  };

  const handleMethodClick = (option) => {
    if (!option.available) {
      showToast("서비스 준비중입니다.");
      return;
    }

    setSelectedMethodId(option.id);
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

  const handlePayment = async () => {
    if (orderItems.length === 0) {
      showToast("주문할 상품이 없습니다.");
      return;
    }

    const invalidItem = orderItems.find((item) => !item.productId);

    if (invalidItem) {
      showToast("상품 정보가 올바르지 않습니다.");
      return;
    }

    const payload = {
      items: orderItems.map((item) => ({
        product: item.productId,
        name: item.name,
        category: item.category || "",
        option: item.option || "",
        thumb: item.image || "",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      })),
      totalAmount: orderTotal,
    };

    try {
      setIsSubmitting(true);

      await api.post("/orders", payload);

      if (shouldRemovePurchasedCartItems) {
        dispatch(removeCartItems(orderItems.map((item) => item.id)));
      }

      showToast("주문이 완료되었습니다.");
      navigate("/order-history");
    } catch (error) {
      if (error.response?.status === 401) {
        showToast("로그인이 필요합니다.");
        navigate("/login", { state: { from: "/payment" } });
        return;
      }

      showToast(error.response?.data?.message || "주문 처리에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="payment-page">
      <div className="payment-page__header">
        <h2 className="payment-page__title">결제</h2>

        <div className="payment-page__progress" aria-label="주문 단계">
          <div className="payment-page__progress-track" />
          <div className="payment-page__progress-step">
            <Link to="/cart" className="payment-page__progress-link">
              1
            </Link>
            <strong>장바구니</strong>
          </div>
          <div className="payment-page__progress-step payment-page__progress-step--active">
            <Link to="/payment" className="payment-page__progress-link" aria-current="page">
              2
            </Link>
            <strong>결제</strong>
          </div>
          <div className="payment-page__progress-step">
            <Link to="/order-history" className="payment-page__progress-link">
              3
            </Link>
            <strong>주문내역</strong>
          </div>
        </div>
      </div>

      <div className="payment-page__layout">
        <div className="payment-page__content">
          <Section title="결제수단" titleClassName="payment-page__section-title--desktop">
            <div className="payment-page__method-list">
              {PAYMENT_OPTIONS.map((option) => (
                <MethodOption
                  key={option.id}
                  option={option}
                  isSelected={selectedMethodId === option.id}
                  onClick={handleMethodClick}
                />
              ))}
            </div>
          </Section>

          <Section title="결제정보">
            <div className="payment-page__card">
              <Field label="카드번호">
                <TextField
                  type="text"
                  name="cardNumber"
                  value={cardForm.cardNumber}
                  onChange={handleCardFieldChange}
                  placeholder="1234 5678 0123 4567"
                  icon={VisaIcon}
                  iconAlt="Visa"
                />
              </Field>

              <Field label="카드 명의자">
                <TextField
                  type="text"
                  name="cardHolder"
                  value={cardForm.cardHolder}
                  onChange={handleCardFieldChange}
                  placeholder="이름을 입력하세요."
                  icon={UserIcon}
                />
              </Field>

              <div className="payment-page__field-row">
                <Field label="유효기간">
                  <TextField
                    type="text"
                    name="expiryDate"
                    value={cardForm.expiryDate}
                    onChange={handleCardFieldChange}
                    placeholder="00 / 00"
                  />
                </Field>

                <Field label="CVC">
                  <TextField
                    type="text"
                    name="cvc"
                    value={cardForm.cvc}
                    onChange={handleCardFieldChange}
                    placeholder="카드 뒷면 3자리"
                  />
                </Field>
              </div>

              <label className="payment-page__save-card">
                <input
                  type="checkbox"
                  name="saveCard"
                  checked={cardForm.saveCard}
                  onChange={handleCardFieldChange}
                />
                <span className="payment-page__save-card-mark" />
                <span className="payment-page__save-card-label">카드정보 저장</span>
              </label>
            </div>
          </Section>
        </div>

        <div className="payment-page__sidebar">
          <Section title="배송지 확인">
            <div className="payment-page__card payment-page__card--shipping">
              <Field label="수령인" className="payment-page__field--shipping">
                <TextField
                  type="text"
                  name="recipient"
                  value={shippingForm.recipient}
                  onChange={handleShippingFieldChange}
                  placeholder="받는 분 이름을 입력해 주세요."
                  className="payment-page__input--shipping"
                />
              </Field>

              <Field label="연락처" className="payment-page__field--shipping">
                <TextField
                  type="tel"
                  name="phone"
                  value={shippingForm.phone}
                  onChange={handleShippingFieldChange}
                  placeholder="010-0000-0000"
                  className="payment-page__input--shipping"
                />
              </Field>

              <Field label="배송지" className="payment-page__field--shipping">
                <TextField
                  type="text"
                  name="postalCode"
                  value={shippingForm.postalCode}
                  placeholder="우편번호"
                  className="payment-page__input--shipping"
                  readOnly
                />

                <div className="payment-page__address-row">
                  <TextField
                    type="text"
                    name="address"
                    value={shippingForm.address}
                    placeholder="주소를 검색하세요."
                    className="payment-page__input--shipping"
                    readOnly
                  />
                  <button
                    type="button"
                    className="payment-page__address-button"
                    onClick={openAddressModal}
                  >
                    검색
                  </button>
                </div>

                <TextField
                  type="text"
                  name="addressDetail"
                  value={shippingForm.addressDetail}
                  onChange={handleShippingFieldChange}
                  placeholder="상세 주소를 입력하세요."
                  className="payment-page__input--shipping"
                />
              </Field>
            </div>
          </Section>

          <Section title="결제 금액">
            <div className="payment-page__summary-card">
              <div className="payment-page__summary-count">
                상품 총 {String(productCount).padStart(2, "0")}건
              </div>

              <div className="payment-page__summary-list">
                {summaryLines.map((line) => (
                  <div className="payment-page__summary-line" key={line.id}>
                    <span>{line.label}</span>
                    <strong>{line.amount}</strong>
                  </div>
                ))}

                <div className="payment-page__summary-line">
                  <span>배송비</span>
                  <strong>무료배송</strong>
                </div>
              </div>

              <div className="payment-page__summary-total">
                <span>총 주문 금액</span>
                <strong>{formatPrice(orderTotal)}</strong>
              </div>
            </div>
          </Section>

          <button
            type="button"
            className="payment-page__submit"
            onClick={handlePayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리중..." : "결제하기"}
          </button>
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
