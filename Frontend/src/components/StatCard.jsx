export default function StatCard({ icon, label, value, trend, tone = '' }) {
  return (
    <div className={`statCard ${tone}`}>
      <div className="statIcon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {trend && <small>{trend}</small>}
      </div>
    </div>
  );
}
