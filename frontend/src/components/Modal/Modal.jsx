/* [컴포넌트] 모달창 (Modal)                   */
/* 모바일에서 모달창을 그리는 컴포넌트 입니다. */
import { useEffect } from "react";
import "./Modal.scss";

/**
 * 모바일 화면의 하단에서 열리는 모달창 컴포넌트
 * @param {string} title 모달 상단에 표시될 제목
 * @param {React.ReactNode} children 모달 내부에 렌더링될 내용
 * @param {Function} onClose 모달창 닫기 클릭할 때 실행될 함수
 */
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
