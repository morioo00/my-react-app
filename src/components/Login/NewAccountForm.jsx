import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import CreateAccountButton from "./CreateAccountButton";
import styles from "../Login/styles/LoginPage.module.css";

export default function NewAccountForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        setMessage("登録に失敗しました");
        return;
      }

      setMessage(text);

      setTimeout(() => navigate("/login"), 1000);
    } catch {
      setMessage("サーバーに接続できません");
    }
  };

  return (
    <div className={styles.loginForm}>
      <UsernameInput username={username} setUsername={setUsername} />
      <PasswordInput password={password} setPassword={setPassword} />

      <div className={styles.actions}>
        <CreateAccountButton onClick={handleRegister} />
        <button onClick={() => navigate("/login")}>戻る</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}