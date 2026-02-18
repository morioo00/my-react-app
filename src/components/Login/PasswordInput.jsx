import { useState } from "react";
import styles from "../../styles/Login/Input.module.css";

function PasswordInput({ password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
        className={`${styles.input} ${styles.passwordInput}`}
      />

      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        className={styles.toggle}
      >
        👁
      </button>
    </div>
  );
}

export default PasswordInput;
