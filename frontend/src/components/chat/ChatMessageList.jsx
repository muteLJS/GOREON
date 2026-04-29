import { useEffect, useRef } from "react";

import { getProductListKey } from "@/utils/productIdentity";
import AICharacter from "../AICharacter/AICharacter";
import ChatProductCard from "./ChatProductCard";

function ChatMessageList({ messages, isInitialView, onProductDetailClick }) {
  const listRef = useRef(null);
  const scrollStateRef = useRef({
    messageCount: 0,
    lastMessageId: null,
    lastTextLength: 0,
  });

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (isInitialView) {
      listRef.current.scrollTo({ top: 0, behavior: "auto" });
      scrollStateRef.current = {
        messageCount: messages.length,
        lastMessageId: lastMessage?.id ?? null,
        lastTextLength: lastMessage?.text?.length ?? 0,
      };
      return;
    }

    const { messageCount, lastMessageId, lastTextLength } = scrollStateRef.current;
    const hasNewMessage = messages.length !== messageCount || lastMessage?.id !== lastMessageId;
    const hasTypingProgress = (lastMessage?.text?.length ?? 0) !== lastTextLength;

    if (hasNewMessage || hasTypingProgress) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: hasNewMessage ? "smooth" : "auto",
      });
    }

    scrollStateRef.current = {
      messageCount: messages.length,
      lastMessageId: lastMessage?.id ?? null,
      lastTextLength: lastMessage?.text?.length ?? 0,
    };
  }, [isInitialView, messages]);

  return (
    <div
      className={`chat-widget__message-list ${isInitialView ? "is-initial" : "is-chatting"}`}
      ref={listRef}
    >
      {messages.map((message) => (
        <article key={message.id} className={`chat-widget__message-row is-${message.sender}`}>
          {message.sender === "bot" && (
            <div className="chat-widget__avatar" aria-hidden="true">
              <AICharacter title="AI 고르미" animated={false} />
            </div>
          )}

          <div className="chat-widget__message-content">
            {(message.type === "text" || message.type === "loading") && (
              <p
                className={`chat-widget__bubble is-${message.type} ${
                  message.isStreaming ? "is-streaming" : ""
                }`}
              >
                {message.text}
              </p>
            )}

            {message.type === "product" && (
              <div className="chat-widget__product-group">
                {message.text && <p className="chat-widget__bubble">{message.text}</p>}

                <div className="chat-widget__product-list">
                  {message.products.map((product) => (
                    <ChatProductCard
                      key={getProductListKey(product)}
                      product={product}
                      onViewDetails={onProductDetailClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default ChatMessageList;
