import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import CloseIcon from "assets/event/close.svg";

import "./EventModal.scss";
import EventModalDrawing from "./EventModalDrawing";
import EventModalIntro from "./EventModalIntro";
import EventModalResult from "./EventModalResult";
import MyBenefitView from "./MyBenefitView";
import {
  DEFAULT_EVENT_COUPON,
  EVENT_MODAL_BENEFIT_CONFIGS,
  EVENT_MODAL_DISMISS_STORAGE_KEY,
  EVENT_MODAL_LOGIN_ALERT,
  EVENT_MODAL_RESULT_CONTENT,
  EVENT_MODAL_STEPS,
  getRandomEventCoupon,
} from "./eventModalData";

const getDismissUntil = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(EVENT_MODAL_DISMISS_STORAGE_KEY);
  const dismissUntil = Number(storedValue);

  if (!storedValue || Number.isNaN(dismissUntil)) {
    return null;
  }

  if (dismissUntil <= Date.now()) {
    window.localStorage.removeItem(EVENT_MODAL_DISMISS_STORAGE_KEY);
    return null;
  }

  return dismissUntil;
};

function EventModal({
  isOpen,
  onClose,
  onDismissToday,
  initialStep = EVENT_MODAL_STEPS.INTRO,
  resultContent = EVENT_MODAL_RESULT_CONTENT,
  benefitConfigs = EVENT_MODAL_BENEFIT_CONFIGS,
}) {
  const titleId = useId();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [isDismissedForToday, setIsDismissedForToday] = useState(() => Boolean(getDismissUntil()));
  const [selectedCoupon, setSelectedCoupon] = useState(DEFAULT_EVENT_COUPON);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [previousStep, setPreviousStep] = useState(null);

  const shouldRenderModal = isOpen && !isDismissedForToday;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dismissed = Boolean(getDismissUntil());

    setIsDismissedForToday(dismissed);
    setSelectedCoupon(DEFAULT_EVENT_COUPON);
    setCurrentStep(initialStep);
    setPreviousStep(null);
  }, [initialStep, isOpen]);

  useEffect(() => {
    if (!shouldRenderModal) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const currentBodyPaddingRight =
      Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${currentBodyPaddingRight + scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldRenderModal, onClose]);

  const moveToStep = useCallback(
    (nextStep) => {
      setPreviousStep(currentStep);
      setCurrentStep(nextStep);
    },
    [currentStep],
  );

  const moveBack = useCallback(() => {
    setCurrentStep(previousStep ?? EVENT_MODAL_STEPS.INTRO);
    setPreviousStep(null);
  }, [previousStep]);

  const handleStart = useCallback(() => {
    if (!isLoggedIn) {
      window.alert(EVENT_MODAL_LOGIN_ALERT);
      onClose?.();
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });
      return;
    }

    setSelectedCoupon(getRandomEventCoupon());
    moveToStep(EVENT_MODAL_STEPS.DRAWING);
  }, [isLoggedIn, location.pathname, moveToStep, navigate, onClose]);

  const handleDrawingComplete = useCallback(() => {
    moveToStep(EVENT_MODAL_STEPS.RESULT);
  }, [moveToStep]);

  const handleOpenBenefits = useCallback(() => {
    moveToStep(EVENT_MODAL_STEPS.MY_BENEFIT);
  }, [moveToStep]);

  const handleDismissToday = useCallback(() => {
    const dismissUntil = new Date();
    dismissUntil.setHours(24, 0, 0, 0);

    window.localStorage.setItem(EVENT_MODAL_DISMISS_STORAGE_KEY, String(dismissUntil.getTime()));
    setIsDismissedForToday(true);

    onDismissToday?.(dismissUntil);
    onClose?.();
  }, [onClose, onDismissToday]);

  if (!shouldRenderModal) {
    return null;
  }

  const isDrawingStep = currentStep === EVENT_MODAL_STEPS.DRAWING;
  const isBenefitStep = currentStep === EVENT_MODAL_STEPS.MY_BENEFIT;
  const shouldHideCloseButton = isDrawingStep || isBenefitStep;

  const frameClassName = [
    "event-modal__frame",
    isDrawingStep ? "event-modal__frame--drawing" : "",
    isBenefitStep ? "event-modal__frame--benefit" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const stepViews = {
    [EVENT_MODAL_STEPS.INTRO]: (
      <EventModalIntro
        titleId={titleId}
        onStart={handleStart}
        onDismissToday={handleDismissToday}
      />
    ),
    [EVENT_MODAL_STEPS.DRAWING]: (
      <EventModalDrawing titleId={titleId} onComplete={handleDrawingComplete} shouldAutoComplete />
    ),
    [EVENT_MODAL_STEPS.RESULT]: (
      <EventModalResult
        titleId={titleId}
        content={resultContent}
        coupon={selectedCoupon}
        onContinueShopping={onClose}
        onOpenBenefits={handleOpenBenefits}
      />
    ),
    [EVENT_MODAL_STEPS.MY_BENEFIT]: (
      <MyBenefitView
        titleId={titleId}
        benefitConfigs={benefitConfigs}
        coupon={selectedCoupon}
        onBack={moveBack}
      />
    ),
  };

  return createPortal(
    <div className="event-modal" role="presentation">
      <button
        type="button"
        className="event-modal__overlay"
        onClick={onClose}
        aria-label="이벤트 모달 닫기 배경"
      />

      <div className="event-modal__container">
        <div
          className="event-modal__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className={frameClassName}>
            {!shouldHideCloseButton ? (
              <button
                type="button"
                className="event-modal__close"
                onClick={onClose}
                aria-label="이벤트 모달 닫기"
              >
                <img src={CloseIcon} alt="" />
              </button>
            ) : null}

            <div className="event-modal__inner">
              {stepViews[currentStep] ?? stepViews[EVENT_MODAL_STEPS.INTRO]}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default EventModal;
