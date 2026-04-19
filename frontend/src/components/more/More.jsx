import "./More.scss";

function More({ className = "" }) {
  return (
    <>
      <div className={`more ${className}`.trim()}>
        <p>더보기</p>
        <div className="icon_box" aria-hidden="true">
          <svg viewBox="0 0 49 31">
            <circle cx="33.5" cy="15" r="9" />
            <path d="M14 15H38" />
            <path d="M34 11L38 15L34 19" />
          </svg>
        </div>
      </div>
    </>
  );
}

export default More;
