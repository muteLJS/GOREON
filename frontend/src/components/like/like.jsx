/* -------------------------------------------------------------------------- */
/* [컴포넌트] 찜버튼                                                          */
/* -------------------------------------------------------------------------- */
import styles from "./like.module.scss";

import { registerModuleStyles } from "styles/registerModuleStyles";

registerModuleStyles(styles);

function Like({ active = false, onClick }) {
  return (
    <button
      type="button"
      className={`like-icon ${active ? "is-active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label="찜하기"
    >
      <svg viewBox="0 0 24 24" className="like-icon__svg" aria-hidden="true">
        <path
          className="like-icon__heart"
          d="M12 20.6c-.2 0-.4-.1-.6-.2-1.8-1.1-3.5-2.5-4.9-4-1.7-1.8-2.5-3.4-2.5-5 0-2.8 2-4.9 4.7-4.9 1.5 0 2.6.7 3.3 1.5.7-.8 1.9-1.5 3.3-1.5 2.8 0 4.7 2 4.7 4.9 0 1.6-.8 3.2-2.5 5-1.4 1.5-3.1 2.9-4.9 4-.2.1-.4.2-.6.2z"
        />
      </svg>
    </button>
  );
}

export default Like;
