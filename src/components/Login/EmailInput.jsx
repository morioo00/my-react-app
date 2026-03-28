import styles from "./styles/Input.module.css";

function EmailInput({ email, setEmail }) {
  return (
    <div className={styles.wrapper}>
      <input
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス" 
        className={styles.input}
        autoComplete="email" 
      />
    </div>
  );
}

export default EmailInput;