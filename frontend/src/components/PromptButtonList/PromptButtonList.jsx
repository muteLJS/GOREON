import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const DESKTOP_BREAKPOINT = 1024;
const DEFAULT_GAP = 12;
const LARGE_GAP = 20;

const chunkItemsByCount = (items, size) => {
  if (!items.length) {
    return [];
  }

  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const getResultMobilePageSize = (width) => {
  if (width < 430) {
    return 2;
  }

  if (width < DESKTOP_BREAKPOINT) {
    return 3;
  }

  return null;
};

const chunkItemsByWidth = (items, widths, maxWidth, gap) => {
  if (!items.length) {
    return [];
  }

  const pages = [];
  let currentPage = [];
  let currentWidth = 0;

  items.forEach((item, index) => {
    const itemWidth = widths[index] ?? 0;
    const nextWidth = currentPage.length === 0 ? itemWidth : currentWidth + gap + itemWidth;

    if (currentPage.length > 0 && nextWidth > maxWidth) {
      pages.push(currentPage);
      currentPage = [item];
      currentWidth = itemWidth;
      return;
    }

    currentPage.push(item);
    currentWidth = nextWidth;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

function PromptButtonList({ items, variant = "default", onSelect }) {
  const containerRef = useRef(null);
  const measureRefs = useRef([]);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth >= DESKTOP_BREAKPOINT,
  );
  const [desktopPages, setDesktopPages] = useState([items]);
  const shouldUseMeasuredPages = variant === "result" || isDesktop;

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const updateViewport = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useLayoutEffect(() => {
    if (variant === "swiper") {
      setDesktopPages([items]);
      return undefined;
    }

    if (!shouldUseMeasuredPages) {
      setDesktopPages([items]);
      return undefined;
    }

    const updatePages = () => {
      if (variant === "result" && !isDesktop && typeof window !== "undefined") {
        setDesktopPages(
          chunkItemsByCount(items, getResultMobilePageSize(window.innerWidth) ?? items.length),
        );
        return;
      }

      const container = containerRef.current;
      if (!container) {
        setDesktopPages([items]);
        return;
      }

      const availableWidth = container.clientWidth;
      const gap =
        variant === "result" ? DEFAULT_GAP : availableWidth >= 1200 ? LARGE_GAP : DEFAULT_GAP;
      const widths = items.map((_, index) => measureRefs.current[index]?.offsetWidth ?? 0);

      if (!availableWidth || widths.some((width) => width === 0)) {
        setDesktopPages([items]);
        return;
      }

      setDesktopPages(chunkItemsByWidth(items, widths, availableWidth, gap));
    };

    updatePages();

    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => updatePages());

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updatePages);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updatePages);
    };
  }, [isDesktop, items, shouldUseMeasuredPages, variant]);

  if (variant === "swiper") {
    return (
      <div className="buttons buttons--swiper">
        <Swiper className="buttons__swiper" slidesPerView="auto" spaceBetween={10} watchOverflow>
          {items.map((item) => (
            <SwiperSlide key={item} className="buttons__slide">
              <button type="button" onClick={() => onSelect?.(item)}>
                {item}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  if (!shouldUseMeasuredPages) {
    return (
      <div className="buttons">
        {items.map((item) => (
          <button key={item} type="button" onClick={() => onSelect?.(item)}>
            {item}
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="buttons buttons--measure" aria-hidden="true">
        {items.map((item, index) => (
          <button
            key={`measure-${item}`}
            ref={(element) => {
              measureRefs.current[index] = element;
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div ref={containerRef} className="buttons buttons--desktop">
        {desktopPages.length === 1 ? (
          <div className="buttons__page">
            {items.map((item) => (
              <button key={item} type="button" onClick={() => onSelect?.(item)}>
                {item}
              </button>
            ))}
          </div>
        ) : (
          <Swiper
            className="buttons__pages-swiper"
            slidesPerView={1}
            spaceBetween={0}
            watchOverflow
          >
            {desktopPages.map((pageItems, pageIndex) => (
              <SwiperSlide key={`page-${pageIndex}`}>
                <div className="buttons__page">
                  {pageItems.map((item) => (
                    <button key={item} type="button" onClick={() => onSelect?.(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
}

export default PromptButtonList;
