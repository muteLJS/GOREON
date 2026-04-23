import "./Toast.scss";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toastContext";

const EXIT_ANIMATION_MS = 120;
const DEFAULT_DURATION_MS = 1000;

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ToastViewport({ toast }) {
  if (!toast) {
    return null;
  }

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      <div
        key={toast.id}
        className={`toast ${
          toast.stage === "visible" ? "is-visible" : toast.stage === "exit" ? "is-exiting" : ""
        }`}
        role="status"
      >
        <p className="toast__message">{toast.message}</p>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const autoDismissTimerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (autoDismissTimerRef.current) {
      window.clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (message, duration = DEFAULT_DURATION_MS) => {
      if (!message) {
        return "";
      }

      const toastId = createToastId();
      const nextToast = {
        id: toastId,
        message,
        stage: "enter",
      };

      clearTimers();
      setToast(nextToast);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setToast((currentToast) =>
            currentToast?.id === toastId ? { ...currentToast, stage: "visible" } : currentToast,
          );
        });
      });

      autoDismissTimerRef.current = window.setTimeout(() => {
        setToast((currentToast) => {
          if (!currentToast || currentToast.id !== toastId) {
            return currentToast;
          }

          return { ...currentToast, stage: "exit" };
        });

        exitTimerRef.current = window.setTimeout(() => {
          setToast((currentToast) => (currentToast?.id === toastId ? null : currentToast));
          exitTimerRef.current = null;
        }, EXIT_ANIMATION_MS);
      }, duration);

      return toastId;
    },
    [clearTimers],
  );

  useEffect(
    () => () => {
      clearTimers();
    },
    [clearTimers],
  );

  const contextValue = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toast={toast} />
    </ToastContext.Provider>
  );
}
