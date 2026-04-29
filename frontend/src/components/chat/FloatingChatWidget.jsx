import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ChatPanel from "./ChatPanel";
import ChatTriggerButton from "./ChatTriggerButton";
import ScrollTopButton from "../ScrollTopButton/ScrollTopButton";
import {
  CHAT_MODE,
  CHAT_SUGGESTIONS,
  createInitialMessages,
  createLoadingMessage,
  createProductMessage,
  createTextMessage,
} from "./chatData";
import { addAiRecommendationHistory } from "@/store/slices/aiRecommendationHistory";
import { fetchAiRecommendations } from "@/utils/recommendations";
import {
  createAiRecommendationHistoryEntry,
  normalizeAiRecommendationProduct,
  toChatRecommendationProduct,
} from "@/utils/aiRecommendationMappers";
import "./FloatingChatWidget.scss";

const PREVIEW_DURATION_MS = 3200;
const LOADING_DURATION_MS = 700;
const PRODUCT_DELAY_MS = 200;
const TYPING_SPEED_MS = 45;
const CHAT_MESSAGES_STORAGE_KEY = "goreon:chat-widget:messages";

const createStatusState = () => ({
  isLoading: false,
  isTyping: false,
  error: null,
});

const getChatStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const removePendingAssistantMessages = (messages) =>
  messages.filter((message) => message.type !== "loading" && !message.isStreaming);

const isValidStoredMessages = (messages) =>
  Array.isArray(messages) &&
  messages.length > 0 &&
  messages.every(
    (message) =>
      message &&
      typeof message.id === "string" &&
      typeof message.sender === "string" &&
      typeof message.type === "string",
  );

const loadStoredMessages = (fallbackMessages) => {
  const storage = getChatStorage();

  if (!storage) {
    return fallbackMessages;
  }

  try {
    const rawMessages = storage.getItem(CHAT_MESSAGES_STORAGE_KEY);

    if (!rawMessages) {
      return fallbackMessages;
    }

    const storedMessages = removePendingAssistantMessages(JSON.parse(rawMessages));

    return isValidStoredMessages(storedMessages) ? storedMessages : fallbackMessages;
  } catch {
    return fallbackMessages;
  }
};

const persistMessages = (messages) => {
  const storage = getChatStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      CHAT_MESSAGES_STORAGE_KEY,
      JSON.stringify(removePendingAssistantMessages(messages)),
    );
  } catch {
    // localStorage may be unavailable in private mode or when quota is exceeded.
  }
};

function FloatingChatWidget() {
  const dispatch = useDispatch();
  const location = useLocation();
  const widgetRef = useRef(null);
  const initialMessagesRef = useRef(createInitialMessages());
  const timeoutIdsRef = useRef([]);
  const typingTimerRef = useRef(null);
  const requestAbortRef = useRef(null);
  const requestSeqRef = useRef(0);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [mode, setMode] = useState(CHAT_MODE.IDLE);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(() => loadStoredMessages(initialMessagesRef.current));
  const [status, setStatus] = useState(createStatusState());
  const [isSuppressed, setIsSuppressed] = useState(false);

  const isOpen = mode === CHAT_MODE.INITIAL || mode === CHAT_MODE.CHATTING;
  const isPreviewVisible = mode === CHAT_MODE.PREVIEW;
  const hasChatHistory = messages.length > initialMessagesRef.current.length;
  const visibleMessages = mode === CHAT_MODE.INITIAL ? initialMessagesRef.current : messages;

  const clearResponseTimers = useCallback(() => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    timeoutIdsRef.current = [];

    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, []);

  const abortRecommendationRequest = useCallback(() => {
    requestSeqRef.current += 1;

    if (requestAbortRef.current) {
      requestAbortRef.current.abort();
      requestAbortRef.current = null;
    }
  }, []);

  const clearPendingAssistantMessages = useCallback(() => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.type !== "loading" && !message.isStreaming),
    );
  }, []);

  const cancelPendingAssistantResponse = useCallback(() => {
    clearResponseTimers();
    abortRecommendationRequest();
    setStatus(createStatusState());
    clearPendingAssistantMessages();
  }, [abortRecommendationRequest, clearPendingAssistantMessages, clearResponseTimers]);

  const resetChat = useCallback(() => {
    clearResponseTimers();
    abortRecommendationRequest();
    setDraft("");
    setMessages(initialMessagesRef.current);
    setStatus(createStatusState());
  }, [abortRecommendationRequest, clearResponseTimers]);

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

  useEffect(
    () => () => {
      clearResponseTimers();
      abortRecommendationRequest();
    },
    [abortRecommendationRequest, clearResponseTimers],
  );

  useEffect(() => {
    persistMessages(messages);
  }, [messages]);

  useLayoutEffect(() => {
    const hiddenSections = Array.from(document.querySelectorAll("[data-hide-floating-chat]"));

    if (hiddenSections.length === 0 || !("IntersectionObserver" in window)) {
      setIsSuppressed(false);
      return undefined;
    }

    const visibleSections = new Set();
    const updateSuppressedState = () => {
      setIsSuppressed(visibleSections.size > 0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target);
          } else {
            visibleSections.delete(entry.target);
          }
        });

        updateSuppressedState();
      },
      {
        threshold: 0.01,
      },
    );

    hiddenSections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        visibleSections.add(section);
      }

      observer.observe(section);
    });
    updateSuppressedState();

    return () => {
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isSuppressed) {
      cancelPendingAssistantResponse();
      setMode(CHAT_MODE.IDLE);
    }
  }, [cancelPendingAssistantResponse, isSuppressed]);

  useEffect(() => {
    if (isSuppressed || !isTouchDevice || hasOpenedOnce || mode !== CHAT_MODE.IDLE) {
      return undefined;
    }

    setMode(CHAT_MODE.PREVIEW);

    const previewTimerId = window.setTimeout(() => {
      setMode((currentMode) => (currentMode === CHAT_MODE.PREVIEW ? CHAT_MODE.IDLE : currentMode));
    }, PREVIEW_DURATION_MS);

    return () => {
      window.clearTimeout(previewTimerId);
    };
  }, [hasOpenedOnce, isSuppressed, isTouchDevice, mode]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        cancelPendingAssistantResponse();
        setMode(CHAT_MODE.IDLE);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        cancelPendingAssistantResponse();
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
  }, [cancelPendingAssistantResponse, isOpen]);

  const handleOpen = () => {
    if (isSuppressed) {
      return;
    }

    setHasOpenedOnce(true);
    setMode(hasChatHistory ? CHAT_MODE.CHATTING : CHAT_MODE.INITIAL);
  };

  const handleToggle = () => {
    if (isOpen) {
      cancelPendingAssistantResponse();
      setMode(CHAT_MODE.IDLE);
      return;
    }

    handleOpen();
  };

  const handleMouseEnter = () => {
    if (!isSuppressed && !isTouchDevice && mode === CHAT_MODE.IDLE) {
      setMode(CHAT_MODE.PREVIEW);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice && mode === CHAT_MODE.PREVIEW) {
      setMode(CHAT_MODE.IDLE);
    }
  };

  const handleClose = () => {
    cancelPendingAssistantResponse();
    setMode(CHAT_MODE.IDLE);
  };

  const handleProductDetailClick = () => {
    cancelPendingAssistantResponse();
    setMode(CHAT_MODE.IDLE);
  };

  const handleBack = () => {
    resetChat();
    setMode(CHAT_MODE.INITIAL);
  };

  const startAssistantTyping = ({ answerText, loadingMessageId, products, requestSeq }) => {
    const streamingMessage = createTextMessage({
      sender: "bot",
      text: "",
      isStreaming: true,
    });

    setMessages((prevMessages) => [
      ...prevMessages.filter((message) => message.id !== loadingMessageId),
      streamingMessage,
    ]);
    setStatus({
      isLoading: false,
      isTyping: true,
      error: null,
    });

    let currentIndex = 0;

    typingTimerRef.current = window.setInterval(() => {
      if (requestSeq !== requestSeqRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        return;
      }

      currentIndex += 1;

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === streamingMessage.id
            ? {
                ...message,
                text: answerText.slice(0, currentIndex),
                isStreaming: currentIndex < answerText.length,
              }
            : message,
        ),
      );

      if (currentIndex < answerText.length) {
        return;
      }

      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;

      if (requestSeq !== requestSeqRef.current) {
        return;
      }

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

      if (products.length === 0) {
        return;
      }

      const productTimerId = window.setTimeout(() => {
        timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== productTimerId);

        if (requestSeq !== requestSeqRef.current) {
          return;
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          createProductMessage({
            text: "추천 상품을 카드로 정리했어요.",
            products,
          }),
        ]);
      }, PRODUCT_DELAY_MS);

      timeoutIdsRef.current.push(productTimerId);
    }, TYPING_SPEED_MS);
  };

  const handleSendMessage = async (question) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || status.isLoading || status.isTyping) {
      return;
    }

    clearResponseTimers();
    abortRecommendationRequest();

    const userMessage = createTextMessage({
      sender: "user",
      text: trimmedQuestion,
    });
    const loadingMessage = createLoadingMessage({});
    const controller = new AbortController();

    requestAbortRef.current = controller;
    requestSeqRef.current += 1;
    const requestSeq = requestSeqRef.current;

    setDraft("");
    setHasOpenedOnce(true);
    setMode(CHAT_MODE.CHATTING);
    setStatus({
      isLoading: true,
      isTyping: false,
      error: null,
    });
    setMessages((prevMessages) => {
      const nextMessages = mode === CHAT_MODE.INITIAL ? initialMessagesRef.current : prevMessages;

      return [...nextMessages, userMessage, loadingMessage];
    });

    try {
      const result = await fetchAiRecommendations({
        query: trimmedQuestion,
        limit: 3,
        signal: controller.signal,
      });

      if (requestSeq !== requestSeqRef.current || controller.signal.aborted) {
        return;
      }

      const normalizedProducts = Array.isArray(result?.products)
        ? result.products.map(normalizeAiRecommendationProduct)
        : [];
      const answerText =
        result?.message ||
        (normalizedProducts.length > 0
          ? "현재 상품 데이터 기준으로 조건에 가까운 제품을 골랐어요."
          : "조건에 맞는 상품을 찾지 못했어요. 조건을 조금 더 넓혀볼까요?");
      const chatProducts = normalizedProducts.map(toChatRecommendationProduct);

      if (normalizedProducts.length > 0) {
        dispatch(
          addAiRecommendationHistory(
            createAiRecommendationHistoryEntry({
              query: trimmedQuestion,
              message: answerText,
              products: normalizedProducts,
            }),
          ),
        );
      }

      if (requestSeq !== requestSeqRef.current || controller.signal.aborted) {
        return;
      }

      const loadingTimerId = window.setTimeout(() => {
        timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== loadingTimerId);

        if (requestSeq !== requestSeqRef.current || controller.signal.aborted) {
          return;
        }

        startAssistantTyping({
          answerText,
          loadingMessageId: loadingMessage.id,
          products: chatProducts,
          requestSeq,
        });
      }, LOADING_DURATION_MS);

      timeoutIdsRef.current.push(loadingTimerId);
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        return;
      }

      if (requestSeq !== requestSeqRef.current || controller.signal.aborted) {
        return;
      }

      setStatus({
        isLoading: false,
        isTyping: false,
        error: "추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      });
      setMessages((prevMessages) => [
        ...prevMessages.filter((message) => message.id !== loadingMessage.id),
        createTextMessage({
          sender: "bot",
          text: "추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        }),
      ]);
    } finally {
      if (requestAbortRef.current === controller) {
        requestAbortRef.current = null;
      }
    }
  };

  if (isSuppressed) {
    return null;
  }

  return (
    <div className="chat-widget" ref={widgetRef}>
      {isOpen && (
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
          onProductDetailClick={handleProductDetailClick}
          onBack={handleBack}
          onClose={handleClose}
        />
      )}

      <ScrollTopButton className="chat-widget__scroll-top" />

      <ChatTriggerButton
        isOpen={isOpen}
        isPreviewVisible={isPreviewVisible}
        onToggle={handleToggle}
        onPreviewEnter={handleMouseEnter}
        onPreviewLeave={handleMouseLeave}
      />
    </div>
  );
}

export default FloatingChatWidget;
