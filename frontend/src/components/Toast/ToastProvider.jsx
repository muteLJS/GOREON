import "./Toast.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContext } from "./toastContext";

const EXIT_ANIMATION_MS = 120;
const DEFAULT_DURATION_MS = 1000;

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ToastMessage({ toast }) {
  if (!toast) {
    return null;
  }

  return (
    <div
      className={`toast ${
        toast.stage === "visible" ? "is-visible" : toast.stage === "exit" ? "is-exiting" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="toast__message">{toast.message}</p>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const autoDismissTimerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const enterAnimationFrameRef = useRef(null);

  const clearScheduledWork = useCallback(() => {
    if (autoDismissTimerRef.current) {
      window.clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    if (enterAnimationFrameRef.current) {
      window.cancelAnimationFrame(enterAnimationFrameRef.current);
      enterAnimationFrameRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (message, duration = DEFAULT_DURATION_MS) => {
      if (!message) {
        return "";
      }

      const nextToastId = createToastId();

      clearScheduledWork();
      setToast({ id: nextToastId, message, stage: "enter" });

      enterAnimationFrameRef.current = window.requestAnimationFrame(() => {
        enterAnimationFrameRef.current = null;
        setToast((currentToast) =>
          currentToast?.id === nextToastId
            ? { ...currentToast, stage: "visible" }
            : currentToast,
        );
      });

      autoDismissTimerRef.current = window.setTimeout(() => {
        setToast((currentToast) =>
          currentToast?.id === nextToastId ? { ...currentToast, stage: "exit" } : currentToast,
        );

        exitTimerRef.current = window.setTimeout(() => {
          setToast((currentToast) => (currentToast?.id === nextToastId ? null : currentToast));
          exitTimerRef.current = null;
        }, EXIT_ANIMATION_MS);
      }, duration);
    },
    [clearScheduledWork],
  );

  useEffect(
    () => () => {
      clearScheduledWork();
    },
    [clearScheduledWork],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastMessage key={toast?.id ?? "toast-empty"} toast={toast} />
    </ToastContext.Provider>
  );
}
