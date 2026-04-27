/* [컴포넌트] 모달창 (Modal)                   */
/* 모바일에서 모달창을 그리는 컴포넌트 입니다. */
import { useEffect, useRef, useState } from "react";
import "./Modal.scss";
import CloseIcon from "@/assets/event/close.svg";

/**
 * 모바일 화면의 하단에서 열리는 모달창 컴포넌트
 * @param {string} title 모달 상단에 표시될 제목
 * @param {React.ReactNode} children 모달 내부에 렌더링될 내용
 * @param {Function} onClose 모달창 닫기 클릭할 때 실행될 함수
 */
function Modal({
  title,
  children,
  onClose,
  className = "",
  overlayClassName = "",
  showCloseButton = true,
  dragToClose = false,
}) {
  const dragStateRef = useRef({ isDragging: false, pointerId: null, startY: 0 });
  const [dragOffset, setDragOffset] = useState(0);

  const resetDragState = () => {
    dragStateRef.current = { isDragging: false, pointerId: null, startY: 0 };
    setDragOffset(0);
  };

  const handleDragStart = (event) => {
    if (!dragToClose || !onClose) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleDragMove = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.isDragging || dragState.pointerId !== event.pointerId) {
      return;
    }

    setDragOffset(Math.max(0, event.clientY - dragState.startY));
  };

  const handleDragEnd = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.isDragging || dragState.pointerId !== event.pointerId) {
      return;
    }

    const finalOffset = Math.max(0, event.clientY - dragState.startY);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    resetDragState();

    if (finalOffset >= 96) {
      onClose();
    }
  };

  return (
    <div className={`modal-overlay ${overlayClassName}`.trim()} onClick={onClose}>
      <div
        className={`modal ${dragToClose ? "modal--draggable" : ""} ${className}`.trim()}
        style={dragOffset > 0 ? { transform: `translateY(${dragOffset}px)` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {dragToClose && (
          <div
            className="modal__drag-zone"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={resetDragState}
          >
            <span className="modal__drag-handle" />
          </div>
        )}
        <div className="modal__title">{title}</div>
        {showCloseButton && onClose && (
          <button type="button" className="modal__close" onClick={onClose} aria-label="닫기">
            <img src={CloseIcon} alt="" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;
