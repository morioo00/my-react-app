import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import LoginButton from "./LoginButton";
import NewAccountButton from "./NewAccountButton";
import { supabase } from "../../lib/supabaseClient";

// ここ追加: エラーメッセージ定数化（実務的な書き方）
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "invalid login credentials",
  INVALID_CREDENTIALS_CODE: "invalid_credentials",
  EMAIL_NOT_CONFIRMED: "email not confirmed",
  RATE_LIMIT: "rate limit",
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return; // 二重送信防止

    setLoading(true);
    setMessage("");

    try {
      const trimmedEmail = email.trim();

      // ここ追加: 入力チェック
      if (!trimmedEmail) {
        setMessage("メールアドレスを入力してください");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setMessage("正しいメールアドレスを入力してください");
        return;
      }

      if (!password.trim()) {
        setMessage("パスワードを入力してください");
        return;
      }

      // Supabaseログイン
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        console.log("supabase login error:", error);

        const msg = error?.message || "";
        const lowerMsg = msg.toLowerCase(); // ここ追加: 小文字化して比較

        console.log("error full:", error);
        console.log("msg:", msg);

        // ここ変更: 定数 + toLowerCaseで安全に判定
        if (
          lowerMsg.includes(ERROR_MESSAGES.INVALID_CREDENTIALS) ||
          lowerMsg.includes(ERROR_MESSAGES.INVALID_CREDENTIALS_CODE)
        ) {
          setMessage("メールアドレスまたはパスワードが正しくありません");
        } else if (
          lowerMsg.includes(ERROR_MESSAGES.EMAIL_NOT_CONFIRMED)
        ) {
          setMessage("メール確認が未完了です。確認メールをチェックしてください");
        } else if (
          lowerMsg.includes(ERROR_MESSAGES.RATE_LIMIT)
        ) {
          setMessage("リクエストが多すぎます。少し時間をおいて再度試してください。");
        } else {
          setMessage("ログインに失敗しました: " + msg);
        }

        return;
      }

      // ログイン成功
      if (data?.session) {
        setMessage("ログイン成功しました。画面を移動します。");

        setTimeout(() => {
          navigate("/calendar"); // 遷移先
        }, 1000);
      } else {
        setMessage("ログイン処理は完了しましたが、セッション取得を確認してください。");
      }

    } catch (e) {
      console.log("login unexpected error:", e);
      setMessage("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAccount = () => {
    navigate("/new-account");
  };

  return (
    <div>
      {/* 動作確認用（確認終わったら消してOK） */}
      <p>LoginForm動作確認中</p> {/* ここ追加 */}

      <EmailInput
        email={email}
        setEmail={setEmail}
      />

      <PasswordInput
        password={password}
        setPassword={setPassword}
      />

      <LoginButton
        onClick={handleLogin}
        disabled={loading}
      />

      <NewAccountButton
        onClick={handleNewAccount}
        disabled={loading}
      />

      {/* エラーメッセージ表示 */}
      {message && (
        <p style={{ marginTop: "8px", color: "crimson" }}> {/* ここ変更: 見た目合わせた */}
          {message}
        </p>
      )}
    </div>
  );
}