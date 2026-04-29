import EventModalStepShell from "./EventModalStepShell";

const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

function EventModalResult({ titleId, content, coupon, onContinueShopping, onOpenBenefits }) {
  const handleCopy = async () => {
    try {
      await copyToClipboard(coupon.couponCode);
    } catch (error) {
      console.error("Failed to copy coupon code", error);
    }
  };

  return (
    <EventModalStepShell
      className="event-modal-view--result"
      titleId={titleId}
      eyebrow={content.eyebrow}
      title={
        <>
          <span className="event-modal-result__accent">{coupon.resultTitle}</span>
          {content.titleSuffix}
        </>
      }
      actions={
        <>
          <button
            type="button"
            className="event-modal__button event-modal__button--ghost"
            onClick={onContinueShopping}
          >
            {content.continueButtonLabel}
          </button>
          <button
            type="button"
            className="event-modal__button event-modal__button--primary"
            onClick={onOpenBenefits}
          >
            {content.benefitButtonLabel}
          </button>
        </>
      }
    >
      <div className="event-modal-result__visual">
        <img src={coupon.image} alt="" className="event-modal-result__image" />
      </div>

      <div className="event-modal-result__code-box">
        <div className="event-modal-result__code-copy">
          <span className="event-modal-result__code-label">{content.codeLabel}</span>
          <strong className="event-modal-result__code">{coupon.couponCode}</strong>
        </div>
        <button type="button" className="event-modal-result__copy-button" onClick={handleCopy}>
          {content.copyButtonLabel}
        </button>
      </div>
    </EventModalStepShell>
  );
}

export default EventModalResult;
