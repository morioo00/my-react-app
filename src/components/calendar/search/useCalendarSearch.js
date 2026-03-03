import { useCallback, useState } from "react";

export default function useCalendarSearch(searcher) {
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [results, setResults] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onCommitSearch = useCallback(async () => {
    const q = searchText.trim();
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searcher(q);

      // 開始日時昇順
      const sorted = [...data].sort((a, b) => new Date(b.start) - new Date(a.start)
      );

      setResults(sorted);
      setSearchModalOpen(true);
      setSearchOpen(false);
    } catch (e) {
      setError("検索に失敗しました");
      setResults([]);
      setSearchModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, [searchText, searcher]);

  const onClearSearch = useCallback(() => {
    setSearchText("");
    setResults([]);
    setError(null);
    setLoading(false);
    setSearchModalOpen(false);
  }, []);

  const onToggleSearchOpen = useCallback(() => {
    setSearchOpen((v) => !v);
  }, []);

  const closeResultModal = useCallback(() => {
    setSearchModalOpen(false);
  }, []);

  const closeDetailModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const closeAll = useCallback(() => {
  setSelectedEvent(null);
  setSearchModalOpen(false);
  setSearchText("");
  setError(null);
  setLoading(false);
}, []);

  return {
    searchText,
    setSearchText,
    searchOpen,
    onToggleSearchOpen,

    results,
    loading,
    error,
    searchModalOpen,
    selectedEvent,

    onCommitSearch,
    onClearSearch,
    closeResultModal,
    setSelectedEvent,
    closeDetailModal,

    closeAll,
    
  };
}