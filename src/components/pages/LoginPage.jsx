import AuthLayout from "../Login/AuthLayout";
import AuthCard from "../Login/AuthCard";
import AuthTitle from "../Login/AuthTitle";
import { useState } from "react";
import styles from "../Login/styles/LoginPage.module.css";
import UsernameInput from "../Login/UsernameInput";
import PasswordInput from "../Login/PasswordInput";
import LoginButton from "../Login/LoginButton";
import NewAccountButton from "../Login/NewAccountButton";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("ログイン:", username, password);
  };

  const handleNewAccount = () => {
    console.log("新規作成クリック");
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

            <div className={styles.actions}>
              <LoginButton onClick={handleLogin} />
              <NewAccountButton onClick={handleNewAccount} />
            </div>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>

  );
}
