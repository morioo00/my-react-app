
import styles from "./styles/AuthLayout.module.css";


export default function AuthLayout({ children }) {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  );
}

