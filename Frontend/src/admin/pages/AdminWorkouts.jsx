import { useEffect, useMemo, useState } from 'react';
import { Activity, Dumbbell, FileText, RefreshCw, Search, Users, Utensils, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatCard from '../../components/StatCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import Badge from '../../components/Badge.jsx';
import { getAuthHeader } from '../../utils/auth.js';

const API_BASE = '/api/admin';

export default function AdminWorkouts() {
  const [overview, setOverview] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [overviewRes, workoutsRes] = await Promise.all([
        fetch(`${API_BASE}/overview`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } }),
        fetch(`${API_BASE}/workouts`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } }),
      ]);

      const overviewData = await overviewRes.json();
      const workoutsData = await workoutsRes.json();

      if (!overviewRes.ok) throw new Error(overviewData.message || 'Unable to load overview');
      if (!workoutsRes.ok) throw new Error(workoutsData.message || 'Unable to load workouts');

      setOverview(overviewData.overview || null);
      setWorkouts(
        (workoutsData.workouts || []).map((item) => ({
          ...item,
          id: item._id,
          exercise: item.exerciseName || item.exercise || 'Workout',
          user: item.userId?.fullName || item.userId?.username || 'User',
          userEmail: item.userId?.email || '',
          category: item.category || 'General',
          sets: item.sets ?? '-',
          reps: item.reps ?? '-',
          weight: item.weight ? `${item.weight} kg` : '-',
          date: item.workoutDate
            ? new Date(item.workoutDate).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : 'Unknown',
        }))
      );
    } catch (err) {
      setError(err.message || 'Failed to load workout logs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredWorkouts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return workouts.filter((item) => {
      const matchesSearch =
        !search ||
        (item.exercise || '').toLowerCase().includes(search) ||
        (item.user || '').toLowerCase().includes(search) ||
        (item.category || '').toLowerCase().includes(search);
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [workouts, query, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set(workouts.map((w) => w.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [workouts]);

  return (
    <>
      <PageHeader
        eyebrow="Admin Fitness Tracking"
        title="Workout Logs"
        text="Monitor all user workout routines, categories, tags and completion status."
        action={
          <button type="button" className="btn adminPrimary" onClick={loadData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        }
      />

      <div className="statsGrid">
        <StatCard
          icon={<Dumbbell />}
          label="Total Workouts"
          value={overview ? String(overview.totalWorkouts) : loading ? 'Loading…' : '0'}
          trend="Across all users"
        />
        <StatCard
          icon={<Users />}
          label="Total Users"
          value={overview ? String(overview.totalUsers) : loading ? 'Loading…' : '0'}
          trend="Active users"
        />
        <StatCard
          icon={<Utensils />}
          label="Total Nutrition"
          value={overview ? String(overview.totalNutrition) : loading ? 'Loading…' : '0'}
          trend="Meal logs"
        />
        <StatCard
          icon={<FileText />}
          label="Total Reports"
          value={overview ? String(overview.totalReports) : loading ? 'Loading…' : '0'}
          trend="Reported files"
        />
      </div>

      <Panel>
        {error && <div className="errorBox" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="toolbar" style={{ marginBottom: 20 }}>
          <div className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by exercise name, user or category..."
            />
            {query && (
              <button type="button" className="clear-search-btn" onClick={() => setQuery('')} aria-label="Clear">
                <X size={16} />
              </button>
            )}
          </div>

          {categories.length > 1 && (
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--muted)' }}>
            Loading workout logs...
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)' }}>
            <Activity size={36} style={{ marginBottom: 12, opacity: 0.6 }} />
            <h4 style={{ margin: '0 0 6px', color: 'var(--text)' }}>No workout logs found</h4>
            <p style={{ margin: 0 }}>
              {query || categoryFilter !== 'All' ? 'Try adjusting your search or category filter.' : 'User workout entries will appear here when logged.'}
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: 'user',
                label: 'User',
                render: (r) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: 13, flexShrink: 0 }}>
                      {r.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: 14 }}>{r.user}</strong>
                      {r.userEmail && <small style={{ color: 'var(--muted)', fontSize: 11 }}>{r.userEmail}</small>}
                    </div>
                  </div>
                ),
              },
              {
                key: 'exercise',
                label: 'Exercise',
                render: (r) => <strong style={{ color: 'var(--text)' }}>{r.exercise}</strong>,
              },
              {
                key: 'category',
                label: 'Category',
                render: (r) => (
                  <Badge type={r.category === 'Strength' ? 'success' : r.category === 'Cardio' ? 'warning' : 'default'}>
                    {r.category}
                  </Badge>
                ),
              },
              { key: 'sets', label: 'Sets' },
              { key: 'reps', label: 'Reps' },
              { key: 'weight', label: 'Weight' },
              {
                key: 'date',
                label: 'Logged At',
                render: (r) => <span style={{ color: 'var(--muted)', fontSize: 13 }}>{r.date}</span>,
              },
            ]}
            rows={filteredWorkouts}
          />
        )}
      </Panel>
    </>
  );
}
