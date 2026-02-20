import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import NewAccountPage from "./components/pages/NewAccountPage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/new-account" element={<NewAccountPage />} />
    </Routes>
  );
}

