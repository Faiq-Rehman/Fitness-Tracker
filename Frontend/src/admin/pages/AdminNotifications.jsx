import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import DataTable from '../../components/DataTable.jsx';
import Badge from '../../components/Badge.jsx';
import { getAuthHeader } from '../../utils/auth.js';

const API_BASE = '/api/admin';

export default function AdminNotifications() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to load support tickets');
      setTickets((data.tickets || []).map((ticket) => ({
        ...ticket,
        id: ticket._id,
        userName: ticket.userId?.fullName || ticket.userId?.email || 'Unknown',
        created: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown',
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticket, nextStatus) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to update ticket status');
      await loadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Admin Support"
        title="Support Tickets"
        text="Review and manage all user support tickets, including priority, status and requester details."
        action={<button className="btn adminPrimary" onClick={loadTickets}><Bell size={17} /> Refresh</button>}
      />

      <Panel>
        {error && <div className="errorBox">{error}</div>}
        {loading ? (
          <div>Loading tickets...</div>
        ) : (
          <DataTable
            columns={[
              { key: 'userName', label: 'User' },
              { key: 'subject', label: 'Subject' },
              { key: 'priority', label: 'Priority' },
              { key: 'status', label: 'Status', render: (r) => <Badge type={r.status === 'Resolved' ? 'success' : r.status === 'In Progress' ? 'warning' : 'danger'}>{r.status}</Badge> },
              { key: 'created', label: 'Submitted' },
            ]}
            rows={tickets}
            renderActions={(ticket) => {
              const isResolved = ticket.status === 'Resolved' || ticket.status === 'resolved';
              return (
                <div className="actionButtons">
                  {isResolved ? (
                    <button type="button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      Completed
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={() => updateTicketStatus(ticket, 'Resolved')}>
                        Resolve
                      </button>
                      {ticket.status === 'Open' && (
                        <button type="button" onClick={() => updateTicketStatus(ticket, 'In Progress')}>
                          In Progress
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            }}
          />
        )}
      </Panel>
    </>
  );
}
