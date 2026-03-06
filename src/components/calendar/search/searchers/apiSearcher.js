
export default async function apiSearcher(query) {
  const q = (query ?? "").trim();
  if (!q) return [];

  const res = await fetch(`/api/events/search?keyword=${encodeURIComponent(q)}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    throw new Error("search api failed");
  }

  const data = await res.json();

  // 念のため startAt/endAt を保証（バックエンドが start/end の場合の保険）
  return (data ?? []).map((e) => ({
    ...e,
    startAt: e.startAt ?? e.start,
    endAt: e.endAt ?? e.end,
  }));
}