export default function BaseButton({
  type = "button",
  onClick,
  children,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}