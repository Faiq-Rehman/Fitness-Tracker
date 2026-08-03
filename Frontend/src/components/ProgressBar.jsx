export default function ProgressBar({ value, label }) {
  return (
    <div className="progressItem">
      <div><span>{label}</span><b>{value}%</b></div>
      <div className="progressTrack"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}
