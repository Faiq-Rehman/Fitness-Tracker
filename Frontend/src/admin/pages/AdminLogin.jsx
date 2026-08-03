import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Panel from '../../components/Panel.jsx';
import FormInput from '../../components/FormInput.jsx';
import { loginAdmin } from '../../utils/auth.js';

const API_BASE = '/api/admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get('adminId') || '').trim();
    const password = String(formData.get('password') || '').trim();

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};

      if (!res.ok) {
        setError(data.message || res.statusText || 'Login failed');
        return;
      }

      // Save token and mark admin as logged in
      loginAdmin(data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <main className="authPage adminLoginPage">
      <Panel className="authCard adminLoginCard">
        <span className="eyebrow">Admin Access</span>
        <h1>Admin login</h1>
        <p>Enter admin ID and password to access the admin dashboard.</p>
        <form onSubmit={handleSubmit}>
          <FormInput name="adminId" label="Admin ID" type="text" placeholder="Enter admin ID" required />
          <FormInput name="password" label="Password" type="password" placeholder="••••••••" required />
          {error && <div className="errorBox">{error}</div>}
          <button className="btn wide adminPrimary" type="submit"><ShieldCheck size={18} /> Login as Admin</button>
        </form>
      </Panel>
    </main>
  );
}
