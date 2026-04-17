import "./AddressModal.scss";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const POSTCODE_MIN_HEIGHT = 460;

function AddressModal({ isOpen, onClose, onSelectAddress }) {
  const containerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);

      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) {
      return undefined;
    }

    const containerElement = containerRef.current;
    let frameId = 0;

    const Postcode = window.kakao?.Postcode ?? window.daum?.Postcode;

    if (!Postcode) {
      containerElement.textContent = "주소 검색 서비스를 불러오지 못했습니다.";
      return undefined;
    }

    containerElement.innerHTML = "";
    containerElement.style.minHeight = `${POSTCODE_MIN_HEIGHT}px`;
    containerElement.style.height = `${POSTCODE_MIN_HEIGHT}px`;

    frameId = window.requestAnimationFrame(() => {
      const postcode = new Postcode({
        oncomplete: (data) => {
          onSelectAddress(data);
        },
        onresize: (size) => {
          const nextHeight = Math.max(size.height, POSTCODE_MIN_HEIGHT);
          containerElement.style.height = `${nextHeight}px`;
        },
        width: "100%",
        height: "100%",
      });

      postcode.embed(containerElement);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      containerElement.innerHTML = "";
      containerElement.style.height = "";
      containerElement.style.minHeight = "";
    };
  }, [isOpen, onSelectAddress]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="address-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className="address-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="address-modal__header">
          <h2 id="address-modal-title" className="address-modal__title">
            주소 검색
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="address-modal__close"
            onClick={onClose}
            aria-label="주소 검색 닫기"
          >
            닫기
          </button>
        </div>

        <div ref={containerRef} className="address-modal__content" />
      </div>
    </div>,
    document.body,
  );
}

export default AddressModal;
