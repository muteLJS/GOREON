import { useEffect, useRef, useState } from "react";
import scrollUpIcon from "../../assets/icons/scrollUp.svg";
import "./ScrollTopButton.scss";

const DEFAULT_SCROLL_THRESHOLD = 360;

function ScrollTopButton({ className = "", threshold = DEFAULT_SCROLL_THRESHOLD }) {
  const frameRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const nextVisible = window.scrollY > threshold;

      setIsVisible((prevVisible) => (prevVisible === nextVisible ? prevVisible : nextVisible));
      frameRef.current = null;
    };

    const handleScroll = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`scroll-top-button ${className}`.trim()}
      aria-label="Scroll to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      data-visible={isVisible}
      onClick={handleClick}
    >
      <img src={scrollUpIcon} alt="" />
    </button>
  );
}

export default ScrollTopButton;
