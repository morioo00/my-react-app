import { useMemo, useState } from "react";
import "./Calendar.css";
import CalendarView from "./parts/CalendarView";
import EventModal from "./parts/EventModal";
import { toDate } from "./utils/date";

export default function CalendarPage() {
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
      <CalendarView events={events} onDateClick={handleDateClick} />

      <EventModal
        open={open}
        selectedDate={selectedDate}
        title={title}
        memo={memo}
        startTime={startTime}
        endTime={endTime}
        reminder={reminder}
        reminderOptions={reminderOptions}
        onClose={() => setOpen(false)}
        onChangeTitle={(e) => setTitle(e.target.value)}
        onChangeMemo={(e) => setMemo(e.target.value)}
        onChangeStartTime={(e) => setStartTime(e.target.value)}
        onChangeEndTime={(e) => setEndTime(e.target.value)}
        onChangeReminder={(e) => setReminder(e.target.value)}
        onSave={handleSave}
      />
    </div>
  );
}