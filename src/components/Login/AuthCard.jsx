import styles from "../../styles/AuthCard.module.css";

export default function AuthCard({ children }) {
  return (
    <div className={styles.card}>
      {children}
    </div>
  );
}

