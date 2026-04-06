import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import NewAccountPage from "./components/pages/NewAccountPage";
import Calendar from "./components/calendar/Calendar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/new-account" element={<NewAccountPage />} />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute> {/* 未ログイン時にログイン画面に */}
            <Calendar />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}