import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import CreateAccountButton from "./CreateAccountButton";
import styles from "./styles/LoginPage.module.css"; // ここは実際の場所に合わせて

export default function NewAccountForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (loading) return;           // ✅ 二重発火防止
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        // 409なら分かりやすく
        if (res.status === 409) {
          setMessage("そのユーザー名は既に使われています");
        } else {
          setMessage(text || "登録に失敗しました");
        }
        return;
      }

      setMessage("登録完了！ログイン画面へ移動します。");
      setTimeout(() => navigate("/login"), 1000);
    } catch (e) {
      // ✅ 失敗理由を特定するためログ出し（重要）
      console.log("register fetch error:", e);
      setMessage("サーバーに接続できません");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginForm}>
      <UsernameInput username={username} setUsername={setUsername} />
      <PasswordInput password={password} setPassword={setPassword} />

      <div className={styles.actions}>
        <CreateAccountButton onClick={handleRegister} disabled={loading} />
        <button type="button" onClick={() => navigate("/login")} disabled={loading}>
          戻る
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}