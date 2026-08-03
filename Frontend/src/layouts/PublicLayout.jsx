import { Link, NavLink, Outlet } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function PublicLayout() {
  return (
    <div className="publicShell">
      <nav className="publicNav">
        <Link to="/" className="navLogo"><Logo /></Link>
        <div className="navLinks">
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        <div className="navActions">
          <ThemeToggle />
          <Link className="btn ghost" to="/login">Login</Link>
          <Link className="btn" to="/register">Sign Up</Link>
        </div>
      </nav>
      <Outlet />
      <footer className="publicFooter">
        <p>© 2026 FitTrack Pro. Workout, nutrition, progress and reporting dashboard.</p>
      </footer>
    </div>
  );
}
