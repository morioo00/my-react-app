export default async function mockSearcher(query) {
  const mockEvents = [
    {
      id: "1",
      title: "会議",
      memo: "来週の進捗共有。議題：検索機能 / モーダル / API方針。",
      start: "2026-03-03T09:00",
      end: "2026-03-03T10:00",
    },
    {
      id: "2",
      title: "会議（デザイン）",
      memo: "検索結果カードの見た目調整。会議メモ：余白と文字サイズ。",
      start: "2026-03-02T14:00",
      end: "2026-03-02T15:00",
    },
    {
      id: "3",
      title: "定例MTG",
      memo: "会議：バックエンド検索APIのI/F確認（title+memo部分一致）。",
      start: "2026-03-04T11:00",
      end: "2026-03-04T11:30",
    },
    {
      id: "4",
      title: "面談",
      memo: "資料準備。メモ：質問リスト作成。",
      start: "2026-03-04T13:00",
      end: "2026-03-04T13:30",
    },
    {
      id: "5",
      title: "買い物",
      memo: "牛乳と卵。ついでに日用品。",
      start: "2026-03-01T18:00",
      end: "2026-03-01T18:30",
    },
    {
      id: "6",
      title: "会議（振り返り）",
      memo: "会議：今週の振り返り。来週の課題洗い出し。",
      start: "2026-03-05T17:00",
      end: "2026-03-05T17:45",
    },
  ];

  const q = (query ?? "").trim().toLowerCase();
  if (!q) return [];

  return mockEvents.filter((e) => {
    const t = (e.title ?? "").toLowerCase();
    const m = (e.memo ?? "").toLowerCase();
    return t.includes(q) || m.includes(q);
  });
}