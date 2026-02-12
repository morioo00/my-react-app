export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#cacaca",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        overflow: "auto",
      }}
    >
      {children}
    </div>
  );
}
