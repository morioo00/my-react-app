import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";

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