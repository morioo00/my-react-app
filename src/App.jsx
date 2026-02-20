import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      {/* 最初は/loginへ飛ばす */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/new-account" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 404用 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
