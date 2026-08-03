import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Settings() {
  return <><PageHeader eyebrow="Settings and Preferences" title="Settings" text="Customize theme, notifications, units and preferences." /><Panel><div className="settingsList"><div><h3>Theme Preference</h3><p>Switch between light and dark mode.</p></div><ThemeToggle /></div><div className="settingsList"><div><h3>Notifications</h3><p>Workout reminders and meal alerts enabled.</p></div><label className="switch"><input type="checkbox" defaultChecked /><span /></label></div><div className="settingsList"><div><h3>Measurement Unit</h3><p>Use kilograms and centimeters.</p></div><select><option>Metric</option><option>Imperial</option></select></div></Panel></>;
}
