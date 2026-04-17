function UpdateSubCard({ image, title, description }) {
  return (
    <div className="sub_info">
      <div className="sub_title">
        <img src={image} alt="pakage_img" className="pakage_img" />
        <div className="pakage_texts">
          <p>{title}</p>
          <p className="gray_text">{description}</p>
        </div>
      </div>
      <div className="chevron" aria-hidden="true">
        <svg viewBox="0 0 24 12">
          <path d="M2 10L12 2L22 10" />
        </svg>
      </div>
    </div>
  );
}

export default UpdateSubCard;
