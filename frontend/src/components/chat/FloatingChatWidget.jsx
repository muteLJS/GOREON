import { useEffect, useRef, useState } from "react";
import ChatPanel from "./ChatPanel";
import ChatTriggerButton from "./ChatTriggerButton";
import {
  CHAT_MODE,
  CHAT_SUGGESTIONS,
  createInitialMessages,
  createLoadingMessage,
  createProductMessage,
  createTextMessage,
  getMockAssistantReply,
} from "./chatData";
import "./FloatingChatWidget.scss";

const PREVIEW_DURATION_MS = 3200;
const LOADING_DURATION_MS = 700;
const PRODUCT_DELAY_MS = 200;
const TYPING_SPEED_MS = 45;

const createStatusState = () => ({
  isLoading: false,
  isTyping: false,
  error: null,
});

function FloatingChatWidget() {
  const widgetRef = useRef(null);
  const initialMessagesRef = useRef(createInitialMessages());
  const timeoutIdsRef = useRef([]);
  const typingTimerRef = useRef(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [mode, setMode] = useState(CHAT_MODE.IDLE);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(initialMessagesRef.current);
  const [status, setStatus] = useState(createStatusState());

  const isOpen = mode === CHAT_MODE.INITIAL || mode === CHAT_MODE.CHATTING;
  const isPreviewVisible = mode === CHAT_MODE.PREVIEW;
  const hasChatHistory = messages.length > initialMessagesRef.current.length;
  const visibleMessages = mode === CHAT_MODE.INITIAL ? initialMessagesRef.current : messages;

  const clearResponseTimers = () => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    timeoutIdsRef.current = [];

    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const resetChat = () => {
    clearResponseTimers();
    setDraft("");
    setMessages(initialMessagesRef.current);
    setStatus(createStatusState());
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");

    const updateTouchState = (event) => {
      setIsTouchDevice(event.matches);
    };

    setIsTouchDevice(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateTouchState);
    } else {
      mediaQuery.addListener(updateTouchState);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateTouchState);
      } else {
        mediaQuery.removeListener(updateTouchState);
      }
    };
  }, []);

  useEffect(() => () => clearResponseTimers(), []);

  useEffect(() => {
    if (!isTouchDevice || hasOpenedOnce || mode !== CHAT_MODE.IDLE) {
      return undefined;
    }

    setMode(CHAT_MODE.PREVIEW);

    const previewTimerId = window.setTimeout(() => {
      setMode((currentMode) => (currentMode === CHAT_MODE.PREVIEW ? CHAT_MODE.IDLE : currentMode));
    }, PREVIEW_DURATION_MS);

    return () => {
      window.clearTimeout(previewTimerId);
    };
  }, [hasOpenedOnce, isTouchDevice, mode]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setMode(CHAT_MODE.IDLE);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMode(CHAT_MODE.IDLE);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setHasOpenedOnce(true);
    setMode(hasChatHistory ? CHAT_MODE.CHATTING : CHAT_MODE.INITIAL);
  };

  const handleToggle = () => {
    if (isOpen) {
      setMode(CHAT_MODE.IDLE);
      return;
    }

    handleOpen();
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice && mode === CHAT_MODE.IDLE) {
      setMode(CHAT_MODE.PREVIEW);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice && mode === CHAT_MODE.PREVIEW) {
      setMode(CHAT_MODE.IDLE);
    }
  };

  const handleClose = () => {
    setMode(CHAT_MODE.IDLE);
  };

  const handleBack = () => {
    resetChat();
    setMode(CHAT_MODE.INITIAL);
  };

  const handleSendMessage = (question) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || status.isLoading || status.isTyping) {
      return;
    }

    clearResponseTimers();

    const userMessage = createTextMessage({
      sender: "user",
      text: trimmedQuestion,
    });
    const loadingMessage = createLoadingMessage({});
    const assistantReply = getMockAssistantReply();

    setDraft("");
    setHasOpenedOnce(true);
    setMode(CHAT_MODE.CHATTING);
    setStatus({
      isLoading: true,
      isTyping: false,
      error: null,
    });
    setMessages((prevMessages) => {
      const nextMessages =
        mode === CHAT_MODE.INITIAL ? initialMessagesRef.current : prevMessages;

      return [...nextMessages, userMessage, loadingMessage];
    });

    const loadingTimerId = window.setTimeout(() => {
      timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== loadingTimerId);

      const streamingMessage = createTextMessage({
        sender: "bot",
        text: "",
        isStreaming: true,
      });

      setMessages((prevMessages) => [
        ...prevMessages.filter((message) => message.id !== loadingMessage.id),
        streamingMessage,
      ]);
      setStatus({
        isLoading: false,
        isTyping: true,
        error: null,
      });

      let currentIndex = 0;

      // 추후 스트리밍 응답이 들어오면 이 구간을 chunk append 로직으로 교체하면 된다.
      typingTimerRef.current = window.setInterval(() => {
        currentIndex += 1;

        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === streamingMessage.id
              ? {
                  ...message,
                  text: assistantReply.answerText.slice(0, currentIndex),
                  isStreaming: currentIndex < assistantReply.answerText.length,
                }
              : message,
          ),
        );

        if (currentIndex < assistantReply.answerText.length) {
          return;
        }

        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;

        setStatus({
          isLoading: false,
          isTyping: false,
          error: null,
        });
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === streamingMessage.id ? { ...message, isStreaming: false } : message,
          ),
        );

        const productTimerId = window.setTimeout(() => {
          timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== productTimerId);

          setMessages((prevMessages) => [
            ...prevMessages,
            createProductMessage({
              text: assistantReply.productSummary,
              products: assistantReply.products,
            }),
          ]);
        }, PRODUCT_DELAY_MS);

        timeoutIdsRef.current.push(productTimerId);
      }, TYPING_SPEED_MS);
    }, LOADING_DURATION_MS);

    timeoutIdsRef.current.push(loadingTimerId);
  };

  return (
    <div
      className="chat-widget"
      ref={widgetRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ChatPanel
        isOpen={isOpen}
        isInitialView={mode === CHAT_MODE.INITIAL}
        isBusy={status.isLoading || status.isTyping}
        messages={visibleMessages}
        suggestions={CHAT_SUGGESTIONS}
        draft={draft}
        error={status.error}
        onDraftChange={setDraft}
        onSendMessage={handleSendMessage}
        onSuggestionClick={handleSendMessage}
        onBack={handleBack}
        onClose={handleClose}
      />

      <ChatTriggerButton
        isOpen={isOpen}
        isPreviewVisible={isPreviewVisible}
        onToggle={handleToggle}
      />
    </div>
  );
}

export default FloatingChatWidget;
