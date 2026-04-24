export const normalizeImageUrl = (value) => {
  const raw = String(value ?? "").trim();

  if (!raw || raw.startsWith("http:///")) {
    return "";
  }

  if (raw.startsWith("http://")) {
    return `https://${raw.slice("http://".length)}`;
  }

  return raw;
};
