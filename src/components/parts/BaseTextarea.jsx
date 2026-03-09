export default function BaseTextarea({
  value,
  onChange,
  rows = 2,
  className = "textarea",
  placeholder = "",
}) {
  return (
    <textarea
      className={className}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}