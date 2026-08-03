import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Panel from '../components/Panel.jsx';
import FormInput from '../components/FormInput.jsx';
import { loginUser } from '../utils/auth.js';

const API_BASE = '/api/users';

export default function Login() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      loginUser(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  }

  return (
    <main className="authPage">
      <Panel className="authCard">
        <span className="eyebrow">User Login</span>
        <h1>Login to your account</h1>
        <p>Enter your user credentials to access your personal fitness dashboard.</p>
        <form onSubmit={handleSubmit}>
          <FormInput name="email" label="Email Address" type="email" placeholder="user@example.com" required />
          <FormInput name="password" label="Password" type="password" placeholder="••••••••" required />
          <button className="btn wide" type="submit"><LogIn size={18} /> Login</button>
        </form>
        <p className="authNote">Do not have an account? <Link to="/register">Create account</Link></p>
      </Panel>
    </main>
  );
}
