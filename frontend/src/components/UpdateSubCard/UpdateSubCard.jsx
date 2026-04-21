function UpdateSubCard({
  image,
  title,
  description,
  isActive = false,
  onClick,
  onChevronClick,
}) {
  const handleChevronClick = (event) => {
    event.stopPropagation();
    onChevronClick?.();
  };

  return (
    <button
      type="button"
      className={`sub_info ${isActive ? "is-active" : ""}`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <div className="sub_title">
        <img src={image} alt="pakage_img" className="pakage_img" />
        <div className="pakage_texts">
          <p>{title}</p>
          <p className="gray_text">{description}</p>
        </div>
      </div>
      <div className="chevron" aria-hidden="true" onClick={handleChevronClick}>
        <svg viewBox="0 0 24 12">
          <path d="M2 10L12 2L22 10" />
        </svg>
      </div>
    </button>
  );
}

export default UpdateSubCard;
