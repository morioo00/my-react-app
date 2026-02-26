import "./CalendarSearchHeader.css";

export default function CalendarSearchHeader({
  title = "Calendar",
  searchText,
  onChangeSearchText,
  onCommitSearch,
  onClearSearch,
  rightControls,
  searchOpen,
  onToggleSearchOpen,
}) {
  return (
    <div className="calHeader">
      <div className="calTitle">{title}</div>

      {/* PC用検索 */}
      <div className="calSearch">
        <input
          className="calSearchInput"
          value={searchText}
          onChange={(e) => onChangeSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommitSearch();
            if (e.key === "Escape") onClearSearch();
          }}
          placeholder="検索（例：会議）"
        />
        <button className="calSearchBtn" type="button" onClick={onCommitSearch}>
          🔍
        </button>
      </div>

      {/* 右ボタン */}
      <div className="calControls">
        {rightControls}

        {/* スマホ用：虫眼鏡 */}
        <button
          className="calIconBtn"
          type="button"
          aria-label="検索を開く"
          onClick={onToggleSearchOpen}
        >
          🔍
        </button>
      </div>

      {/* スマホ用：展開検索 */}
      {searchOpen && (
        <div className="calSearchMobile">
          <input
            className="calSearchMobileInput"
            value={searchText}
            onChange={(e) => onChangeSearchText(e.target.value)}
            placeholder="検索（例：会議）"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") onCommitSearch();
            }}
          />
          <button
            className="calSearchMobileClose"
            type="button"
            onClick={onToggleSearchOpen}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}