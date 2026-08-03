import { Database, ShieldCheck, UserCog } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import FormInput from '../../components/FormInput.jsx';
import Badge from '../../components/Badge.jsx';

export default function AdminSettings() {
  return <><PageHeader eyebrow="Admin Settings" title="Platform Settings" text="Manage admin profile, role permissions, notification preferences and system configuration." /><div className="twoColumn"><Panel><div className="panelHeader"><h3><UserCog size={18} /> Admin Profile</h3><span>Account settings</span></div><div className="formGrid"><FormInput label="Admin Name" defaultValue="Super Admin" /><FormInput label="Email" defaultValue="admin@fittrack.com" /><FormInput label="Role" defaultValue="Super Admin" /><FormInput label="Status" defaultValue="Active" /></div><button className="btn adminPrimary">Save Admin Profile</button></Panel><Panel><div className="settingsList"><div><h3><ShieldCheck size={18} /> Security Mode</h3><p>Two-factor authentication and admin session checks.</p></div><label className="switch"><input type="checkbox" defaultChecked /><span /></label></div><div className="settingsList"><div><h3><Database size={18} /> Backup Status</h3><p>Automatic database backup ready for backend integration.</p></div><Badge type="success">Enabled</Badge></div><div className="settingsList"><div><h3>Admin Theme</h3><p>Switch light/dark mode.</p></div><ThemeToggle /></div></Panel></div></>;
}
