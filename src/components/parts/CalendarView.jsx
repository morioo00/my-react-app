import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarView({ events, onDateClick }) {
  return (
    <div className="calendar-area">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="100%"
        expandRows={true}
        dateClick={onDateClick}
        events={events}
      />
    </div>
  );
}