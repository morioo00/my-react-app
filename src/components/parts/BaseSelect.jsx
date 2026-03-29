export default function BaseSelect({
  value,
  onChange,
  options = [],
  className = "select",
}) {
  return (
    <select
      className={className}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}