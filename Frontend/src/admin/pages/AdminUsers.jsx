import { Plus, Search } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import DataTable from '../../components/DataTable.jsx';
import Badge from '../../components/Badge.jsx';
import FormInput from '../../components/FormInput.jsx';
import { getAuthHeader } from '../../utils/auth.js';

const API_BASE = '/api/admin';

export default function AdminUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', plan: 'Free', status: 'Active', age: '', gender: 'Male', height: '', weight: '' });
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load users');
      setUsers((data.users || []).map((user) => ({
        ...user,
        name: user.fullName || user.username || user.email,
        email: user.email || '',
        username: user.username || '',
        age: user.age != null ? String(user.age) : '',
        gender: user.gender || 'Other',
        height: user.height != null ? String(user.height) : '',
        weight: user.weight != null ? String(user.weight) : '',
        plan: user.plan || 'Free',
        status: user.status || 'Active',
        joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : null,
        loggedIn: Boolean(user.lastLogin),
      })));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const rows = useMemo(
    () => users.filter((u) => `${u.name} ${u.email} ${u.lastLogin || ''} ${u.status}`.toLowerCase().includes(query.toLowerCase())),
    [users, query]
  );

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError('Please fill all required fields');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to create user');
      setForm({ fullName: '', username: '', email: '', password: '', plan: 'Free', status: 'Active' });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'Blocked' ? 'Active' : 'Blocked';

    try {
      const res = await fetch(`${API_BASE}/users/${user._id}`, {
        method: 'PUT',
        headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to update user');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Admin Management" title="Users Management" text="View, search, add, block and manage all registered users." action={null} />
      <Panel className="adminToolbar"><div className="searchBox"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search user by name, email or status..." /></div></Panel>
      <Panel>
        {error && <div className="errorBox">{error}</div>}
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'username', label: 'Username' },
            { key: 'age', label: 'Age' },
            { key: 'gender', label: 'Gender' },
            { key: 'height', label: 'Height' },
            { key: 'weight', label: 'Weight' },
            { key: 'plan', label: 'Plan' },
            { key: 'status', label: 'Status', render: (r) => <Badge type={r.status === 'Active' ? 'success' : r.status === 'Blocked' ? 'danger' : 'warning'}>{r.status || 'Active'}</Badge> },
            { key: 'joined', label: 'Joined' },
            { key: 'lastLogin', label: 'Last Login', render: (r) => r.lastLogin ? r.lastLogin : 'Never' },
            { key: 'loggedIn', label: 'Logged In', render: (r) => r.loggedIn ? <Badge type="success">Yes</Badge> : <Badge type="warning">No</Badge> },
          ]}
          rows={rows}
          renderActions={(user) => (
            <div className="actionButtons">
              <button type="button" onClick={() => handleToggleStatus(user)}>{user.status === 'Blocked' ? 'Unblock' : 'Block'}</button>
            </div>
          )}
        />
      </Panel>
      <Panel>
        <div className="panelHeader"><h3>Quick Add User</h3><span>Create a new user account in the database</span></div>
        <div className="formGrid">
          <FormInput label="Full Name" name="fullName" value={form.fullName} onChange={(e) => handleFormChange('fullName', e.target.value)} placeholder="User name" />
          <FormInput label="Username" name="username" value={form.username} onChange={(e) => handleFormChange('username', e.target.value)} placeholder="Username" />
          <FormInput label="Email" name="email" value={form.email} onChange={(e) => handleFormChange('email', e.target.value)} placeholder="user@example.com" />
          <FormInput label="Password" name="password" type="password" value={form.password} onChange={(e) => handleFormChange('password', e.target.value)} placeholder="Password" />
          <FormInput label="Height" name="height" value={form.height} onChange={(e) => handleFormChange('height', e.target.value)} placeholder="Height" />
          <FormInput label="Weight" name="weight" value={form.weight} onChange={(e) => handleFormChange('weight', e.target.value)} placeholder="Weight" />
          <FormInput label="Plan" name="plan" value={form.plan} onChange={(e) => handleFormChange('plan', e.target.value)} placeholder="Free / Premium" />
          <FormInput label="Status" name="status" value={form.status} onChange={(e) => handleFormChange('status', e.target.value)} placeholder="Active / Blocked" />
        </div>
        <button className="btn" type="button" onClick={handleCreateUser} disabled={saving}>{saving ? 'Saving...' : <><Plus size={17} /> Save User</>}</button>
      </Panel>
    </>
  );
}
