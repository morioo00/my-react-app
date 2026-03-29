export default function BaseTimeInput({
  value,
  onChange,
  min,
  step = 300,
  className = "input",
}) {
  return (
    <input
      type="time"
      className={className}
      step={step}
      min={min}
      value={value}
      onChange={onChange}
    />
  );
}