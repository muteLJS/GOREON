let lockCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";
let previousHtmlOverflow = "";
let htmlLocked = false;

const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

export const lockPageScroll = ({ lockHtml = false } = {}) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  if (lockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;
    previousHtmlOverflow = document.documentElement.style.overflow;
    htmlLocked = false;

    const scrollbarWidth = getScrollbarWidth();
    const currentBodyPaddingRight =
      Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${currentBodyPaddingRight + scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
  }

  if (lockHtml && !htmlLocked) {
    document.documentElement.style.overflow = "hidden";
    htmlLocked = true;
  }

  lockCount += 1;
  let isReleased = false;

  return () => {
    if (isReleased) {
      return;
    }

    isReleased = true;
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount === 0) {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
      document.documentElement.style.overflow = previousHtmlOverflow;
      htmlLocked = false;
    }
  };
};
