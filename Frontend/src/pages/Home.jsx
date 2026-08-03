import { Activity, BarChart3, Bell, CalendarCheck, Dumbbell, ShieldCheck, Target, TrendingUp, Utensils } from 'lucide-react';
import Panel from '../components/Panel.jsx';

const features = [
  { icon: Dumbbell, title: 'Workout Tracking', text: 'Create workout routines, add exercise name, sets, reps, weights and personal notes.' },
  { icon: Utensils, title: 'Nutrition Logs', text: 'Log breakfast, lunch, dinner and snacks with calories, protein, carbs and fats.' },
  { icon: BarChart3, title: 'Progress Charts', text: 'View clean graphs for body weight, performance metrics and goal completion.' },
  { icon: Bell, title: 'Smart Reminders', text: 'Manage workout reminders, meal alerts and goal achievement notifications.' },
  { icon: Target, title: 'Goal Management', text: 'Track monthly fitness goals with simple visual progress and completion scores.' },
  { icon: ShieldCheck, title: 'Secure User Flow', text: 'User login, registration and protected dashboard flow prepared for backend APIs.' },
];

const steps = [
  'Create your fitness account with basic profile details.',
  'Log workouts, meals and progress from your dashboard.',
  'Review analytics, export reports and adjust preferences.',
];

export default function Home() {
  return (
    <main className="landing">
      <section className="heroSection detailedHero">
        <div>
          <span className="eyebrow">MERN Fitness Tracker</span>
          <h1>Track your fitness journey with a clean user dashboard.</h1>
          <p>
            A responsive React frontend for users to manage workouts, nutrition, progress,
            profile, reports, notifications and support from one modern interface.
          </p>
          <div className="heroHighlights">
            <span><CalendarCheck size={18} /> Daily logs</span>
            <span><TrendingUp size={18} /> Progress analytics</span>
            <span><Activity size={18} /> Fitness overview</span>
          </div>
        </div>
        <Panel className="heroCard">
          <div className="heroMetric"><Activity /> <span>Today Summary</span><b>1,920 kcal burned</b></div>
          <div className="miniBars"><span /><span /><span /><span /><span /></div>
          <div className="heroSplit">
            <div><b>24</b><span>Workouts</span></div>
            <div><b>72%</b><span>Goal</span></div>
            <div><b>89</b><span>Score</span></div>
          </div>
        </Panel>
      </section>

      <section className="featureGrid largeFeatureGrid">
        {features.map(({ icon: Icon, title, text }) => (
          <Panel key={title} className="featureCard"><Icon /><h3>{title}</h3><p>{text}</p></Panel>
        ))}
      </section>

      <section className="infoGrid">
        <Panel>
          <span className="eyebrow">User Flow</span>
          <h2>How the frontend works</h2>
          <div className="stepsList">
            {steps.map((step, index) => <div key={step}><b>{index + 1}</b><span>{step}</span></div>)}
          </div>
        </Panel>
        <Panel>
          <span className="eyebrow">Project Scope</span>
          <h2>Ready for MERN backend</h2>
          <p className="mutedText">
            The current frontend uses demo data. Later, MongoDB, Express and Node.js APIs can be connected for real authentication, workout records, nutrition logs and reports.
          </p>
        </Panel>
      </section>

      <section className="securityBand">
        <ShieldCheck />
        <div><h2>Built according to fitness tracker requirements</h2><p>Registration, login, profile, workout tracking, nutrition analytics, progress graphs, reporting, alerts and responsive design are included.</p></div>
      </section>
    </main>
  );
}
