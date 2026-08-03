import { NavLink } from 'react-router-dom';
import { BarChart3, Dumbbell, Gauge, HelpCircle, Home, PieChart, Salad, Settings, UserRound, FileText } from 'lucide-react';
import Logo from '../components/Logo.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/nutrition', label: 'Nutrition', icon: Salad },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/support', label: 'Support', icon: HelpCircle },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Logo />
      <div className="sidebarLinks">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}><Icon size={18} /> {label}</NavLink>
        ))}
      </div>
      <div className="sidebarCard">
        <PieChart size={22} />
        <b>Goal Progress</b>
        <p>72% monthly target completed.</p>
      </div>
    </aside>
  );
}
