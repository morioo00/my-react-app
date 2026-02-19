import styles from "./styles/Input.module.css";

function UsernameInput({ username, setUsername }) {
  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ユーザー名"
        className={styles.input}
      />
    </div>
  );
}

export default UsernameInput;
