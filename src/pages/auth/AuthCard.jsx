export default function AuthCard({ children }) {
  return (
    <div
      style={{
        width: "min(720px, 100%)",  // PCで最大720px、スマホは100%
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}
