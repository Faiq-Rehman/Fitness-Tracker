import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="iconButton" onClick={toggleTheme} title="Toggle theme">
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
