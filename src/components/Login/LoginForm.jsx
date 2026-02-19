import { useState } from "react";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import LoginButton from "./LoginButton";
import NewAccountButton from "./NewAccountButton";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("ログイン:", username, password);
  };

  const handleNewAccount = () => {
    console.log("新規作成クリック");
  };

  return (
    <div>
      <UsernameInput username={username} setUsername={setUsername} />
      <PasswordInput password={password} setPassword={setPassword} />

      <LoginButton onClick={handleLogin} />
      <NewAccountButton onClick={handleNewAccount} />
    </div>
  );
}
