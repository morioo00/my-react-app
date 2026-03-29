import styles from "./styles/Input.module.css";

function UsernameInput({ username, setUsername }) {
  return (
    <div className={styles.wrapper}>
      <input
        type="email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="メールアドレス"
        className={styles.input}
        autoComplete="email"
      />
    </div>
  );
}

export default UsernameInput;
