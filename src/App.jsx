import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import NewAccountPage from "./components/pages/NewAccountPage";

export default function App() {
  return (
    <Routes>
      {/* 最初は/loginへ飛ばす */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/new-account" element={<NewAccountPage />} />

      {/* 404用 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}