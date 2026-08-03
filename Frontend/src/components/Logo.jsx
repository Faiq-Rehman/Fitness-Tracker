import { Activity } from 'lucide-react';

export default function Logo({ admin = false }) {
  return (
    <div className="logo">
      <span className="logoMark"><Activity size={20} /></span>
      <div>
        <strong>{admin ? 'FitTrack Admin' : 'FitTrack Pro'}</strong>
        <small>{admin ? 'Control Center' : 'Fitness Dashboard'}</small>
      </div>
    </div>
  );
}
