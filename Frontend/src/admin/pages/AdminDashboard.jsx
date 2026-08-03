import { Activity, AlertTriangle, BarChart3, Bell, ClipboardList, Dumbbell, Server, UsersRound } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StatCard from '../../components/StatCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import Badge from '../../components/Badge.jsx';
import { weeklyActivity } from '../../data/mockData.js';
import { useEffect, useState } from 'react';
import { getAuthHeader } from '../../utils/auth.js';

const API_BASE = '/api/admin';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await fetch(`${API_BASE}/overview`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } });
        const data = await res.json();
        if (res.ok) setOverview(data.overview || null);
      } catch (err) {
        // ignore for now
      }
    }

    async function loadRecentUsers() {
      try {
        const res = await fetch(`${API_BASE}/users`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } });
        const data = await res.json();
        if (res.ok) setRecentUsers((data.users || []).slice(0, 4));
      } catch (err) {
        // ignore
      }
    }

    loadOverview();
    loadRecentUsers();
  }, []);
  return (
    <>
      <PageHeader eyebrow="Admin Dashboard" title="Control Center" text="Complete admin overview for users, workouts, nutrition logs, reports and system activity." action={<button className="btn adminPrimary"><Bell size={17} /> Send Alert</button>} />
      <div className="statsGrid adminStats">
        <StatCard icon={<UsersRound />} label="Total Users" value={overview ? String(overview.totalUsers) : '—'} trend="" tone="adminTone" />
        <StatCard icon={<Dumbbell />} label="Workout Logs" value={overview ? String(overview.totalWorkouts) : '—'} trend="" tone="adminTone" />
        <StatCard icon={<Activity />} label="Nutrition Logs" value={overview ? String(overview.totalNutrition) : '—'} trend="" tone="adminTone" />
        <StatCard icon={<Server />} label="System Health" value="99.9%" trend="Stable uptime" tone="adminTone" />
      </div>

      <div className="twoColumn adminCharts">
        <Panel>
          <div className="panelHeader"><h3>User Growth</h3><span>New users this week</span></div>
          <div className="chartBox"><ResponsiveContainer width="100%" height="100%"><LineChart data={weeklyActivity}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="users" stroke="var(--admin-primary)" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div>
        </Panel>
        <Panel>
          <div className="panelHeader"><h3>Platform Activity</h3><span>Workout volume</span></div>
          <div className="chartBox"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyActivity}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="workouts" fill="var(--admin-accent)" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
      </div>

      <div className="twoColumn adminLower">
        <Panel>
          <div className="panelHeader"><h3>Recent Users</h3><span>Latest registrations</span></div>
          <DataTable columns={[{key:'name',label:'Name'}, {key:'plan',label:'Plan'}, {key:'status',label:'Status', render:(r)=><Badge type={r.status==='Active'?'success':r.status==='Blocked'?'danger':'warning'}>{r.status}</Badge>}, {key:'joined',label:'Joined'}]} rows={recentUsers} />
        </Panel>
        <Panel>
          <div className="panelHeader"><h3>Admin Tasks</h3><span>Priority checks</span></div>
          <div className="taskList">
            <div><AlertTriangle /><span>Review blocked user reports</span><b>3</b></div>
            <div><ClipboardList /><span>Generate weekly CSV export</span><b>Ready</b></div>
            <div><BarChart3 /><span>Check nutrition analytics sync</span><b>92%</b></div>
          </div>
          <ProgressBar label="Server Usage" value={42} />
          <ProgressBar label="Database Load" value={58} />
        </Panel>
      </div>
    </>
  );
}
