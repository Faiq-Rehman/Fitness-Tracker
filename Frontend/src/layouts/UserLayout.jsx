import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function UserLayout() {
  return (
    <div className="dashboardShell">
      <Sidebar />
      <main className="mainArea">
        <Topbar />
        <div className="contentArea">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
