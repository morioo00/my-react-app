import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import CreateAccountButton from "./CreateAccountButton";
import { supabase } from "../../lib/supabaseClient";
import styles from "./styles/LoginPage.module.css";

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
      const trimmedEmail = email.trim(); 

      // 入力チェック
      if (!trimmedEmail) {
        setMessage("メールアドレスを入力してください");
        return;
      }

      // メール形式チェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setMessage("正しいメールアドレスを入力してください");
        return;
      }

      // パスワード未入力チェック
      if (!password.trim()) {
        setMessage("パスワードを入力してください");
        return;
      }

      // パスワード文字数チェック
      if (password.length < 4) {
        setMessage("パスワードは4文字以上で入力してください");
        return;
      }

      // Spring register ではなく Supabase Auth へ登録
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail, 
        password: password,
      });

      if (error) {
        console.log("supabase signUp error:", error);

        const msg = error.message || "";

        // よくあるエラーを分かりやすく表示
        if (msg.includes("rate limit")) {
          setMessage("リクエストが多すぎます。少し時間をおいてから再度試してください。");
        } else if (msg.includes("already registered")) {
          setMessage("このメールアドレスは既に登録されています");
        } else if (msg.includes("invalid email")) {
          setMessage("メールアドレスの形式が正しくありません");
        } else if (msg.includes("Password")) {
          setMessage("パスワードは4文字以上で入力してください");
        } else {
          setMessage("登録に失敗しました: " + msg);
        }

        return;
      }

      //  成功時
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
      <PasswordInput password={password} setPassword={setPassword} />

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