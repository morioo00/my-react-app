import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import CreateAccountButton from "./CreateAccountButton";
import { supabase } from "../../lib/supabaseClient";
import styles from "./styles/LoginPage.module.css";

// ここ追加: エラー判定文字列を定数化
const ERROR_MESSAGES = {
  RATE_LIMIT: "rate limit",
  ALREADY_REGISTERED: "already registered",
  INVALID_EMAIL_TEXT_1: "invalid email",
  INVALID_EMAIL_TEXT_2: "is invalid",
  PASSWORD_TEXT: "password",
};

export default function NewAccountForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);
    setMessage("");

    try {
      const trimmedEmail = email.trim().toLowerCase(); // ここ変更: trim + 小文字化

      // ここ既存: 入力チェック
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

      if (password.length < 4) {
        setMessage("パスワードは4文字以上で入力してください");
        return;
      }

      // ここ既存: Supabase Auth へ登録
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        console.log("supabase signUp error full:", error); // ここ追加

        const msg = error?.message || "";
        const code = error?.code || "";
        const lowerMsg = msg.toLowerCase();
        const lowerCode = code.toLowerCase();

        // ここ変更: 実際の返却文に合わせて判定
        if (lowerMsg.includes(ERROR_MESSAGES.RATE_LIMIT)) {
          setMessage("リクエストが多すぎます。少し時間をおいてから再度試してください。");
        } else if (lowerMsg.includes(ERROR_MESSAGES.ALREADY_REGISTERED)) {
          setMessage("このメールアドレスは既に登録されています");
        } else if (
          lowerMsg.includes(ERROR_MESSAGES.INVALID_EMAIL_TEXT_1) ||
          lowerMsg.includes(ERROR_MESSAGES.INVALID_EMAIL_TEXT_2) ||
          lowerCode.includes("email")
        ) {
          setMessage("メールアドレスが Supabase 側で無効と判定されました。別の実在するメールアドレスで試してください。");
        } else if (lowerMsg.includes(ERROR_MESSAGES.PASSWORD_TEXT)) {
          setMessage("パスワード条件を満たしていません。設定を見直してください。");
        } else {
          setMessage("登録に失敗しました: " + msg);
        }

        return;
      }

      if (data?.user) {
        setMessage("登録が完了しました。3秒後にログイン画面へ移動します。");
      } else {
        setMessage("登録処理が完了しました。3秒後にログイン画面へ移動します。");
      }

      setTimeout(() => navigate("/login"), 3000);
    } catch (e) {
      console.log("register unexpected error:", e);
      setMessage("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginForm}>
      <EmailInput
        email={email}
        setEmail={setEmail}
      />

      <PasswordInput
        password={password}
        setPassword={setPassword}
      />

      <div className={styles.actions}>
        <CreateAccountButton onClick={handleRegister} disabled={loading} />
        <button
          type="button"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          戻る
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}