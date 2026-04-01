import { useEffect } from "react";
import "./EventDetailModal.css";

export default function EventDetailModal({
  open,
  event,
  onClose,
  onCloseAll,
  onJumpToDate,
}) {
  // Escで閉じる（×と同じ：完全終了）
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onCloseAll();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCloseAll]);

  // 背景スクロール抑止
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !event) return null;

  return (
    <div className="detailModalOverlay" onClick={onCloseAll}>
      <div className="detailModal" onClick={(e) => e.stopPropagation()}>
        <div className="detailModalHeader">
          {/* ここ変更: 左側操作を1グループにまとめる */}
          <div className="detailHeaderLeft">
            <button className="detailBackBtn" type="button" onClick={onClose}>
              <span className="detailBackIcon">←</span>
              <span>一覧へ</span>
            </button>

            <button
              className="detailJumpBtn" // ここ追加
              type="button"
              onClick={() => {
                const start = event?.start ?? event?.startAt;
                if (!start) return;
                onJumpToDate?.(start);
                onCloseAll?.();
              }}
            >
              該当の投稿へ
            </button>
          </div>

          <div className="detailModalTitle">{event.title}</div>

          <button
            className="detailModalClose"
            type="button"
            onClick={onCloseAll}
          >
            ✕
          </button>
        </div>

        <div className="detailModalBody">
          <div className="detailRow">
            <div className="detailLabel">日時</div>
            <div className="detailValue">
              {formatDateTime(event.startAt)} - {formatDateTime(event.endAt)}
            </div>
          </div>

          <div className="detailRow">
            <div className="detailLabel">メモ</div>
            <div className="detailMemo">{event.memo || "（メモなし）"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr ?? "");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}