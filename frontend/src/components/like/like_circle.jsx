/* -------------------------------------------------------------------------- */
/* [컴포넌트] 찜버튼                                                          */
/* -------------------------------------------------------------------------- */
import "./like.scss";

function like() {
  return (
    <button className="icon-btn like">
      <svg viewBox="0 0 24 24" className="icon">
        <path
          className="icon__stroke"
          d="M12 21s-6.5-4.35-9-8.28C1.5 9.5 3.5 6 7 6c2 0 3 1 5 3 2-2 3-3 5-3 3.5 0 5.5 3.5 4 6.72C18.5 16.65 12 21 12 21z"
        />
      </svg>
    </button>
  );
}

export default like;
