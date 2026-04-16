import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

function ChatPanel({
  isOpen,
  isInitialView,
  isBusy,
  messages,
  suggestions,
  draft,
  error,
  onDraftChange,
  onSendMessage,
  onSuggestionClick,
  onBack,
  onClose,
}) {
  const backButtonLabel = isInitialView ? "채팅 닫기" : "초기 화면으로 돌아가기";

  return (
    <section
      id="chat-widget-panel"
      className={`chat-widget__window ${isOpen ? "is-open" : ""}`}
      aria-hidden={!isOpen}
      aria-label="AI 고르미 채팅"
      aria-busy={isBusy}
    >
      <header className="chat-widget__header">
        <button
          type="button"
          className="chat-widget__back-button"
          onClick={isInitialView ? onClose : onBack}
          aria-label={backButtonLabel}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 6L8.5 12L14.5 18" />
          </svg>
        </button>

        <div className="chat-widget__title">고르미와 채팅</div>
      </header>

      <div className="chat-widget__body">
        <div className={`chat-widget__content ${isInitialView ? "is-initial" : "is-chatting"}`}>
          <ChatMessageList messages={messages} isInitialView={isInitialView} />

          {isInitialView && (
            <div className="chat-widget__quick-replies">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion.id}
                  className="chat-widget__quick-reply"
                  onClick={() => onSuggestionClick(suggestion.label)}
                >
                  <span className="chat-widget__quick-reply-icon" aria-hidden="true">
                    {suggestion.emoji}
                  </span>
                  <span>{suggestion.label}</span>
                </button>
              ))}
            </div>
          )}

          {error && <p className="chat-widget__error">{error}</p>}
        </div>
      </div>

      <div className="chat-widget__composer-wrap">
        <ChatInput
          value={draft}
          disabled={isBusy}
          onChange={onDraftChange}
          onSend={onSendMessage}
        />
      </div>
    </section>
  );
}

export default ChatPanel;
