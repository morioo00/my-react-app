import CalendarView from "../components/calendar/calendarView"
import { useCalendar } from "../components/calendar/useCalendar"

function CalendarPage() {
  const { selectedDate, handleDateClick } = useCalendar()
  const [editingEvent, setEditingEvent] = useState(null);

  return (
    <>
      <h2>選択日: {selectedDate}</h2>
      <CalendarView onDateClick={handleDateClick} />
    </>
  )
}

export default CalendarPage