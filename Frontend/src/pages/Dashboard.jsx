import { Activity, Dumbbell, Flame, Target } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import StatCard from '../components/StatCard.jsx';
import DataTable from '../components/DataTable.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { weeklyActivity, workouts } from '../data/mockData.js';

export default function Dashboard() {
  return (
    <>
      <PageHeader eyebrow="User Panel" title="Dashboard" text="Personal overview of workouts, nutrition and fitness progress." action={<button className="btn">Add Workout</button>} />
      <div className="statsGrid">
        <StatCard icon={<Dumbbell />} label="Workouts" value="24" trend="+6 this week" />
        <StatCard icon={<Flame />} label="Calories" value="2,150" trend="Today intake" />
        <StatCard icon={<Target />} label="Goal" value="72%" trend="Monthly progress" />
        <StatCard icon={<Activity />} label="Active Days" value="18" trend="This month" />
      </div>
      <div className="twoColumn">
        <Panel>
          <div className="panelHeader"><h3>Weekly Activity</h3><span>Workouts trend</span></div>
          <div className="chartBox"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyActivity}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area type="monotone" dataKey="workouts" stroke="var(--primary)" fill="var(--primary-soft)" /></AreaChart></ResponsiveContainer></div>
        </Panel>
        <Panel>
          <div className="panelHeader"><h3>Goals</h3><span>Monthly targets</span></div>
          <ProgressBar label="Strength Training" value={76} />
          <ProgressBar label="Nutrition Accuracy" value={64} />
          <ProgressBar label="Cardio Sessions" value={52} />
          <ProgressBar label="Body Measurements" value={88} />
        </Panel>
      </div>
      <Panel>
        <div className="panelHeader"><h3>Recent Workouts</h3><span>Latest logged exercises</span></div>
        <DataTable columns={[{key:'exercise',label:'Exercise'}, {key:'category',label:'Category'}, {key:'sets',label:'Sets'}, {key:'reps',label:'Reps'}, {key:'weight',label:'Weight'}, {key:'status',label:'Status', render:(r)=><Badge type={r.status==='Completed'?'success':'warning'}>{r.status}</Badge>}]} rows={workouts} />
      </Panel>
    </>
  );
}
