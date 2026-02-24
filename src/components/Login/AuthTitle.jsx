import styles from "./styles/AuthTitle.module.css";


export default function AuthTitle({
  title = "My App",
  subtitle,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        {title}
      </div>

      {subtitle ? (
        <div className={styles.subtitle}>
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
