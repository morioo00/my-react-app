export default function BaseInput({
  value,
  onChange,
  className = "input",
  type = "text",
  placeholder = "",
}) {
  return (
    <input
      type={type}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}