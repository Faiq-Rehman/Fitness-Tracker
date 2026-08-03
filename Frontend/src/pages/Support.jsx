import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Panel from '../components/Panel.jsx';
import FormInput from '../components/FormInput.jsx';
import DataTable from '../components/DataTable.jsx';
import Badge from '../components/Badge.jsx';
import { getUserAuthHeader } from '../utils/auth.js';

const API_BASE = '/api/support';

export default function Support() {
  const [form, setForm] = useState({ subject: '', priority: 'Medium', description: '' });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setStatus(null);
  };

  const loadTickets = async () => {
    setLoadingTickets(true);
    setTicketsError('');

    try {
      const res = await fetch(API_BASE, {
        headers: { 'Content-Type': 'application/json', ...getUserAuthHeader() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to load your support tickets');

      setTickets((data.tickets || []).map((ticket) => ({
        ...ticket,
        id: ticket._id,
        created: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown',
      })));
    } catch (err) {
      setTicketsError(err.message || 'Unable to load your support tickets');
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.subject.trim() || !form.description.trim()) {
      setError('Please provide a subject and details for your support request.');
      return;
    }

    setSaving(true);
    setError('');
    setStatus(null);

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getUserAuthHeader() },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to submit support ticket');
      }

      setStatus('Support ticket submitted successfully. Our team will review it soon.');
      setForm({ subject: '', priority: 'Medium', description: '' });
      await loadTickets();
    } catch (err) {
      setError(err.message || 'Unable to submit support ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="pageContainer">
      <PageHeader eyebrow="Feedback and Support" title="Support" text="Contact us for assistance, issue reporting and feedback." />
      <Panel>
        {error && <div className="errorBox">{error}</div>}
        {status && <div className="successBox">{status}</div>}
        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            <FormInput
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Issue title"
              required
            />
            <label className="formGroup">
              <span>Priority</span>
              <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
            <label className="formGroup full">
              <span>Details</span>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Explain your issue..."
                required
              />
            </label>
          </div>
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit Ticket'}</button>
        </form>
      </Panel>

      <Panel>
        <div className="panelHeader">
          <h3>Your Support Tickets</h3>
          <span>See ticket status updates and admin progress.</span>
        </div>
        {ticketsError && <div className="errorBox">{ticketsError}</div>}
        {loadingTickets ? (
          <div>Loading your tickets...</div>
        ) : tickets.length === 0 ? (
          <div>No support tickets found. Submit a ticket above to get help.</div>
        ) : (
          <DataTable
            columns={[
              { key: 'subject', label: 'Subject' },
              { key: 'priority', label: 'Priority' },
              { key: 'status', label: 'Status', render: (row) => <Badge type={row.status === 'Resolved' ? 'success' : row.status === 'In Progress' ? 'warning' : 'danger'}>{row.status}</Badge> },
              { key: 'created', label: 'Submitted' },
              { key: 'description', label: 'Details', render: (row) => row.description.length > 80 ? `${row.description.slice(0, 80)}...` : row.description },
            ]}
            rows={tickets}
          />
        )}
      </Panel>
    </main>
  );
}
