import { useState } from "react";
import styles from "./styles/Input.module.css";


export default function PasswordInput({ password, setPassword }) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.passwordWrapper}>
      <input
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
        placeholder="パスワード"
      />

      <button
        type="button"
        className={styles.eyeButton}
        onClick={() => setShow(!show)}
      >
        👁
      </button>
    </div>
  );
}
