import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";
import CalendarSearchHeader from "../CalendarSearchHeader/CalendarSearchHeader";

function toDate(dateStr, timeStr) {
  const t = timeStr?.trim() ? timeStr.trim() : "00:00";
  return new Date(`${dateStr}T${t}:00`);
}

export default function CalendarPage() {
  const calendarRef = useRef(null);

  const [viewTitle, setViewTitle] = useState(""); // 例: February 2026
  const calApi = () => calendarRef.current?.getApi();
  const goToday = () => calApi()?.today();
  const goPrev = () => calApi()?.prev();
  const goNext = () => calApi()?.next();

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const reminderOptions = useMemo(
    () => [
      { value: "none", label: "なし" },
      { value: "5m", label: "5分前" },
      { value: "10m", label: "10分前" },
      { value: "30m", label: "30分前" },
      { value: "60m", label: "1時間前" },
    ],
    []
  );
  const [reminder, setReminder] = useState("none");

  const [isSurvey, setIsSurvey] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("23:59");

  const [events, setEvents] = useState([]);


  const [q, setQ] = useState("");
  const [searchText, setSearchText] = useState("");

  const commitSearch = () => setQ(searchText.trim());
  const clearSearch = () => {
  setSearchText("");
  setQ("");
};

  // 📱 スマホで検索欄を開閉
  const [searchOpen, setSearchOpen] = useState(false);

  const openModalForDate = (dateStr) => {
    setSelectedDate(dateStr);

    setTitle("");
    setMemo("");
    setStartTime("09:00");
    setEndTime("10:00");
    setReminder("none");
    setIsSurvey(false);
    setDeadlineDate(dateStr);
    setDeadlineTime("23:59");

    setOpen(true);
  };

  const handleDateClick = (info) => {
    openModalForDate(info.dateStr);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const start = toDate(selectedDate, startTime);
    const end = toDate(selectedDate, endTime);

    if (end <= start) {
      alert("終了時間は開始時間より後にしてください");
      return;
    }

    setEvents((prev) => [
      ...prev,
      {
        title: title.trim(),
        start,
        end,
        extendedProps: {
          memo,
          reminder,
          isSurvey,
          deadline:
            isSurvey && deadlineDate
              ? toDate(deadlineDate, deadlineTime).toISOString()
              : null,
        },
      },
    ]);

    setOpen(false);
  };

  return (
  <div className="app-container">
    <div className="calendar-area">
      <CalendarSearchHeader
        title={viewTitle || "Calendar"}
        searchText={searchText}
        onChangeSearchText={setSearchText}
        onCommitSearch={commitSearch}
        onClearSearch={clearSearch}
        searchOpen={searchOpen}
        onToggleSearchOpen={() => setSearchOpen((v) => !v)}
        rightControls={
          <>
            <button className="calBtn" type="button" onClick={goToday}>
              today
            </button>
            <button className="calBtn" type="button" onClick={goPrev}>
              ‹
            </button>
            <button className="calBtn" type="button" onClick={goNext}>
              ›
            </button>
          </>
        }
      />

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="100%"
        expandRows={true}
        headerToolbar={false}
        datesSet={(arg) => setViewTitle(arg.view.title)}
        dateClick={handleDateClick}
        events={events}
      />

      {/* modal JSX がここに続く */}
    </div>
  </div>
);
}