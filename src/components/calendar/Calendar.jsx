import {useMemo, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";

// "YYYY-MM-DD" + "HH:MM" を Date にする（ローカル時間）
function toDate(dateStr, timeStr) {
  // timeStr が空なら 00:00 扱い
  const t = timeStr?.trim() ? timeStr.trim() : "00:00";
  return new Date(`${dateStr}T${t}:00`);
}

export default function CalendarPage() {
 const [open,setOpen] = useState(false);
 const [selectedDate,setSelectedDate] = useState("");

 // フォーム項目
 const [title, setTitle] = useState("");
 const [memo, setMemo] = useState("")
 const [startTime, setStartTime] = useState("09:00");
 const [endTime, setEndTime] = useState("10:00");

 //　通知
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

    // アンケート式にする/しない
  const [isSurvey, setIsSurvey] = useState(false);

  // 締切日時
  const [deadlineDate, setDeadlineDate] = useState(""); // "YYYY-MM-DD"
  const [deadlineTime, setDeadlineTime] = useState("23:59");

  // FullCalendar 表示用
  const [events, setEvents] = useState([]);

  const openModalForDate = (dateStr) => {
    setSelectedDate(dateStr);

    // 初期値
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
    openModalForDate(info.datestr);
  };
  const handleSave = () => {
    if (!title.trim()) return;
    // start/endをDate化
    const start = toDate(selectedDate,startTime);
    const end = toDate(selectedDate, endTime);
  }
  // endがstartよりも前の場合弾く
  if (end <= start) {
    alert("終了時間は開始時間より後にしてください");
    return;
  }
}
  setEvents((prev) => [
    ...prev,
    {
      title:title.trim(),
      start,
      end,
      // 追加情報はextendedPropsに入れる
      extendedProps: {
        memo,
        reminder,
        isSurvey,
        deadline:
        isSurvey && deadlineDate
           ? toDate(deadlineDate,deadlineTime).toISOString()
           : null,
      },
    },
  ]);
export default function Calendar() {
   return (
    <div className="app-container">
      <div className="calendar-area">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="100%"
          expandRows={true}
        />
      </div>
    </div>
  );
}