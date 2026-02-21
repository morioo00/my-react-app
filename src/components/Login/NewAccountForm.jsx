import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import CreateAccountButton from "./CreateAccountButton";

export default function NewAccountForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    console.log("handleRegister fired", { username, password }); // ←これ追加
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

      // 1秒後にログイン画面へ（ルートに合わせて変更してOK）
      setTimeout(() => {
        navigate("/login"); // もしログインが "/" なら navigate("/") にする
      }, 1000);
    } catch (err) {
      setMessage("サーバーに接続できません");
    }
  };

  return (
    <div>
      <UsernameInput username={username} setUsername={setUsername} />
      <PasswordInput password={password} setPassword={setPassword} />

      <div className="button-group">
        <CreateAccountButton onClick={handleRegister} />

        <button onClick={() => navigate("/login")}>
          戻る
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}