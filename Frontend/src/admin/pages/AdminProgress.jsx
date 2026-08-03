import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatCard from '../../components/StatCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import { getAuthHeader } from '../../utils/auth.js';

const API_BASE = '/api/admin';

export default function AdminProgress() {
  const [overview, setOverview] = useState(null);
  const [progressRows, setProgressRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [overviewRes, progressRes] = await Promise.all([
          fetch(`${API_BASE}/overview`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } }),
          fetch(`${API_BASE}/progress`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } }),
        ]);

        const overviewData = await overviewRes.json();
        const progressData = await progressRes.json();

        if (!overviewRes.ok) throw new Error(overviewData.message || 'Unable to load overview');
        if (!progressRes.ok) throw new Error(progressData.message || 'Unable to load progress data');

        setOverview(overviewData.overview || null);
        setProgressRows((progressData.progress || []).map((item) => ({
          ...item,
          id: item._id,
          user: item.userId?.fullName || item.userId?.username || 'User',
          date: item.progressDate ? new Date(item.progressDate).toLocaleString() : 'Unknown',
          weight: item.weight || 0,
          waist: item.waist || 0,
          runTime: item.runTime || 0,
          lift: item.liftingWeight || 0,
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <PageHeader eyebrow="Admin Fitness Tracking" title="Progress Logs" text="Track all user fitness progress entries, weight, waist and performance data." />
      <div className="statsGrid">
        <StatCard icon={<BarChart3 />} label="Total Progress" value={overview ? String(overview.totalProgress) : loading ? 'Loading…' : '0'} trend="All users" />
        <StatCard icon={<BarChart3 />} label="Total Workouts" value={overview ? String(overview.totalWorkouts) : loading ? 'Loading…' : '0'} trend="Logged sessions" />
        <StatCard icon={<BarChart3 />} label="Total Nutrition" value={overview ? String(overview.totalNutrition) : loading ? 'Loading…' : '0'} trend="Meal logs" />
        <StatCard icon={<BarChart3 />} label="Total Users" value={overview ? String(overview.totalUsers) : loading ? 'Loading…' : '0'} trend="Active users" />
      </div>
      <Panel>
        {error && <div className="errorBox">{error}</div>}
        <DataTable
          columns={[
            { key: 'user', label: 'User' },
            { key: 'weight', label: 'Weight' },
            { key: 'waist', label: 'Waist' },
            { key: 'runTime', label: 'Run Time' },
            { key: 'lift', label: 'Lift' },
            { key: 'date', label: 'Logged At' },
          ]}
          rows={progressRows}
        />
      </Panel>
    </>
  );
}
