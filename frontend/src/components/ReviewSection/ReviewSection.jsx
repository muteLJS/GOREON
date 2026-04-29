import "./ReviewSection.scss";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from "../Rating/Rating";
import ChevronDown from "../../assets/icons/chevron-down.svg";
import ThumbsUp from "../../assets/icons/Thumbs_up.svg";
import { lockPageScroll } from "@/utils/scrollLock";

function ReviewSection({
  rating,
  reviewCount,
  photoCount,
  gallery,
  reviews,
  currentUserId = "",
  currentUserName = "",
  ownedReviewId = "",
  canManageReviewsFallback = false,
  onEditReview,
  onDeleteReview,
}) {
  const REVIEW_PREVIEW_COUNT = 5;
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const hasReviews = reviewCount > 0;
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [sortType, setSortType] = useState("popular");
  const [helpfulReviews, setHelpfulReviews] = useState(() =>
    reviews.reduce((acc, review) => {
      acc[review.id] = {
        count: review.helpfulCount ?? 0,
        liked: false,
      };
      return acc;
    }, {}),
  );

  useEffect(() => {
    if (!lightbox) {
      return undefined;
    }

    const releaseScrollLock = lockPageScroll();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }

      if (event.key === "ArrowLeft") {
        setLightbox((prev) => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            index: (prev.index - 1 + prev.images.length) % prev.images.length,
          };
        });
      }

      if (event.key === "ArrowRight") {
        setLightbox((prev) => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            index: (prev.index + 1) % prev.images.length,
          };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      releaseScrollLock();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox]);

  useEffect(() => {
    setHelpfulReviews(
      reviews.reduce((acc, review) => {
        acc[review.id] = {
          count: review.helpfulCount ?? 0,
          liked: false,
        };
        return acc;
      }, {}),
    );
  }, [reviews]);

  const openLightbox = (images, index, author) => {
    setLightbox({
      images,
      index,
      author,
    });
  };

  const moveLightbox = (delta) => {
    setLightbox((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        index: (prev.index + delta + prev.images.length) % prev.images.length,
      };
    });
  };

  const handleHelpfulClick = (reviewId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setHelpfulReviews((prev) => {
      const current = prev[reviewId] ?? { count: 0, liked: false };
      const nextLiked = !current.liked;

      return {
        ...prev,
        [reviewId]: {
          count: Math.max(0, current.count + (nextLiked ? 1 : -1)),
          liked: nextLiked,
        },
      };
    });
  };

  const getHelpfulState = (review) =>
    helpfulReviews[review.id] ?? {
      count: review.helpfulCount ?? 0,
      liked: false,
    };

  const normalizeName = (name) => String(name || "").trim();

  const isMyReview = (review) =>
    review.isMine ||
    (ownedReviewId && String(review.id) === String(ownedReviewId)) ||
    (currentUserId && String(review.userId) === String(currentUserId)) ||
    (normalizeName(currentUserName) &&
      normalizeName(review.author) === normalizeName(currentUserName)) ||
    canManageReviewsFallback;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortType === "rating") {
      return (b.rating ?? rating) - (a.rating ?? rating);
    }

    if (sortType === "latest") {
      return (
        new Date(b.createdAt || b.date.replaceAll(".", "-")) -
        new Date(a.createdAt || a.date.replaceAll(".", "-"))
      );
    }

    if (sortType === "oldest") {
      return (
        new Date(a.createdAt || a.date.replaceAll(".", "-")) -
        new Date(b.createdAt || b.date.replaceAll(".", "-"))
      );
    }

    return getHelpfulState(b).count - getHelpfulState(a).count;
  });

  const visibleReviews = isExpanded ? sortedReviews : sortedReviews.slice(0, REVIEW_PREVIEW_COUNT);
  const lightboxMarkup = lightbox ? (
    <div className="review-lightbox" onClick={() => setLightbox(null)}>
      <button
        type="button"
        className="review-lightbox__close"
        onClick={() => setLightbox(null)}
        aria-label="이미지 닫기"
      >
        ×
      </button>

      <button
        type="button"
        className="review-lightbox__nav review-lightbox__nav--prev"
        onClick={(event) => {
          event.stopPropagation();
          moveLightbox(-1);
        }}
        aria-label="이전 이미지"
      >
        ‹
      </button>

      <div className="review-lightbox__dialog" onClick={(event) => event.stopPropagation()}>
        <div className="review-lightbox__stage">
          <img
            src={lightbox.images[lightbox.index]}
            alt={`${lightbox.author} 리뷰 이미지 ${lightbox.index + 1}`}
            className="review-lightbox__image"
          />
        </div>

        <div className="review-lightbox__footer">
          <div className="review-lightbox__thumbs">
            {lightbox.images.map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={`review-lightbox__thumb ${index === lightbox.index ? "is-active" : ""}`}
                onClick={() =>
                  setLightbox((prev) =>
                    prev
                      ? {
                          ...prev,
                          index,
                        }
                      : prev,
                  )
                }
                aria-label={`이미지 ${index + 1} 보기`}
              >
                <img src={image} alt="" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="review-lightbox__count">
            {lightbox.index + 1}/{lightbox.images.length}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="review-lightbox__nav review-lightbox__nav--next"
        onClick={(event) => {
          event.stopPropagation();
          moveLightbox(1);
        }}
        aria-label="다음 이미지"
      >
        ›
      </button>
    </div>
  ) : null;

  if (!hasReviews) {
    return (
      <section className="review-section">
        <div className="review-section__empty">
          <p className="review-section__eyebrow">상품 리뷰</p>
          <p className="review-section__empty-message">아직 리뷰가 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="review-section">
      <header className="review-section__summary">
        <div>
          <p className="review-section__eyebrow">상품 리뷰</p>
          <div className="review-section__score-row">
            <strong className="review-section__score">{rating.toFixed(1)}</strong>
            <span className="review-section__stars" aria-label={`별점 ${rating.toFixed(1)} / 5`}>
              <Rating rating={rating} />
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

      <div className="review-section__sort" role="tablist" aria-label="리뷰 정렬">
        <button
          type="button"
          className={sortType === "popular" ? "is-active" : ""}
          onClick={() => setSortType("popular")}
        >
          인기순
        </button>
        <button
          type="button"
          className={sortType === "rating" ? "is-active" : ""}
          onClick={() => setSortType("rating")}
        >
          평점순
        </button>
        <button
          type="button"
          className={sortType === "latest" ? "is-active" : ""}
          onClick={() => setSortType("latest")}
        >
          최신순
        </button>
        <button
          type="button"
          className={sortType === "oldest" ? "is-active" : ""}
          onClick={() => setSortType("oldest")}
        >
          오래된순
        </button>
      </div>

      <div className="review-section__list">
        {visibleReviews.map((review) => {
          const helpfulState = getHelpfulState(review);
          const canManageReview = isMyReview(review);

          return (
            <article className="review-card" key={review.id}>
              <div className="review-card__top">
                <div>
                  <p className="review-card__author">{review.author}</p>
                  <div className="review-card__rating">
                    <Rating rating={review.rating ?? rating} />
                  </div>
                </div>
                <time className="review-card__date" dateTime={review.date}>
                  {review.date}
                </time>
              </div>

              {review.images?.length ? (
                <div className="review-card__images">
                  {review.images.map((image, index) => (
                    <button
                      type="button"
                      className="review-card__image"
                      key={`${review.id}-${index}`}
                      onClick={() => openLightbox(review.images, index, review.author)}
                      aria-label={`${review.author} 리뷰 이미지 ${index + 1} 크게 보기`}
                    >
                      <img src={image} alt={`${review.author} 리뷰 이미지 ${index + 1}`} />
                    </button>
                  ))}
                </div>
              ) : null}

              <p className="review-card__body">{review.body}</p>

              <div className="review-card__actions">
                <button
                  type="button"
                  className={`review-card__helpful ${helpfulState.liked ? "is-active" : ""}`}
                  onClick={() => handleHelpfulClick(review.id)}
                >
                  <img src={ThumbsUp} alt="" aria-hidden="true" />
                  <span>도움돼요 {helpfulState.count}</span>
                </button>

                {canManageReview ? (
                  <div className="review-card__manage-actions" aria-label="내 리뷰 관리">
                    <button
                      type="button"
                      className="review-card__manage-button"
                      onClick={() => onEditReview?.(review)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="review-card__manage-button review-card__manage-button--danger"
                      onClick={() => onDeleteReview?.(review)}
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  <button type="button" className="review-card__report">
                    신고하기
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {reviews.length > REVIEW_PREVIEW_COUNT ? (
        <button
          type="button"
          className="review-section__more"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <span>{isExpanded ? "리뷰 접기" : "리뷰 더보기"}</span>
          <img
            src={ChevronDown}
            alt=""
            aria-hidden="true"
            className={`review-section__more-icon ${isExpanded ? "is-expanded" : ""}`}
          />
        </button>
      ) : null}

      {lightboxMarkup ? createPortal(lightboxMarkup, document.body) : null}
    </section>
  );
}

export default ReviewSection;
