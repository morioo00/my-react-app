import SearchHeader from "../../SearchHeader/SearchHeader";
import SearchResultModal from "./SearchResultModal";
import EventDetailModal from "./EventDetailModal";
import useCalendarSearch from "./useCalendarSearch";

export default function CalendarSearchPanel({
  title = "Calendar",
  rightControls,
  searcher,
}) {
  const search = useCalendarSearch(searcher);

  const detailOpen = !!search.selectedEvent;

  return (
    <>
      <SearchHeader
        title={title}
        searchText={search.searchText}
        onChangeSearchText={search.setSearchText}
        onCommitSearch={search.onCommitSearch}
        onClearSearch={search.onClearSearch}
        rightControls={rightControls}
        searchOpen={search.searchOpen}
        onToggleSearchOpen={search.onToggleSearchOpen}
      />

      {/* 詳細表示中は一覧モーダルを一旦隠す（閉じない） */}
      <SearchResultModal
        open={search.searchModalOpen && !detailOpen}
        loading={search.loading}
        error={search.error}
        query={search.searchText}
        results={search.results}
        onClose={search.closeResultModal}
        onSelect={(ev) => {
          search.setSelectedEvent(ev); // ← これだけ
        }}
      />

      <EventDetailModal
        open={detailOpen}
        event={search.selectedEvent}
        onBack={search.closeDetailModal}
        onCloseAll={search.closeAll}
      />
    </>
  );
}