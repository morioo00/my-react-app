export default function AuthTitle({
  title = "My App",
  subtitle,
  color = "#111827",
}) {
  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: color,
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            marginTop: 6,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

