export function buildExcerpt(text, query, maxLen = 90) {
  const s = String(text ?? "");
  const q = query?.trim();
  if (!s) return "";

  if (!q) {
    return s.length > maxLen ? s.slice(0, maxLen) + "…" : s;
  }

  const lower = s.toLowerCase();
  const qLower = q.toLowerCase();
  const idx = lower.indexOf(qLower);

  if (idx === -1) {
    return s.length > maxLen ? s.slice(0, maxLen) + "…" : s;
  }

  const half = Math.floor(maxLen / 2);
  const start = Math.max(0, idx - half);
  const end = Math.min(s.length, start + maxLen);

  const prefix = start > 0 ? "…" : "";
  const suffix = end < s.length ? "…" : "";

  return prefix + s.slice(start, end) + suffix;
}