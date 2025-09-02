export function Select({ value, onChange, options }) {
  return (
    <select
      className="border rounded px-3 py-2 w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
