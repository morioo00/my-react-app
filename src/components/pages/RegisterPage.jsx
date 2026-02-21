import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../Login/AuthLayout";
import AuthCard from "../Login/AuthCard";
import AuthTitle from "../Login/AuthTitle";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        setMessage("登録に失敗しました");
        return;
      }

      setMessage(text);

      // 1秒後にログイン画面へ戻す
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      setMessage("サーバーに接続できません");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthTitle
          title="花谷APP"
          subtitle="～ 花谷の花谷による花谷の為のAPP ～"
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
          <input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleRegister}>
            登録する
          </button>

          {message && <p>{message}</p>}
        </div>

      </AuthCard>
    </AuthLayout>
  );
}