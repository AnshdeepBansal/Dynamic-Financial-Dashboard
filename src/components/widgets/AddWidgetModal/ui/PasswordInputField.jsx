/**
 * PasswordInputField - Reusable input component for password-like fields (e.g., API keys)
 * Single responsibility: render input with label, defaulting to password type
 */
export default function PasswordInputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'password',
  min,
  className = '',
}) {
  return (
    <>
      {label && <label className="mb-2 block text-sm font-medium">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className={`w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      />
    </>
  );
}