import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import AdminLayout from './admin/layouts/AdminLayout.jsx';
import Home from './pages/Home.jsx';
import Features from './pages/Features.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Workouts from './pages/Workouts.jsx';
import Nutrition from './pages/Nutrition.jsx';
import Progress from './pages/Progress.jsx';
import Reports from './pages/Reports.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Support from './pages/Support.jsx';
import AdminLogin from './admin/pages/AdminLogin.jsx';
import AdminDashboard from './admin/pages/AdminDashboard.jsx';
import AdminUsers from './admin/pages/AdminUsers.jsx';
import AdminWorkouts from './admin/pages/AdminWorkouts.jsx';
import AdminNutrition from './admin/pages/AdminNutrition.jsx';
import AdminContact from "./admin/pages/AdminContact";
import AdminProgress from './admin/pages/AdminProgress.jsx';
import AdminReports from './admin/pages/AdminReports.jsx';
import AdminNotifications from './admin/pages/AdminNotifications.jsx';
import AdminSettings from './admin/pages/AdminSettings.jsx';
import NotFound from './pages/NotFound.jsx';
import { isAdminLoggedIn, isUserLoggedIn } from './utils/auth.js';

function UserProtectedRoute() {
  return isUserLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}

function AdminProtectedRoute() {
  return isAdminLoggedIn() ? <Outlet /> : <Navigate to="/admin" replace />;
}

function AdminEntry() {
  return isAdminLoggedIn() ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<UserProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminEntry />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="workouts" element={<AdminWorkouts />} />
          <Route path="nutrition" element={<AdminNutrition />} />
          <Route path="progress" element={<AdminProgress />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="/admin/contact" element={<AdminContact />}/>
        </Route>
      </Route>

      <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
