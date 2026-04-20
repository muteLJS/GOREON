function EventModalStepShell({
  titleId,
  toolbar,
  eyebrow,
  title,
  children,
  actions,
  footer,
  className = "",
}) {
  const viewClassName = ["event-modal-view", className].filter(Boolean).join(" ");

  return (
    <section className={viewClassName}>
      {toolbar ? <div className="event-modal-view__toolbar">{toolbar}</div> : null}

      {(eyebrow || title) && (
        <header className="event-modal-view__header">
          {eyebrow ? <p className="event-modal-view__eyebrow">{eyebrow}</p> : null}
          {title ? (
            <h2 id={titleId} className="event-modal-view__title">
              {title}
            </h2>
          ) : null}
        </header>
      )}

      <div className="event-modal-view__body">{children}</div>

      {actions ? <div className="event-modal-view__actions">{actions}</div> : null}
      {footer ? <div className="event-modal-view__footer">{footer}</div> : null}
    </section>
  );
}

export default EventModalStepShell;
