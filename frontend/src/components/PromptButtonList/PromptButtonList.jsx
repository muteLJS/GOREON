import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function PromptButtonList({ items, variant = "default" }) {
  if (variant === "swiper") {
    return (
      <div className="buttons buttons--swiper">
        <Swiper className="buttons__swiper" slidesPerView="auto" spaceBetween={10}>
          {items.map((item) => (
            <SwiperSlide key={item} className="buttons__slide">
              <button type="button">{item}</button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className="buttons">
      {items.map((item) => (
        <button key={item} type="button">
          {item}
        </button>
      ))}
    </div>
  );
}

export default PromptButtonList;
