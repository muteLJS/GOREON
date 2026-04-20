import "./Likecircle.scss";

function LikeCircle({ checked, defaultChecked = false, onChange, className = "" }) {
  return (
    <label className={`like-circle ${className}`.trim()} aria-label="찜하기">
      <input
        type="checkbox"
        className="like-circle__input"
        checked={checked}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        onChange={onChange}
      />
      <span className="like-circle__button">
        <svg viewBox="0 0 24 24" className="like-circle__icon" aria-hidden="true">
          <path
            className="like-circle__heart"
            d="M12 21s-6.5-4.35-9-8.28C1.5 9.5 3.5 6 7 6c2 0 3 1 5 3 2-2 3-3 5-3 3.5 0 5.5 3.5 4 6.72C18.5 16.65 12 21 12 21z"
          />
        </svg>
      </span>
    </label>
  );
}

export default LikeCircle;
