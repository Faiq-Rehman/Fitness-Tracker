import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Dumbbell,
  FileSpreadsheet,
  HeartPulse,
  Layers,
  Lock,
  PieChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Utensils,
  Zap,
} from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';

export default function About() {
  const [activeTab, setActiveTab] = useState('backend');

  const stats = [
    {
      icon: Dumbbell,
      value: '10,000+',
      label: 'Workouts Logged',
      subtext: 'Sets, reps & weights tracked seamlessly',
    },
    {
      icon: HeartPulse,
      value: '99.8%',
      label: 'Macro Accuracy',
      subtext: 'Precise protein, carb & fat calculations',
    },
    {
      icon: TrendingUp,
      value: '100%',
      label: 'Responsive Design',
      subtext: 'Optimized for Mobile, Tablet & Desktop',
    },
    {
      icon: Database,
      value: 'MERN Ready',
      label: 'Full Stack Ready',
      subtext: 'Built for MongoDB, Express & Node.js APIs',
    },
  ];

  const techStack = [
    {
      name: 'React 18',
      category: 'Frontend Core',
      desc: 'Declarative component-driven UI library enabling fast interactive user state management.',
      icon: Code2,
    },
    {
      name: 'Vite',
      category: 'Build Tooling',
      desc: 'Lightning-fast module bundler and dev server powering instant Hot Module Replacement (HMR).',
      icon: Zap,
    },
    {
      name: 'Lucide Icons',
      category: 'Visual Assets',
      desc: 'Clean, consistent vector iconography enhancing UX visual cues across user & admin panels.',
      icon: Sparkles,
    },
    {
      name: 'Recharts',
      category: 'Analytics & Data',
      desc: 'Composable charting library for rendering dynamic weight, calorie, and workout graphs.',
      icon: BarChart3,
    },
    {
      name: 'Node.js & Express',
      category: 'Backend Architecture',
      desc: 'Asynchronous event-driven backend ecosystem for scalable REST API microservices.',
      icon: Cpu,
    },
    {
      name: 'MongoDB',
      category: 'Database System',
      desc: 'NoSQL document database flexible schema for storing user records, workout logs & macros.',
      icon: Database,
    },
    {
      name: 'Vanilla CSS & Variables',
      category: 'Styling Engine',
      desc: 'Custom modern design system with HSL colors, smooth transitions, and dark/light themes.',
      icon: Layers,
    },
    {
      name: 'React Router v6',
      category: 'Navigation',
      desc: 'Seamless single-page application routing with protected route guards for User & Admin.',
      icon: Rocket,
    },
  ];

  const pillars = [
    {
      icon: Dumbbell,
      title: 'Personalized Workout Tracking',
      desc: 'Empowers users to build, execute, and monitor routine exercise programs with custom sets, reps, resistance weight, and exercise categorization.',
      tags: ['Custom Sets', 'Weight Logs', 'Exercise History', 'Category Filters'],
    },
    {
      icon: Utensils,
      title: 'Macro & Nutrition Intelligence',
      desc: 'Comprehensive dietary tracking for breakfast, lunch, dinner, and snacks with automated daily calorie, protein, carbohydrate, and fat aggregation.',
      tags: ['Calorie Counter', 'Macro Ratios', 'Meal Categorization', 'Daily Targets'],
    },
    {
      icon: PieChart,
      title: 'Progress Analytics & Export',
      desc: 'Visual data analytics featuring interactive body weight trend lines, goal completion gauges, and structured PDF / CSV report exports.',
      tags: ['Weight Trends', 'PDF/CSV Export', 'Completion Score', 'Goal Gauges'],
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Dual Portal System',
      desc: 'Unified architecture separating client-facing fitness tracking from a centralized Admin Control Panel for platform moderation and management.',
      tags: ['Admin Panel', 'User Management', 'System Alerts', 'Protected Routes'],
    },
  ];

  const tabContents = {
    backend: {
      title: 'REST API & Backend Integration Readiness',
      desc: 'FitTrack Pro has been engineered from the ground up with clean separation of concerns. While currently featuring responsive mock data structures, every component is structured to seamlessly plug into MongoDB, Express, and Node.js RESTful endpoints with standard JSON payloads.',
      points: [
        'JWT Authentication header integration ready for login & registration flow',
        'Normalized data contracts matching MongoDB document schemas for workouts & meals',
        'State persistence hooks ready for asynchronous Axios or Fetch client calls',
        'Asynchronous state loaders prepared for real-time CRUD operations',
      ],
    },
    security: {
      title: 'Security, State & Guarded Navigation',
      desc: 'Data security and access control are built directly into the client routing model. Private routes automatically verify user session tokens prior to rendering protected layouts.',
      points: [
        'Protected User Routes (`/dashboard`, `/workouts`, `/nutrition`, `/reports`)',
        'Dedicated Admin Entry Portal (`/admin`) with elevated access guards',
        'Local storage session utilities for token lifecycle management',
        'Input validation & sanitization ready for XSS and injection defense',
      ],
    },
    analytics: {
      title: 'High-Performance Data Visualization',
      desc: 'Transform raw fitness numbers into actionable insights using lightweight Recharts integration and clean data processing helpers.',
      points: [
        'Interactive bar & line charts for weekly workout activity',
        'Macro distribution pie breakdowns for balanced nutrition planning',
        'Dynamic goal completion progress bars and status indicators',
        'Export engine ready for PDF document compilation and CSV data downloads',
      ],
    },
  };

  return (
    <main className="pageContainer about-page-container">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-badge">
          <Sparkles size={16} /> Modern MERN Stack Fitness Platform
        </div>
        <h1 className="about-hero-title">
          Empowering Your Fitness Journey with <span>Precision Analytics</span>
        </h1>
        <p className="about-hero-description">
          FitTrack Pro is an all-in-one web application designed to bridge the gap between workout routines, dietary nutrition, and long-term physical body transformation through intuitive data visualizers and clean user interface design.
        </p>
      </section>

      {/* Key Stats Counter Grid */}
      <section className="about-stats-grid">
        {stats.map(({ icon: Icon, value, label, subtext }) => (
          <Panel key={label} className="about-stat-card">
            <div className="about-stat-icon">
              <Icon size={24} />
            </div>
            <div className="about-stat-value">{value}</div>
            <div className="about-stat-label">{label}</div>
            <div className="about-stat-subtext">{subtext}</div>
          </Panel>
        ))}
      </section>

      {/* Mission & Core Purpose */}
      <section>
        <div className="about-section-header">
          <span className="eyebrow">Our Core Mission</span>
          <h2>Why We Built FitTrack Pro</h2>
          <p>
            Simplifying health management into a cohesive, user-centric web experience.
          </p>
        </div>
        <div className="about-mission-grid">
          <Panel className="about-card-inner">
            <h3>
              <Target className="text-primary" size={24} /> The Vision
            </h3>
            <p>
              Traditional fitness tracking is often fragmented across multiple disparate mobile apps, notebooks, or spreadsheet files. FitTrack Pro centralizes workout routines, macro meal logs, progress weight metrics, and custom reports inside one unified, lightning-fast dashboard.
            </p>
            <ul className="about-card-list">
              <li>
                <CheckCircle2 size={18} /> Single dashboard for workouts, meals, & body metrics
              </li>
              <li>
                <CheckCircle2 size={18} /> Real-time goal tracking with visual progress feedback
              </li>
              <li>
                <CheckCircle2 size={18} /> Accessible anywhere across mobile, tablet, & desktop
              </li>
            </ul>
          </Panel>

          <Panel className="about-card-inner">
            <h3>
              <Award className="text-primary" size={24} /> Academic & Project Excellence
            </h3>
            <p>
              Designed as a benchmark MERN Stack E-Project, FitTrack Pro demonstrates production-grade frontend architecture, clean component separation, stateful interaction design, and seamless preparedness for full-stack Node/Express/MongoDB integration.
            </p>
            <ul className="about-card-list">
              <li>
                <CheckCircle2 size={18} /> Production-ready code structure and modular React components
              </li>
              <li>
                <CheckCircle2 size={18} /> Integrated Admin & User access control models
              </li>
              <li>
                <CheckCircle2 size={18} /> Built with strict adherence to Web Design & SEO Best Practices
              </li>
            </ul>
          </Panel>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section>
        <div className="about-section-header">
          <span className="eyebrow">Platform Capabilities</span>
          <h2>The Four Pillars of FitTrack Pro</h2>
          <p>
            Key functionality designed to keep users motivated and in control of their goals.
          </p>
        </div>
        <div className="pillars-grid">
          {pillars.map(({ icon: Icon, title, desc, tags }) => (
            <Panel key={title} className="pillar-card">
              <div className="pillar-icon-wrapper">
                <Icon size={28} />
              </div>
              <div className="pillar-content">
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="pillar-tags">
                  {tags.map((tag) => (
                    <span key={tag} className="pillar-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* Tech Stack Breakdown */}
      <section>
        <div className="about-section-header">
          <span className="eyebrow">Technology Stack</span>
          <h2>Powered by Cutting-Edge Technologies</h2>
          <p>
            A high-performance stack built for speed, scalability, and developer ergonomics.
          </p>
        </div>
        <div className="tech-stack-grid">
          {techStack.map(({ name, category, desc, icon: Icon }) => (
            <Panel key={name} className="tech-card">
              <div className="tech-card-header">
                <Icon size={24} className="text-primary" />
                <span className="tech-badge">{category}</span>
              </div>
              <h4>{name}</h4>
              <p>{desc}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Interactive System Architecture Tabs */}
      <section className="about-tabs-container">
        <div className="about-section-header">
          <span className="eyebrow">System Architecture</span>
          <h2>Engineered for Seamless Integration</h2>
          <p>
            Explore how FitTrack Pro connects components, routing, security, and backend APIs.
          </p>
        </div>
        <div className="about-tabs-nav">
          <button
            className={`about-tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
            onClick={() => setActiveTab('backend')}
          >
            <Database size={18} /> Backend Readiness
          </button>
          <button
            className={`about-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={18} /> Security & Routing
          </button>
          <button
            className={`about-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} /> Analytics & Export
          </button>
        </div>

        <div className="about-tab-content">
          <div className="about-tab-pane">
            <h3>{tabContents[activeTab].title}</h3>
            <p>{tabContents[activeTab].desc}</p>
            <ul className="about-card-list">
              {tabContents[activeTab].points.map((pt, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={18} /> {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="about-cta-banner">
        <Rocket size={36} className="text-primary" />
        <h2>Ready to Experience FitTrack Pro?</h2>
        <p>
          Explore all frontend features, track sample workout routines, monitor macro balances, or log into the Admin Control Panel.
        </p>
        <div className="about-cta-buttons">
          <Link to="/register" className="btn primary-btn">
            Create Free Account
          </Link>
          <Link to="/features" className="btn secondary-btn">
            Explore Features
          </Link>
        </div>
      </section>
    </main>
  );
}
