import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import NewAccountPage from "./components/pages/NewAccountPage";
import Calendar from "./components/calendar/Calendar";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/new-account" element={<NewAccountPage />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}