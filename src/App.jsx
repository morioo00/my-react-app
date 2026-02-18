import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import CalendarPage from "./components/calendar/Calendar";

export default function App() {
  return (
    <Routes>
      {/* 最初は/loginへ飛ばす */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/calendar" element={<CalendarPage />} />

      {/* 404用 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
