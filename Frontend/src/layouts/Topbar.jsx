import { Bell, LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { getUserInitials, getUserProfilePicture, logoutUser } from '../utils/auth.js';

export default function Topbar() {
  const navigate = useNavigate();
  const profilePic = getUserProfilePicture();

  function handleLogout() {
    logoutUser();
    navigate('/');
  }

  return (
    <header className="topbar">
      <div className="searchBox"><Search size={18} /><input placeholder="Search workouts, meals, reports..." /></div>
      <div className="topActions">
        <button className="iconButton"><Bell size={18} /></button>
        <ThemeToggle />
        <div className="avatar" style={{ overflow: 'hidden', padding: 0 }}>
          {profilePic ? (
            <img src={profilePic} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            getUserInitials()
          )}
        </div>
        <button className="btn small logoutBtn" onClick={handleLogout}><LogOut size={16} /> Logout</button>
      </div>
    </header>
  );
}
