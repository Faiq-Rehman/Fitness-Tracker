import { NavLink } from 'react-router-dom';
import { BarChart3, Bell, ClipboardList, Gauge, Home, Mail, Salad, Settings, ShieldCheck, UsersRound, Dumbbell } from 'lucide-react';
import Logo from '../../components/Logo.jsx';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/admin/users', label: 'Users', icon: UsersRound },
  { to: '/admin/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/admin/nutrition', label: 'Nutrition', icon: Salad },
  { to: '/admin/progress', label: 'Progress', icon: BarChart3 },
  { to: '/admin/reports', label: 'Reports', icon: ClipboardList },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/contact', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="adminSidebar">
      <Logo admin />
      <div className="adminLinks">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={18} /> {label}</NavLink>)}
      </div>
      <NavLink className="adminBack" to="/"><Home size={18} /> Website</NavLink>
      <div className="adminNote"><ShieldCheck size={22} /><b>Admin Access</b><p>Manage users, logs, reports and system preferences.</p></div>
    </aside>
  );
}
