import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, Trash2, Upload, User } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import FormInput from '../components/FormInput.jsx';
import { getUserAuthHeader, getUserToken, loginUser } from '../utils/auth.js';

const API_BASE = '/api/users';

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: '',
    username: '',
    email: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    profilePicture: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { 'Content-Type': 'application/json', ...getUserAuthHeader() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to load profile');
      const user = data.user || {};
      setProfile({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || 'Male',
        height: user.height || '',
        weight: user.weight || '',
        profilePicture: user.profilePicture || '',
      });
      loginUser(user, getUserToken() || '');
    } catch (err) {
      setError(err.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setError('');
    setMessage('');
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Convert selected image file to compressed Base64 Data URL
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Selected image file is too large. Please select an image under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 400x400 for fast database storage & loading
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.88);
        setProfile((prev) => ({ ...prev, profilePicture: resizedBase64 }));
        setError('');
        setMessage('New picture selected! Click "Save Profile" to replace and save in database.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = () => {
    setProfile((prev) => ({ ...prev, profilePicture: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
    setMessage('Profile picture removed! Click "Save Profile" to save changes.');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getUserAuthHeader() },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to update profile');

      setMessage('Profile and picture saved successfully in database!');
      loginUser(data.user, getUserToken() || '');
      await loadProfile();
    } catch (err) {
      setError(err.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  const userInitials = profile.fullName
    ? profile.fullName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'US';

  return (
    <main className="pageContainer">
      <PageHeader eyebrow="User Management" title="Profile" text="Update profile picture, name and basic information." />
      <Panel>
        {loading ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--muted)' }}>Loading profile...</div>
        ) : (
          <>
            {error && <div className="errorBox">{error}</div>}
            {message && (
              <div className="successBox" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} color="var(--success)" />
                {message}
              </div>
            )}

            <div className="profileHeader">
              <div className="profile-avatar-wrapper">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <div className="avatar large">{userInitials}</div>
                )}
              </div>

              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 22 }}>{profile.fullName || 'User'}</h3>
                <p style={{ margin: '0 0 10px', color: 'var(--muted)' }}>
                  {profile.username ? `@${profile.username}` : 'Username not set'} • {profile.email}
                </p>

                {/* HIDDEN FILE INPUT */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />

                <div className="avatar-actions-row">
                  <button type="button" className="avatar-action-btn" onClick={triggerFileSelect}>
                    <Camera size={16} />
                    {profile.profilePicture ? 'Replace Photo' : 'Upload Photo'}
                  </button>

                  {profile.profilePicture && (
                    <button type="button" className="avatar-action-btn danger" onClick={handleRemovePicture}>
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="formGrid">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={profile.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  required
                />
                <FormInput
                  label="Username"
                  name="username"
                  value={profile.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
                <FormInput
                  label="Age"
                  name="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                />
                <label className="formGroup">
                  <span>Gender</span>
                  <select value={profile.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <FormInput
                  label="Height (cm)"
                  name="height"
                  value={profile.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                />
                <FormInput
                  label="Weight (kg)"
                  name="weight"
                  value={profile.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                />
              </div>
              <button className="btn" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </>
        )}
      </Panel>
    </main>
  );
}
