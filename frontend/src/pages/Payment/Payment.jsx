import styles from "./Payment.module.scss";
import { registerModuleStyles } from "styles/registerModuleStyles";

import { useMemo, useState } from "react";

import CreditCardIcon from "assets/icons/creditcard.svg";
import KakaoPayIcon from "assets/icons/kakaopay.svg";
import SamsungPayIcon from "assets/icons/samsungpay.svg";
import UserIcon from "assets/icons/user.svg";
import VisaIcon from "assets/icons/visa.svg";

registerModuleStyles(styles);

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "실물 카드",
    icon: CreditCardIcon,
    iconAlt: "실물 카드",
  },
  {
    id: "kakao-pay",
    label: "카카오 페이",
    icon: KakaoPayIcon,
    iconAlt: "카카오 페이",
  },
  {
    id: "samsung-pay",
    label: "삼성 페이",
    icon: SamsungPayIcon,
    iconAlt: "삼성 페이",
  },
];

const ORDER_ITEMS = [
  { id: "payment-item-1", name: "상품명", quantity: 1, amount: 10000 },
  { id: "payment-item-2", name: "상품명", quantity: 1, amount: 10000 },
  { id: "payment-item-3", name: "상품명", quantity: 1, amount: 10000 },
];

const INITIAL_PAYMENT_FORM = {
  cardNumber: "",
  cardHolder: "",
  expiryDate: "",
  cvc: "",
  saveCard: true,
};

const INITIAL_SHIPPING_FORM = {
  recipient: "",
  phone: "",
  address: "",
  addressDetail: "",
};

function formatPrice(amount) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

function PaymentSection({ title, titleClassName = "", children, className = "" }) {
  const sectionClassName = ["payment-page__section", className].filter(Boolean).join(" ");
  const headingClassName = ["payment-page__section-title", titleClassName].filter(Boolean).join(" ");

  return (
    <section className={sectionClassName}>
      {title ? <h3 className={headingClassName}>{title}</h3> : null}
      {children}
    </section>
  );
}

function PaymentMethodCard({ method, isSelected, onSelect }) {
  const buttonClassName = [
    "payment-page__method-card",
    isSelected ? "payment-page__method-card--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={() => onSelect(method.id)}
      aria-pressed={isSelected}
    >
      <div className="payment-page__method-icon-wrap">
        <img src={method.icon} alt={method.iconAlt} className="payment-page__method-icon" />
      </div>
      <span className="payment-page__method-label">{method.label}</span>
    </button>
  );
}

function PaymentField({ label, children, className = "" }) {
  const fieldClassName = ["payment-page__field", className].filter(Boolean).join(" ");

  return (
    <label className={fieldClassName}>
      <span className="payment-page__field-label">{label}</span>
      {children}
    </label>
  );
}

function PaymentInput({ icon, iconAlt = "", className = "", ...props }) {
  const wrapperClassName = ["payment-page__input-wrap", className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      {icon ? <img src={icon} alt={iconAlt} className="payment-page__input-icon" /> : null}
      <input {...props} />
    </div>
  );
}

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [paymentForm, setPaymentForm] = useState(INITIAL_PAYMENT_FORM);
  const [shippingForm, setShippingForm] = useState(INITIAL_SHIPPING_FORM);

  const productCount = useMemo(
    () => ORDER_ITEMS.reduce((total, item) => total + item.quantity, 0),
    []
  );
  const orderTotal = useMemo(
    () => ORDER_ITEMS.reduce((total, item) => total + item.quantity * item.amount, 0),
    []
  );

  const paymentRows = useMemo(
    () =>
      ORDER_ITEMS.map((item) => ({
        id: item.id,
        label: `${item.quantity} X ${item.name}`,
        amount: formatPrice(item.quantity * item.amount),
      })),
    []
  );

  const handlePaymentFieldChange = ({ target }) => {
    const { name, value, type, checked } = target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleShippingFieldChange = ({ target }) => {
    const { name, value } = target;

    setShippingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="payment-page">
      <div className="payment-page__hero">
        <h2 className="payment-page__title">결제</h2>

        <div className="payment-page__progress" aria-label="주문 단계">
          <div className="payment-page__progress-track" />
          <div className="payment-page__progress-step">
            <span>1</span>
            <strong>장바구니</strong>
          </div>
          <div className="payment-page__progress-step payment-page__progress-step--active">
            <span>2</span>
            <strong>결제</strong>
          </div>
        </div>
      </div>

      <div className="payment-page__layout">
        <div className="payment-page__main">
          <PaymentSection title="결제수단" titleClassName="payment-page__section-title--desktop-only">
            <div className="payment-page__method-grid">
              {PAYMENT_METHODS.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  isSelected={selectedMethod === method.id}
                  onSelect={setSelectedMethod}
                />
              ))}
            </div>
          </PaymentSection>

          <PaymentSection title="결제정보">
            <div className="payment-page__form-box">
              <PaymentField label="카드번호">
                <PaymentInput
                  type="text"
                  name="cardNumber"
                  value={paymentForm.cardNumber}
                  onChange={handlePaymentFieldChange}
                  placeholder="1234 5678 0123 4567"
                  icon={VisaIcon}
                  iconAlt="Visa"
                />
              </PaymentField>

              <PaymentField label="카드 명의자">
                <PaymentInput
                  type="text"
                  name="cardHolder"
                  value={paymentForm.cardHolder}
                  onChange={handlePaymentFieldChange}
                  placeholder="이름을 입력하세요."
                  icon={UserIcon}
                  iconAlt=""
                />
              </PaymentField>

              <div className="payment-page__field-grid">
                <PaymentField label="유효기간">
                  <PaymentInput
                    type="text"
                    name="expiryDate"
                    value={paymentForm.expiryDate}
                    onChange={handlePaymentFieldChange}
                    placeholder="00 / 00"
                  />
                </PaymentField>

                <PaymentField label="CVC">
                  <PaymentInput
                    type="text"
                    name="cvc"
                    value={paymentForm.cvc}
                    onChange={handlePaymentFieldChange}
                    placeholder="카드 뒷면 3자리"
                  />
                </PaymentField>
              </div>

              <label className="payment-page__checkbox">
                <input
                  type="checkbox"
                  name="saveCard"
                  checked={paymentForm.saveCard}
                  onChange={handlePaymentFieldChange}
                />
                <span className="payment-page__checkbox-mark" />
                <span className="payment-page__checkbox-label">카드정보 저장</span>
              </label>
            </div>
          </PaymentSection>
        </div>

        <div className="payment-page__side">
          <PaymentSection title="배송지 확인">
            <div className="payment-page__form-box payment-page__form-box--shipping">
              <label className="payment-page__field payment-page__field--shipping">
                <span className="payment-page__field-label">수령인</span>
                <div className="payment-page__input-wrap payment-page__input-wrap--shipping">
                  <input
                    type="text"
                    name="recipient"
                    value={shippingForm.recipient}
                    onChange={handleShippingFieldChange}
                    placeholder="받는 분 이름을 입력해 주세요."
                  />
                </div>
              </label>

              <label className="payment-page__field payment-page__field--shipping">
                <span className="payment-page__field-label">연락처</span>
                <div className="payment-page__input-wrap payment-page__input-wrap--shipping">
                  <input
                    type="tel"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={handleShippingFieldChange}
                    placeholder="010-0000-0000"
                  />
                </div>
              </label>

              <div className="payment-page__field payment-page__field--shipping">
                <span className="payment-page__field-label">배송지</span>

                <div className="payment-page__address-row payment-page__address-row--shipping">
                  <div className="payment-page__input-wrap payment-page__input-wrap--shipping">
                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleShippingFieldChange}
                      placeholder="주소를 검색하세요"
                    />
                  </div>
                  <button
                    type="button"
                    className="payment-page__address-button payment-page__address-button--shipping"
                  >
                    검색
                  </button>
                </div>

                <div className="payment-page__address-row payment-page__address-row--shipping">
                  <div className="payment-page__input-wrap payment-page__input-wrap--shipping">
                    <input
                      type="text"
                      name="addressDetail"
                      value={shippingForm.addressDetail}
                      onChange={handleShippingFieldChange}
                      placeholder="상세 주소를 입력하세요."
                    />
                  </div>
                  <button
                    type="button"
                    className="payment-page__address-button payment-page__address-button--shipping"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </PaymentSection>

          <PaymentSection title="결제 금액">
            <div className="payment-page__summary-box">
              <div className="payment-page__summary-title">
                상품 총 {String(productCount).padStart(2, "0")}건
              </div>

              <div className="payment-page__summary-list">
                {paymentRows.map((row) => (
                  <div className="payment-page__summary-row" key={row.id}>
                    <span>{row.label}</span>
                    <strong>{row.amount}</strong>
                  </div>
                ))}

                <div className="payment-page__summary-row">
                  <span>배송비</span>
                  <strong>무료배송</strong>
                </div>
              </div>

              <div className="payment-page__summary-total">
                <span>총 주문 금액</span>
                <strong>{formatPrice(orderTotal)}</strong>
              </div>
            </div>
          </PaymentSection>

          <button type="button" className="payment-page__submit-button">
            결제하기
          </button>
        </div>
      </div>
    </section>
  );
}
