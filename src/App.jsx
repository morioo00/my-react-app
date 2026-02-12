import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function App() {
  
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* カレンダー領域 */}
      <div style={{ flex: 1, minHeight: 0, padding: 16 }}>
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
