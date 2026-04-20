import { useEffect, useRef, useState } from "react";

import EventModalVideo from "assets/event/eventModal.mp4";

import EventModalStepShell from "./EventModalStepShell";
import { EVENT_MODAL_DRAWING_CONTENT } from "./eventModalData";

const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

function EventModalDrawing({ titleId, onComplete, shouldAutoComplete = false }) {
  const animationFrameRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = 0;

    const updateProgress = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / EVENT_MODAL_DRAWING_CONTENT.progressDuration, 1);
      const easedProgress = easeOutCubic(rawProgress);

      setProgress(easedProgress * 100);

      if (rawProgress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(updateProgress);
        return;
      }

      if (shouldAutoComplete) {
        onComplete?.();
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(updateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [onComplete, shouldAutoComplete]);

  return (
    <EventModalStepShell
      className="event-modal-view--drawing"
      titleId={titleId}
      eyebrow={EVENT_MODAL_DRAWING_CONTENT.eyebrow}
      title={EVENT_MODAL_DRAWING_CONTENT.title}
    >
      <div className="event-modal-drawing__visual">
        <video
          className="event-modal-drawing__video"
          src={EventModalVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      <div
        className="event-modal-drawing__progress"
        role="progressbar"
        aria-label="혜택 추첨 진행 상태"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span className="event-modal-drawing__progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <p className="event-modal-drawing__caption">{EVENT_MODAL_DRAWING_CONTENT.caption}</p>
    </EventModalStepShell>
  );
}

export default EventModalDrawing;
