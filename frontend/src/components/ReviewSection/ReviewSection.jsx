import styles from "./ReviewSection.module.scss";
import { registerModuleStyles } from "styles/registerModuleStyles";
import { useState } from "react";

registerModuleStyles(styles);

function ReviewSection({ rating, reviewCount, photoCount, gallery, reviews }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleReviews = isExpanded ? reviews : reviews.slice(0, 4);

  return (
    <section className="review-section">
      <header className="review-section__summary">
        <div>
          <p className="review-section__eyebrow">상품 리뷰</p>
          <div className="review-section__score-row">
            <strong className="review-section__score">{rating.toFixed(1)}</strong>
            <span className="review-section__stars" aria-label={`별점 ${rating.toFixed(1)} / 5`}>
              ★★★★★
            </span>
          </div>
          <p className="review-section__meta">리뷰 {reviewCount.toLocaleString("ko-KR")}개</p>
        </div>

        <div className="review-section__photo-box">
          <span className="review-section__photo-count">{photoCount.toLocaleString("ko-KR")}</span>
          <span className="review-section__photo-label">포토 리뷰</span>
        </div>
      </header>

      {gallery?.length ? (
        <div className="review-section__gallery" aria-label="리뷰 이미지 모음">
          {gallery.map((image, index) => (
            <div className="review-section__gallery-item" key={`${image}-${index}`}>
              <img src={image} alt={`리뷰 이미지 ${index + 1}`} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="review-section__list">
        {visibleReviews.map((review) => (
          <article className="review-card" key={review.id}>
            <div className="review-card__top">
              <div>
                <p className="review-card__author">{review.author}</p>
                <p className="review-card__rating">★★★★★</p>
              </div>
              <time className="review-card__date" dateTime={review.date}>
                {review.date}
              </time>
            </div>

            <p className="review-card__body">{review.body}</p>

            {review.images?.length ? (
              <div className="review-card__images">
                {review.images.map((image, index) => (
                  <div className="review-card__image" key={`${review.id}-${index}`}>
                    <img src={image} alt={`${review.author} 리뷰 이미지 ${index + 1}`} />
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {reviews.length > 4 ? (
        <button
          type="button"
          className="review-section__more"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "리뷰 접기" : "리뷰 더보기"}
        </button>
      ) : null}
    </section>
  );
}

export default ReviewSection;
