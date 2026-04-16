import AICharacter from "../../assets/logo/ai/character.svg";

function ChatTriggerButton({ isOpen, isPreviewVisible, onToggle }) {
  return (
    <div className="chat-widget__trigger-wrap">
      <div className={`chat-widget__tooltip ${isPreviewVisible ? "is-visible" : ""}`}>
        <span>무엇을 찾고 계신가요?</span>
      </div>

      <button
        type="button"
        className={`chat-widget__trigger ${isOpen ? "is-open" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="chat-widget-panel"
        aria-label={isOpen ? "채팅창 닫기" : "채팅창 열기"}
      >
        <span className="chat-widget__trigger-icon" aria-hidden="true">
          <img src={AICharacter} alt="" />
        </span>
      </button>
    </div>
  );
}

export default ChatTriggerButton;
