import { useEffect } from "react";
import "./SearchResultModal.css";
import { highlightText } from "./utils/highlight";
import { buildExcerpt } from "./utils/excerpt";

export default function SearchResultModal({
  open,
  loading,
  error,
  query,
  results,
  onClose,
  onSelect,
}) {
  // Escで閉じる
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // 背景スクロール抑止
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="searchModalOverlay" onClick={onClose}>
      <div
        className="searchModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="searchModalHeader">
          <div className="searchModalTitle">
            検索結果（{results.length}件）
          </div>
          <button
            className="searchModalClose"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="searchModalBody">
          {loading && <div className="searchState">検索中...</div>}

          {error && <div className="searchState error">{error}</div>}

          {!loading && !error && results.length === 0 && (
            <div className="searchState">該当なし</div>
          )}

          {!loading &&
            !error &&
            results.map((ev) => (
              <div
                key={ev.id}
                className="searchResultCard"
                onClick={() => onSelect(ev)}
              >
                <div className="searchResultTitle">
                  {highlightText(ev.title, query)}
                </div>

                <div className="searchResultDate">
                  {formatDate(ev.startAt)} - {formatDate(ev.endAt)}
                </div>

                <div className="searchResultMemo">
                  {highlightText(buildExcerpt(ev.memo, query, 80), query)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 補助関数 ---------- */

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

function truncate(text = "", len) {
  if (text.length <= len) return text;
  return text.slice(0, len) + "...";
}

function highlight(text = "", query = "") {
  if (!query) return text;

  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <span className="searchHighlight">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}