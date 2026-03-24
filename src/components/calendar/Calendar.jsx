import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";
import CalendarSearchPanel from "./search/CalendarSearchPanel";
import apiSearcher from "./search/searchers/apiSearcher";
import authFetch from "../auth/authFetch";

function toDate(dateStr, timeStr) {
  const t = timeStr?.trim() ? timeStr.trim() : "00:00";
  return new Date(`${dateStr}T${t}:00`);
}

export default function Calendar() {

  const calendarRef = useRef(null);

  const [viewTitle, setViewTitle] = useState("");
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);

  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const calApi = () => calendarRef.current?.getApi();

  const goToday = () => calApi()?.today();
  const goPrev = () => calApi()?.prev();
  const goNext = () => calApi()?.next();

  const pad = (n) => String(n).padStart(2, "0");

  const toLocalIsoSec = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  // ----------------------------
  // イベント取得
  // ----------------------------
  const fetchEventsRange = async (startDate, endDate) => {

    const fromISO = toLocalIsoSec(startDate);
    const toISO = toLocalIsoSec(endDate);

    const res = await authFetch(
      `/api/events?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(
        toISO
      )}`
    );

    if (!res.ok) throw new Error("イベント取得失敗");

    const dtos = await res.json();

    const mapped = dtos.map((dto) => ({
      id: String(dto.id),
      title: dto.title,
      start: dto.startAt,
      end: dto.endAt,
      extendedProps: {
        creator: dto.authorUsername,
        memo: dto.memo,
      },
    }));

    setEvents(mapped);
  };

  const handleDatesSet = async (arg) => {
    setViewTitle(arg.view.title);
    await fetchEventsRange(arg.start, arg.end);
  };

  // ----------------------------
  // 日付クリック → 新規作成
  // ----------------------------
  const handleDateClick = (info) => {

    setEditingEventId(null);
    setSelectedDate(info.dateStr);

    setTitle("");
    setMemo("");

    setStartTime("09:00");
    setEndTime("10:00");

    setOpen(true);
  };

  // ----------------------------
  // イベントクリック → 編集
  // ----------------------------
  const handleEventClick = (clickInfo) => {

    const event = clickInfo.event;

    setEditingEventId(event.id);
    setSelectedDate(event.startStr.slice(0, 10));

    setTitle(event.title);
    setMemo(event.extendedProps.memo || "");

    setStartTime(event.startStr.slice(11, 16));
    setEndTime(event.endStr?.slice(11, 16) || "10:00");

    setOpen(true);
  };

  // ----------------------------
  // 保存（作成 or 更新）
  // ----------------------------
  const handleSave = async () => {

    if (!title.trim()) return;

    const start = toDate(selectedDate, startTime);
    const end = toDate(selectedDate, endTime);

    if (end <= start) {
      alert("終了時間は開始時間より後にしてください");
      return;
    }

    const toLocalIso = (d) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    const payload = {
      title: title.trim(),
      memo: memo ?? "",
      startAt: toLocalIso(start),
      endAt: toLocalIso(end),
    };

    try {

      // ----------------------------
      // 更新
      // ----------------------------
      if (editingEventId) {

        const res = await authFetch(`/api/events/${editingEventId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("update failed");

        const updated = await res.json();

        const updatedEvent = {
          id: String(updated.id),
          title: updated.title,
          start: updated.startAt,
          end: updated.endAt,
          extendedProps: {
            creator: updated.authorUsername,
            memo: updated.memo,
          },
        };

        setEvents((prev) =>
          prev.map((e) => (e.id === editingEventId ? updatedEvent : e))
        );

      } else {

        // ----------------------------
        // 新規作成
        // ----------------------------
        const res = await authFetch(`/api/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("create failed");

        const saved = await res.json();

        const newEvent = {
          id: String(saved.id),
          title: saved.title,
          start: saved.startAt,
          end: saved.endAt,
          extendedProps: {
            creator: saved.authorUsername,
            memo: saved.memo,
          },
        };

        setEvents((prev) => [...prev, newEvent]);
      }

      setOpen(false);

    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    }
  };

  // ----------------------------
  // 削除
  // ----------------------------
  const handleDelete = async () => {

    if (!editingEventId) return;

    if (!confirm("この予定を削除しますか？")) return;

    try {

      const res = await authFetch(`/api/events/${editingEventId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("delete failed");

      setEvents((prev) => prev.filter((e) => e.id !== editingEventId));

      setOpen(false);

    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  };

  // ----------------------------
  // 表示イベント
  // ----------------------------
  const viewEvents = useMemo(() => {
    return events;
  }, [events]);

  return (
    <div className="app-container">

      <div className="calendar-area">

        <CalendarSearchPanel
          title={viewTitle || "Calendar"}
          rightControls={
            <>
              <button onClick={goToday}>today</button>
              <button onClick={goPrev}>‹</button>
              <button onClick={goNext}>›</button>
            </>
          }
          searcher={apiSearcher}
        />

        {open && (
          <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>

              <h3>{editingEventId ? "予定編集" : `${selectedDate} の予定追加`}</h3>

              <div>
                <label>タイトル</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label>内容メモ</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>

              <div>
                <label>開始時間</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label>終了時間</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <button onClick={handleSave}>
                {editingEventId ? "更新" : "保存"}
              </button>

              {editingEventId && (
                <button
                  onClick={handleDelete}
                  style={{ marginLeft: "10px", background: "#e74c3c", color: "white" }}
                >
                  削除
                </button>
              )}

              <button
                onClick={() => setOpen(false)}
                style={{ marginLeft: "10px" }}
              >
                キャンセル
              </button>

            </div>
          </div>
        )}

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          headerToolbar={false}
          datesSet={handleDatesSet}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={viewEvents}
        />

      </div>
    </div>
  );
}