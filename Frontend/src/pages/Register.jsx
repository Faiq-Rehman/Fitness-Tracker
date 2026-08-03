import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Panel from '../components/Panel.jsx';
import FormInput from '../components/FormInput.jsx';
import { loginUser } from '../utils/auth.js';

const API_BASE = '/api/users';

export default function Register() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get('fullName') || '').trim();
    const username = String(formData.get('username') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      loginUser(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Registration failed');
    }
  }

  return (
    <main className="authPage">
      <Panel className="authCard registerCard">
        <span className="eyebrow">Create Account</span>
        <h1>Start your fitness tracking</h1>
        <p>Create a user account first. After sign up, the user dashboard will open automatically.</p>
        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            <FormInput name="fullName" label="Full Name" type="text" placeholder="Your name" required />
            <FormInput name="username" label="Username" type="text" placeholder="fit_user" required />
            <FormInput name="email" label="Email" type="email" placeholder="user@example.com" required />
            <FormInput name="password" label="Password" type="password" placeholder="••••••••" required />
          </div>
          <button className="btn wide" type="submit"><UserPlus size={18} /> Sign Up</button>
        </form>
        <p className="authNote">Already have an account? <Link to="/login">Login</Link></p>
      </Panel>
    </main>
  );
}
