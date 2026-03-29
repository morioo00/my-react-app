import AuthLayout from "../Login/AuthLayout";
import AuthCard from "../Login/AuthCard";
import AuthTitle from "../Login/AuthTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Login/styles/LoginPage.module.css";
import UsernameInput from "../Login/UsernameInput";
import PasswordInput from "../Login/PasswordInput";
import LoginButton from "../Login/LoginButton";
import NewAccountButton from "../Login/NewAccountButton";
import { saveToken } from "../auth/tokenStorage";
import { supabase } from "../../lib/supabaseClient";

// ここ追加: Supabaseのエラー文言を定数化
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "invalid login credentials",
  INVALID_CREDENTIALS_CODE: "invalid_credentials",
  EMAIL_NOT_CONFIRMED: "email not confirmed",
  RATE_LIMIT: "rate limit",
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isLoading) return; // ここ追加: 二重送信防止

    setErrorMessage("");
    setSuccessMessage(""); // ここ追加: 前回成功文をクリア
    setIsLoading(true);

    try {
      const trimmedEmail = username.trim(); // ここ追加: 実際はemailとして使う

      // ここ追加: 入力チェック
      if (!trimmedEmail) {
        setErrorMessage("メールアドレスを入力してください");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setErrorMessage("正しいメールアドレスを入力してください");
        return;
      }

      if (!password.trim()) {
        setErrorMessage("パスワードを入力してください");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail, // ここ変更: username をそのまま使わず trim後の値を使う
        password,
      });

      if (error) {
        console.log("supabase login error:", error); // ここ追加

        const msg = error?.message || "";
        const code = error?.code || "";
        const lowerMsg = msg.toLowerCase();
        const lowerCode = code.toLowerCase();

        // ここ変更: 英語エラーを日本語へ変換
        if (
          lowerMsg.includes(ERROR_MESSAGES.INVALID_CREDENTIALS) ||
          lowerMsg.includes(ERROR_MESSAGES.INVALID_CREDENTIALS_CODE) ||
          lowerCode.includes(ERROR_MESSAGES.INVALID_CREDENTIALS_CODE)
        ) {
          setErrorMessage("メールアドレスまたはパスワードが正しくありません");
        } else if (
          lowerMsg.includes(ERROR_MESSAGES.EMAIL_NOT_CONFIRMED)
        ) {
          setErrorMessage("メール確認が未完了です。確認メールをチェックしてください");
        } else if (
          lowerMsg.includes(ERROR_MESSAGES.RATE_LIMIT)
        ) {
          setErrorMessage("リクエストが多すぎます。少し時間をおいて再度試してください。");
        } else {
          setErrorMessage("ログインに失敗しました: " + msg);
        }

        return;
      }

      // ここ追加: sessionの存在チェックを安全にする
      const token = data?.session?.access_token;

      if (!token) {
        setErrorMessage("ログイン処理は完了しましたが、セッション取得に失敗しました");
        return;
      }

      saveToken(token);

      setSuccessMessage("ログイン成功！3秒後に遷移します。");

      setTimeout(() => {
        navigate("/calendar");
      }, 3000);

    } catch (e) {
      console.error("login unexpected error:", e); // ここ変更
      setErrorMessage("通信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAccount = () => {
    navigate("/new-account");
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
            <UsernameInput
              username={username}
              setUsername={setUsername}
            />

            <PasswordInput
              password={password}
              setPassword={setPassword}
            />

            {/* ここ変更: 日本語化されたエラーを表示 */}
            {errorMessage && (
              <p style={{ marginTop: 8, color: "crimson" }}>
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p style={{ marginTop: 8, color: "green" }}>
                {successMessage}
              </p>
            )}

            <div className={styles.actions}>
              <LoginButton
                onClick={handleLogin}
                disabled={isLoading}
              />

              <NewAccountButton
                onClick={handleNewAccount}
                disabled={isLoading}
              />
            </div>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>
  );
}