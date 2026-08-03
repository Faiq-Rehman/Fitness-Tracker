import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import DataTable from '../../components/DataTable.jsx';
import Badge from '../../components/Badge.jsx';
import { getAuthHeader } from '../../utils/auth.js';

const API_BASE = '/api/admin';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDownload = (report) => {
    try {
      if (report.fileUrl && (report.fileUrl.startsWith('http://') || report.fileUrl.startsWith('https://') || report.fileUrl.startsWith('blob:'))) {
        const link = document.createElement('a');
        link.href = report.fileUrl;
        link.download = report.title || `${report.type || 'report'}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const escapeCsv = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      const headers = ['User', 'File Name', 'Type', 'Generated On', 'Status'];
      const row = [
        escapeCsv(report.user),
        escapeCsv(report.title),
        escapeCsv(report.type),
        escapeCsv(report.generated),
        escapeCsv(report.status),
      ];

      const csvContent = `${headers.join(',')}\n${row.join(',')}\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeFileName = (report.title || `${report.type || 'report'}_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `${safeFileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${API_BASE}/reports`, { headers: { ...(getAuthHeader()), 'Content-Type': 'application/json' } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Unable to load reports');

        setReports((data.reports || []).map((item) => ({
          ...item,
          id: item._id,
          user: item.userId?.fullName || item.userId?.name || item.userId?.username || item.userName || item.name || (typeof item.userId === 'string' ? item.userId : 'User'),
          title: item.fileName,
          type: item.reportType,
          generated: item.generatedDate ? new Date(item.generatedDate).toLocaleString() : item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Unknown',
          status: 'Ready',
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  return (
    <>
      <PageHeader eyebrow="Admin Reports" title="Reports & Export" text="Generate PDF/CSV reports for users, workouts, nutrition and system activity." action={null} />
      
      <Panel>
        {error && <div className="errorBox">{error}</div>}
        <DataTable
          columns={[
            { key: 'user', label: 'User' },
            { key: 'title', label: 'File Name' },
            { key: 'type', label: 'Type' },
            { key: 'generated', label: 'Generated On' },
            { key: 'status', label: 'Status', render: (row) => <Badge type={row.status === 'Ready' ? 'success' : 'warning'}>{row.status}</Badge> },
          ]}
          rows={reports}
        />
      </Panel>
    </>
  );
}
