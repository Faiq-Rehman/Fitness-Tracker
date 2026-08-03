import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle2,
  Database,
  Download,
  Dumbbell,
  FileSpreadsheet,
  Filter,
  Layers,
  LineChart,
  Lock,
  PieChart,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  UserCheck,
  Utensils,
  XCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';

export default function Features() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Modules', icon: Layers },
    { id: 'workouts', label: 'Workout Tracking', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition & Macros', icon: Utensils },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'admin', label: 'Admin & Security', icon: ShieldCheck },
  ];

  const featuresList = [
    {
      id: 'w1',
      category: 'workouts',
      title: 'Interactive Workout Logging',
      desc: 'Record exercises with resistance weights, sets, rep counts, and custom notes in a fast responsive form.',
      icon: Dumbbell,
      badge: 'Core Feature',
      points: ['Custom Set & Rep Counters', 'Weight Resistance Tracking', 'Category Tags (Chest, Legs, Back, etc.)'],
    },
    {
      id: 'w2',
      category: 'workouts',
      title: 'Routine & Program Builder',
      desc: 'Organize training days, split routines (Push-Pull-Legs, Upper-Lower), and track workout completion status.',
      icon: Activity,
      badge: 'User Active',
      points: ['Weekly Training Splits', 'Progress Badges', 'Routine History Log'],
    },
    {
      id: 'n1',
      category: 'nutrition',
      title: 'Macro & Meal Breakdown',
      desc: 'Track daily intake across Breakfast, Lunch, Dinner, and Snacks with automated calorie and macro totals.',
      icon: Utensils,
      badge: 'Core Feature',
      points: ['Calories, Protein, Carbs & Fats', 'Meal Category Breakdown', 'Goal vs Actual Ratios'],
    },
    {
      id: 'n2',
      category: 'nutrition',
      title: 'Daily Nutrition Summaries',
      desc: 'Get instant visual feedback on whether daily calorie and macronutrient targets have been met or exceeded.',
      icon: PieChart,
      badge: 'Visual Feedback',
      points: ['Dynamic Macro Progress Bars', 'Calorie Goal Deficit/Surplus', 'Daily Intake Overview'],
    },
    {
      id: 'a1',
      category: 'analytics',
      title: 'Recharts Body Analytics',
      desc: 'Visualize body weight trends, weekly workout counts, and fitness score progress over time.',
      icon: LineChart,
      badge: 'Interactive Charts',
      points: ['Interactive Weight Line Charts', 'Weekly Activity Bar Graphs', 'Completion Rate Gauges'],
    },
    {
      id: 'a2',
      category: 'analytics',
      title: 'PDF & CSV Export Engine',
      desc: 'Export comprehensive workout history and nutrition logs as downloadable CSV spreadsheets or PDF files.',
      icon: Download,
      badge: 'Export Ready',
      points: ['Instant CSV File Downloads', 'Formatted PDF Summary Reports', 'Custom Date Range Export'],
    },
    {
      id: 'm1',
      category: 'admin',
      title: 'Admin Control Portal',
      desc: 'Dedicated back-office panel to monitor user registrations, workout logs, nutrition records, and platform alerts.',
      icon: ShieldCheck,
      badge: 'Admin Only',
      points: ['User Account Management', 'System Announcements', 'Global Activity Monitoring'],
    },
    {
      id: 'm2',
      category: 'admin',
      title: 'Protected Route Security',
      desc: 'Client-side navigation guards separating public marketing pages from authenticated user and admin areas.',
      icon: Lock,
      badge: 'Guarded Navigation',
      points: ['User Route Protection', 'Admin Portal Access Guard', 'Session Persistence'],
    },
    {
      id: 's1',
      category: 'analytics',
      title: 'Search & Data Filters',
      desc: 'Filter workout routines by exercise category, date range, or completion status with instant table search.',
      icon: Search,
      badge: 'Fast Filter',
      points: ['Real-time Text Search', 'Category Filtering', 'Status Filter Pills'],
    },
    {
      id: 'n3',
      category: 'admin',
      title: 'Smart Reminders & Alerts',
      desc: 'Automated user notifications for workout reminders, meal logging prompts, and system updates.',
      icon: Bell,
      badge: 'Real-time Alerts',
      points: ['Toast Notification Feedback', 'Reminder Dismissal', 'Activity Reminders'],
    },
    {
      id: 'r1',
      category: 'analytics',
      title: '100% Responsive UI',
      desc: 'Fluid responsive layout adapting smoothly from desktop displays to mobile phones and tablets.',
      icon: Smartphone,
      badge: 'Cross Platform',
      points: ['Mobile Sidebar Drawer', 'Adaptive Card Grids', 'Touch-friendly Controls'],
    },
    {
      id: 'r2',
      category: 'admin',
      title: 'MERN Stack API Prepared',
      desc: 'Architected to easily plug into MongoDB document databases and Express/Node.js REST endpoints.',
      icon: Database,
      badge: 'MERN Ready',
      points: ['Standardized JSON Schemas', 'Async API Action Hooks', 'Clean State Separation'],
    },
  ];

  const filteredFeatures =
    selectedCategory === 'all'
      ? featuresList
      : featuresList.filter((item) => item.category === selectedCategory);

  const comparisonData = [
    {
      feature: 'Workout & Set Logging',
      fittrack: true,
      paper: false,
      generic: 'Basic',
    },
    {
      feature: 'Macronutrient Breakdown (Protein/Carbs/Fats)',
      fittrack: true,
      paper: false,
      generic: 'Paywalled',
    },
    {
      feature: 'PDF & CSV Data Export',
      fittrack: true,
      paper: false,
      generic: false,
    },
    {
      feature: 'Interactive Progress Charts (Recharts)',
      fittrack: true,
      paper: false,
      generic: 'Limited',
    },
    {
      feature: 'Dedicated Admin Management Portal',
      fittrack: true,
      paper: false,
      generic: false,
    },
    {
      feature: '100% Dark & Light Mode Theme Support',
      fittrack: true,
      paper: false,
      generic: false,
    },
  ];

  return (
    <main className="pageContainer features-page-container">
      {/* Hero Section */}
      <section className="features-hero-section">
        <div className="about-badge">
          <Sparkles size={16} /> FitTrack Pro Feature Ecosystem
        </div>
        <h1 className="about-hero-title">
          Comprehensive Suite for Workouts, <span>Nutrition & Analytics</span>
        </h1>
        <p className="about-hero-description">
          Explore every module built into FitTrack Pro. From intuitive daily exercise tracking to macro nutrition calculators, real-time analytics, and admin moderation tools.
        </p>
      </section>

      {/* Interactive Category Tabs */}
      <section>
        <div className="features-category-nav">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`features-tab-btn ${selectedCategory === id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(id)}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="features-grid">
        {filteredFeatures.map(({ id, title, desc, icon: Icon, badge, points }) => (
          <Panel key={id} className="feature-deep-card">
            <div className="feature-card-header">
              <div className="feature-icon-wrapper">
                <Icon size={24} />
              </div>
              <span className="feature-status-badge ready">{badge}</span>
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <ul className="feature-points-list">
              {points.map((pt, index) => (
                <li key={index}>
                  <CheckCircle2 size={16} /> {pt}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </section>

      {/* Capability Matrix Comparison */}
      <section>
        <div className="about-section-header">
          <span className="eyebrow">Platform Advantage</span>
          <h2>Why Choose FitTrack Pro?</h2>
          <p>
            See how FitTrack Pro outperforms traditional paper tracking and fragmented apps.
          </p>
        </div>
        <div className="matrix-container">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Feature Capability</th>
                <th>FitTrack Pro</th>
                <th>Paper / Spreadsheet Log</th>
                <th>Generic Fitness Apps</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map(({ feature, fittrack, paper, generic }) => (
                <tr key={feature}>
                  <td>
                    <strong>{feature}</strong>
                  </td>
                  <td>
                    {fittrack ? (
                      <span className="matrix-check">
                        <CheckCircle2 size={18} /> Included
                      </span>
                    ) : (
                      <span className="matrix-cross">
                        <XCircle size={18} /> No
                      </span>
                    )}
                  </td>
                  <td>
                    {paper ? (
                      <span className="matrix-check">
                        <CheckCircle2 size={18} /> Yes
                      </span>
                    ) : (
                      <span className="matrix-cross">
                        <XCircle size={18} /> No
                      </span>
                    )}
                  </td>
                  <td>
                    {typeof generic === 'string' ? (
                      <span style={{ color: 'var(--warning)', fontWeight: '600' }}>
                        {generic}
                      </span>
                    ) : generic ? (
                      <span className="matrix-check">
                        <CheckCircle2 size={18} /> Yes
                      </span>
                    ) : (
                      <span className="matrix-cross">
                        <XCircle size={18} /> No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3-Step Interactive Workflow */}
      <section>
        <div className="about-section-header">
          <span className="eyebrow">How It Works</span>
          <h2>Data Flow Architecture</h2>
          <p>
            From your daily workout entries to automated reports and progress visualization.
          </p>
        </div>
        <div className="workflow-steps-grid">
          <Panel className="workflow-step-card">
            <div className="workflow-step-number">1</div>
            <h4>Log Activity & Meals</h4>
            <p>
              Input workout sets, exercise weights, and dietary meals using quick intuitive forms on mobile or desktop.
            </p>
          </Panel>
          <Panel className="workflow-step-card">
            <div className="workflow-step-number">2</div>
            <h4>Automated Aggregation</h4>
            <p>
              Frontend state calculators aggregate total calories, protein ratios, body weight averages, and goal metrics.
            </p>
          </Panel>
          <Panel className="workflow-step-card">
            <div className="workflow-step-number">3</div>
            <h4>Visuals & PDF Export</h4>
            <p>
              Inspect dynamic Recharts graphs or export your complete workout & nutrition history to formatted PDF/CSV.
            </p>
          </Panel>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="about-cta-banner">
        <Rocket size={36} className="text-primary" />
        <h2>Experience All Features Live Today</h2>
        <p>
          Create your account to start tracking workouts, logging meals, and viewing progress analytics.
        </p>
        <div className="about-cta-buttons">
          <Link to="/register" className="btn primary-btn">
            Get Started Free
          </Link>
          <Link to="/dashboard" className="btn secondary-btn">
            User Dashboard
          </Link>
          <Link to="/about" className="btn secondary-btn">
            Learn About Platform
          </Link>
        </div>
      </section>
    </main>
  );
}
