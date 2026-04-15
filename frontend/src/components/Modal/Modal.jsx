/* [컴포넌트] 모달창 (Modal)                                                             */
/* 모바일에서 모달창을 그리는 컴포넌트 입니다. TOP/CONTENT/BOTTOM 으로 나누어져있습니다. */

import { useEffect } from "react";
import "./Modal.scss";

function Modal({ title, children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__title">{title}</div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
