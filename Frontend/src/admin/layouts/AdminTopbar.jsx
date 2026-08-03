import { Bell, LogOut, Search, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import { logoutAdmin } from '../../utils/auth.js';

export default function AdminTopbar() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutAdmin();
    navigate('/admin');
  }

  return (
    <header className="adminTopbar">
      <div className="searchBox adminSearch"><Search size={18} /><input placeholder="Search users, reports, workouts..." /></div>
      <div className="topActions">
        <span className="adminPill"><ShieldCheck size={16} /> Super Admin</span>
        <button className="iconButton"><Bell size={18} /></button>
        <ThemeToggle />
        <div className="avatar adminAvatar">AD</div>
        <button className="btn small logoutBtn adminLogout" onClick={handleLogout}><LogOut size={16} /> Logout</button>
      </div>
    </header>
  );
}
