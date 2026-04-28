import "./RouteLoading.scss";

const segments = Array.from({ length: 12 }, (_, index) => index);

export default function RouteLoading({
  message = "페이지를 불러오는 중입니다...",
  variant = "page",
  className = "",
}) {
  const classNames = ["route-loading", `route-loading--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classNames} aria-live="polite" aria-busy="true">
      <div className="route-loading__content">
        <div className="route-loading__spinner" aria-hidden="true">
          {segments.map((segment) => (
            <span
              key={segment}
              className="route-loading__segment"
              style={{ "--segment-index": segment }}
            />
          ))}
        </div>
        <p className="route-loading__message">{message}</p>
      </div>
    </section>
  );
}
