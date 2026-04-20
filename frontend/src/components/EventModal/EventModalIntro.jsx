import EventFirstImage from "assets/event/eventfirst.png";
import InfoIcon from "assets/event/info.svg";

import EventModalStepShell from "./EventModalStepShell";
import { EVENT_MODAL_INTRO_CONTENT } from "./eventModalData";

function EventModalIntro({ titleId, onStart, onDismissToday }) {
  return (
    <EventModalStepShell
      className="event-modal-view--intro"
      titleId={titleId}
      eyebrow={EVENT_MODAL_INTRO_CONTENT.eyebrow}
      title={EVENT_MODAL_INTRO_CONTENT.title}
      actions={
        <button type="button" className="event-modal__button event-modal__button--primary" onClick={onStart}>
          {EVENT_MODAL_INTRO_CONTENT.primaryButtonLabel}
        </button>
      }
      footer={
        <button type="button" className="event-modal__text-button" onClick={onDismissToday}>
          {EVENT_MODAL_INTRO_CONTENT.dismissLabel}
        </button>
      }
    >
      <div className="event-modal-intro__visual">
        <img src={EventFirstImage} alt="" className="event-modal-intro__image" />
      </div>

      <div className="event-modal-intro__info">
        <img src={InfoIcon} alt="" className="event-modal-intro__info-icon" />
        <div className="event-modal-intro__info-copy">
          <strong className="event-modal-intro__info-title">{EVENT_MODAL_INTRO_CONTENT.infoTitle}</strong>
          <p className="event-modal-intro__info-description">{EVENT_MODAL_INTRO_CONTENT.infoDescription}</p>
        </div>
      </div>
    </EventModalStepShell>
  );
}

export default EventModalIntro;
