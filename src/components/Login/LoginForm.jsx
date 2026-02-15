import { useState } from "react";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import LoginButton from "./LoginButton";
import NewAccountButton from "./NewAccountButton";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("ログイン:", username, password);
  };

  const handleNewAccount = () => {
    console.log("新規作成クリック");
  };

return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,          // 入力欄どうしの間隔
      width: "100%",
      alignItems: "stretch",
    }}
  >
    <UsernameInput username={username} setUsername={setUsername} />
    <PasswordInput password={password} setPassword={setPassword} />

    {/* ボタンは縦並び。間隔を少し広めに */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 48,        // ← ここを増やすとボタン間が広がる（押し間違い防止）
        marginTop: 10,  // 入力欄とボタンの間を少し空ける
      }}
    >
      <LoginButton onClick={handleLogin} />
      <NewAccountButton onClick={handleNewAccount} />
    </div>
  </div>
);


}

export default LoginPage;
