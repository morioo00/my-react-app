import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ここ追加

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import LoginButton from "./LoginButton";
import NewAccountButton from "./NewAccountButton";
import { supabase } from "../../lib/supabaseClient"; // ここ追加

export default function LoginForm() {
  const [email, setEmail] = useState(""); // ここ変更
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ここ追加
  const [loading, setLoading] = useState(false); // ここ追加

  const navigate = useNavigate(); // ここ追加

  const handleLogin = async () => {
    if (loading) return; // ここ追加: 二重送信防止
    setLoading(true);
    setMessage("");

    try {
      const trimmedEmail = email.trim(); // ここ追加

      // ここ追加: 入力チェック
      if (!trimmedEmail) {
        setMessage("メールアドレスを入力してください");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ここ追加
      if (!emailRegex.test(trimmedEmail)) {
        setMessage("正しいメールアドレスを入力してください");
        return;
      }

      if (!password.trim()) {
        setMessage("パスワードを入力してください");
        return;
      }

      // ここ変更: Supabaseでログイン
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        console.log("supabase login error:", error);

        const msg = error.message || "";

        // ここ追加: よくあるエラーを分かりやすく表示
        if (
          msg.includes("Invalid login credentials") ||
          msg.includes("invalid_credentials")
        ) {
          setMessage("メールアドレスまたはパスワードが正しくありません");
        } else if (msg.includes("Email not confirmed")) {
          setMessage("メール確認が未完了です。確認メールをチェックしてください");
        } else if (msg.includes("rate limit")) {
          setMessage("リクエストが多すぎます。少し時間をおいて再度試してください。");
        } else {
          setMessage("ログインに失敗しました: " + msg);
        }

        return;
      }

      // ここ追加: ログイン成功確認
      if (data?.session) {
        setMessage("ログイン成功しました。画面を移動します。");

        // ここ変更:
        // ログイン後に表示したい画面へ遷移
        // いまは仮でトップへ戻す
        setTimeout(() => navigate("/calendar"), 1000);
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
    navigate("/new-account"); // ここ変更: 実際の新規作成画面のパスに合わせる
  };

  return (
    <div>
      <EmailInput
        email={email} // ここ変更
        setEmail={setEmail} // ここ変更
      />
      <PasswordInput password={password} setPassword={setPassword} />

      <LoginButton onClick={handleLogin} disabled={loading} />
      <NewAccountButton onClick={handleNewAccount} disabled={loading} />

      {message && <p>{message}</p>} {/* ここ追加 */}
    </div>
  );
}