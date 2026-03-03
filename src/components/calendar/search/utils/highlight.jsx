import React from "react";

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ✅ 名前付きexport（これが重要）
export function highlightText(text, query, className = "hl") {
  if (text == null) return "";
  const q = query?.trim();
  if (!q) return String(text);

  const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
  const parts = String(text).split(re);

  return parts.map((part, i) => {
    const isHit = part.toLowerCase() === q.toLowerCase();
    return isHit ? (
      <mark key={i} className={className}>
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    );
  });
}