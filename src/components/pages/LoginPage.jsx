import AuthLayout from "../Login/AuthLayout";
import AuthCard from "../Login/AuthCard";
import AuthTitle from "../Login/AuthTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ★追加
import styles from "../Login/styles/LoginPage.module.css";
import UsernameInput from "../Login/UsernameInput";
import PasswordInput from "../Login/PasswordInput";
import LoginButton from "../Login/LoginButton";
import NewAccountButton from "../Login/NewAccountButton";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // ★追加
  const [isLoading, setIsLoading] = useState(false);    // ★任意（押し連打防止）
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // ★追加

  const handleLogin = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text(); // ★バックエンドがStringなので text()

      if (!res.ok) {
        setErrorMessage(text || "ログインに失敗しました");
        return;
      }
       setSuccessMessage("ログイン成功！3秒後に遷移します。");

       setTimeout(() => {
         navigate("/calendar");
       }, 3000);
    } catch (e) {
      setErrorMessage("通信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAccount = () => {
    navigate("/new-account"); // ★いまの想定ルート
  };

  return (
    <AuthLayout>
      <div className={styles.container}>
        <AuthTitle
          title="花谷APP"
          subtitle="～ 花谷の花谷による花谷の為のAPP ～"
        />

        <AuthCard>
          <div className={styles.loginForm}>
            <UsernameInput username={username} setUsername={setUsername} />
            <PasswordInput password={password} setPassword={setPassword} />

            {/* ★エラー表示（messageだけ） */}
            {errorMessage && (
              <p style={{ marginTop: 8, color: "crimson" }}>{errorMessage}</p>
            )}
            {successMessage && (
              <p style={{ marginTop: 8, color: "green" }}>{successMessage}</p>
            )}

            <div className={styles.actions}>
              <LoginButton onClick={handleLogin} disabled={isLoading} />
              <NewAccountButton onClick={handleNewAccount} disabled={isLoading} />
            </div>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>
  );
}