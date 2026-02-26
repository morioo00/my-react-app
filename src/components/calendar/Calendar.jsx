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
  const [editingEventId, setEditingEventId] = useState(null);

  const [creator, setCreator] = useState("");
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

  // ===== 新規作成 =====
  const openModalForDate = (dateStr) => {
    setEditingEventId(null);
    setSelectedDate(dateStr);

    setCreator("");
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

  // ===== 編集 =====
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;

    setEditingEventId(event.id);
    setSelectedDate(event.startStr.slice(0, 10));
    setCreator(event.extendedProps.creator || "");
    setTitle(event.title);
    setMemo(event.extendedProps.memo || "");
    setStartTime(event.startStr.slice(11, 16));
    setEndTime(event.endStr?.slice(11, 16) || "10:00");
    setReminder(event.extendedProps.reminder || "none");
    setIsSurvey(event.extendedProps.isSurvey || false);

    if (event.extendedProps.deadline) {
      const d = new Date(event.extendedProps.deadline);
      setDeadlineDate(d.toISOString().slice(0, 10));
      setDeadlineTime(d.toTimeString().slice(0, 5));
    }

    setOpen(true);
  };

  // ===== 保存 =====
  const handleSave = () => {
    if (!title.trim()) return;

    const start = toDate(selectedDate, startTime);
    const end = toDate(selectedDate, endTime);

    if (end <= start) {
      alert("終了時間は開始時間より後にしてください");
      return;
    }

    if (editingEventId) {
      // 更新
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEventId
            ? {
                ...e,
                title: title.trim(),
                start,
                end,
                extendedProps: {
                  creator,
                  memo,
                  reminder,
                  isSurvey,
                  deadline:
                    isSurvey && deadlineDate
                      ? toDate(deadlineDate, deadlineTime).toISOString()
                      : null,
                },
              }
            : e
        )
      );
    } else {
      // 新規
      setEvents((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          title: title.trim(),
          start,
          end,
          extendedProps: {
            creator,
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
    }

    setOpen(false);
  };

  return (
    <div className="app-container">
      {/* ===== モーダル ===== */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>
              {editingEventId ? "予定編集" : `${selectedDate} の予定追加`}
            </h3>

            {/* 作成者 */}
            <div>
              <label>作成者</label>
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
              />
            </div>

            {/* タイトル */}
            <div>
              <label>タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* メモ */}
            <div>
              <label>内容メモ</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows="3"
              />
            </div>

            {/* 時間 */}
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

            {/* 通知 */}
            <div>
              <label>通知</label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
              >
                {reminderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* アンケート */}
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isSurvey}
                  onChange={(e) => setIsSurvey(e.target.checked)}
                />
                アンケート
              </label>
            </div>

            {isSurvey && (
              <div>
                <label>回答締切</label>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                />
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                />
              </div>
            )}

            <div style={{ marginTop: "15px" }}>
              <button onClick={handleSave}>
                {editingEventId ? "更新" : "保存"}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{ marginLeft: "10px" }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== カレンダー ===== */}
      <div className="calendar-area">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          expandRows={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          eventContent={(arg) => {
            const creator = arg.event.extendedProps.creator;
            return (
              <div>
                {creator && (
                  <div style={{ fontSize: "10px", fontWeight: "bold" }}>
                    {creator}
                  </div>
                )}
                <div>{arg.event.title}</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}