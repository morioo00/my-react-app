import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";

function toDate(dateStr, timeStr) {
  const t = timeStr?.trim() ? timeStr.trim() : "00:00";
  return new Date(`${dateStr}T${t}:00`);
}

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
    // FullCalendarは dateStr
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
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          expandRows={true}
          dateClick={handleDateClick}
          events={events}
        />
      </div>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">投稿</h2> 
    
           <div className="modal-field">
            <div className="modal-label">日付</div>
            <div className="modal-value">{selectedDate}</div>
            </div>

           <div className="modal-field">
             <div className="modal-label">タイトル</div>
            <input
             className="input"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             />
             </div> 

           <div className="modal-field">
            <div className="modal-label">内容のメモ</div>
            <textarea
             className="textarea"
             rows={2}
             value={memo}
             onChange={(e) => (e.target.value)}
             />
            </div>

            <div className="modal-field">
             <div className="modal-label">時間</div>
             <input
              className="input"
              type="time"
              step={300}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
             /> 
             <span className="dash">～</span>
             <input 
              className="input"
              type="time"
              step={300}
              min={startTime}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
             />
            </div>

            <div className="modal-field">
              <div className="modal-label">通知</div>
              <select
               className="select"
               value={reminder}
               onChange={(e) => setReminder(e.target.value)}
               >
                {reminder

                }
            </div>

      )}
  </div>
  );
}
  