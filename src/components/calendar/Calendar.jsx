import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./App.css";

function App() {
  
  return (
    <div className="app-container">
      
      {/* カレンダー領域 */}
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

export default App;