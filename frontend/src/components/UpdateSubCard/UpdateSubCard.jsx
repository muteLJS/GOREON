function UpdateSubCard({
  thumbnailImage,
  title,
  description,
  isActive = false,
  isPreview = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onChevronClick,
}) {
  const handleChevronClick = (event) => {
    event.stopPropagation();
    onChevronClick?.();
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      onBlur?.();
    }
  };

  return (
    <article
      className={`sub_info ${isActive ? "is-active" : ""} ${isPreview ? "is-preview" : ""}`.trim()}
      role="listitem"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocusCapture={onFocus}
      onBlurCapture={handleBlur}
    >
      <button
        type="button"
        className="sub_info__content"
        onClick={onClick}
        aria-pressed={isActive}
      >
        <div className="sub_title">
          <div className="pakage_img_box">
            <img src={thumbnailImage} alt={title} className="pakage_img" />
          </div>
          <div className="pakage_texts">
            <p className="title">{title}</p>
            <p className="gray_text">{description}</p>
          </div>
        </div>
      </button>
      <button
        type="button"
        className="chevron"
        aria-label={`${title} details`}
        onClick={handleChevronClick}
      >
        <svg viewBox="0 0 24 24">
          <path d="M9 5L16 12L9 19" />
        </svg>
      </button>
    </article>
  );
}

export default UpdateSubCard;
