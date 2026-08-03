import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopbar from './AdminTopbar.jsx';

export default function AdminLayout() {
  return (
    <div className="adminShell">
      <AdminSidebar />
      <main className="adminMain">
        <AdminTopbar />
        <div className="contentArea adminContent">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
