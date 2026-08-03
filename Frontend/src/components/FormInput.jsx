export default function FormInput({ label, ...props }) {
  return (
    <label className="formGroup">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
