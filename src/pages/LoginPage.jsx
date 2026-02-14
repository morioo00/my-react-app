import { useState } from "react";
import UsernameInput from "../components/Login/UsernameInput";
import PasswordInput from "../components/Login/PasswordInput";
import LoginButton from "../components/Login/LoginButton";
import NewAccountButton from "../components/Login/NewAccountButton";

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
    <div>
      <UsernameInput
        username={username}
        setUsername={setUsername}
      />

      <PasswordInput
        password={password}
        setPassword={setPassword}
      />

      <LoginButton onClick={handleLogin} />
      <NewAccountButton onClick={handleNewAccount} />
    </div>
  );
}

export default LoginPage;
