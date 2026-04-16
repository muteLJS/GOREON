function ChatInput({ value, disabled = false, onChange, onSend }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    onSend(value);
  };

  return (
    <form className="chat-widget__composer" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="무엇을 찾고 있나요?"
        aria-label="채팅 입력"
        disabled={disabled}
      />

      <button type="submit" aria-label="메시지 전송" disabled={disabled}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 13L12 9L16 13" />
        </svg>
      </button>
    </form>
  );
}

export default ChatInput;
