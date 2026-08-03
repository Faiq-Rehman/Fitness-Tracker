import { useEffect, useState, useMemo } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Clock, 
  Users, 
  MessageSquare, 
  X, 
  Inbox, 
  Copy, 
  Check 
} from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import DataTable from '../../components/DataTable.jsx';
import Badge from '../../components/Badge.jsx';
import Toast from '../../components/Toast.jsx';
import { getAuthHeader } from '../../utils/auth.js';

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activeMessage, setActiveMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const getContacts = async () => {
    setLoading(true);
    setError('');
    try {
      // Attempt main API endpoint first, fallback if needed
      let res;
      try {
        res = await fetch('/api/contact', {
          headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        });
      } catch {
        res = await fetch('http://localhost:5000/api/contact');
      }

      if (!res.ok) {
        // Fallback to backend direct URL if relative path failed
        res = await fetch('http://localhost:5000/api/contact');
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.contacts)) {
        setContacts(data.contacts);
      } else if (Array.isArray(data)) {
        setContacts(data);
      } else if (data.contacts) {
        setContacts(data.contacts);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return;

    setDeletingId(id);
    try {
      let res;
      try {
        res = await fetch(`/api/contact/${id}`, {
          method: 'DELETE',
          headers: { ...getAuthHeader() },
        });
      } catch {
        res = await fetch(`http://localhost:5000/api/contact/${id}`, {
          method: 'DELETE',
        });
      }

      if (!res || !res.ok) {
        res = await fetch(`http://localhost:5000/api/contact/${id}`, {
          method: 'DELETE',
        });
      }

      if (activeMessage?._id === id) {
        setActiveMessage(null);
      }
      showToast('Message deleted successfully', 'success');
      await getContacts();
    } catch (err) {
      showToast(`Failed to delete message: ${err.message}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Extract unique subjects for filter pills
  const availableSubjects = useMemo(() => {
    const subjects = new Set(contacts.map((c) => c.subject).filter(Boolean));
    return ['All', ...Array.from(subjects)];
  }, [contacts]);

  // Filter contacts by search query & subject
  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      const name = (item.fullName || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const subject = (item.subject || '').toLowerCase();
      const message = (item.message || '').toLowerCase();
      const q = query.toLowerCase();

      const matchesQuery = name.includes(q) || email.includes(q) || subject.includes(q) || message.includes(q);
      const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;

      return matchesQuery && matchesSubject;
    });
  }, [contacts, query, selectedSubject]);

  // Calculated Stats
  const uniqueSendersCount = useMemo(() => {
    return new Set(contacts.map((c) => c.email?.toLowerCase()).filter(Boolean)).size;
  }, [contacts]);

  const latestMessageDate = useMemo(() => {
    if (contacts.length === 0) return 'N/A';
    const dates = contacts
      .map((c) => (c.createdAt ? new Date(c.createdAt).getTime() : 0))
      .filter((t) => t > 0);
    if (dates.length === 0) return 'Recent';
    const maxDate = new Date(Math.max(...dates));
    return maxDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }, [contacts]);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitial = (name, email) => {
    const str = name || email || 'U';
    return str.charAt(0).toUpperCase();
  };

  return (
    <div className="adminPage">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={hideToast}
        />
      )}
      {/* Page Header */}
      <PageHeader
        eyebrow="Communications"
        title="Contact Messages"
        text="Review, search, read, and manage incoming user feedback and inquiries."
        action={
          <button className="btn adminPrimary" onClick={getContacts} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* Metric Cards Row */}
      <div className="contactStatsGrid">
        <div className="contactStatCard">
          <div className="contactStatIcon purple">
            <Mail size={26} />
          </div>
          <div className="contactStatInfo">
            <span>Total Messages</span>
            <h3>{contacts.length}</h3>
          </div>
        </div>

        <div className="contactStatCard">
          <div className="contactStatIcon emerald">
            <Users size={26} />
          </div>
          <div className="contactStatInfo">
            <span>Unique Senders</span>
            <h3>{uniqueSendersCount}</h3>
          </div>
        </div>

        <div className="contactStatCard">
          <div className="contactStatIcon rose">
            <Clock size={26} />
          </div>
          <div className="contactStatInfo">
            <span>Latest Activity</span>
            <h3>{latestMessageDate}</h3>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Subject Filters */}
      <div className="contactToolbar">
        <div className="contactSearchBox">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, subject or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {availableSubjects.length > 1 && (
          <div className="contactFilterPills">
            {availableSubjects.map((subj) => (
              <button
                key={subj}
                className={`filterPill ${selectedSubject === subj ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subj)}
              >
                {subj}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Table Panel */}
      <Panel>
        {error && (
          <div className="alert-info" style={{ color: 'var(--danger)', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '40px', textTransform: 'center', textAlign: 'center', color: 'var(--muted)' }}>
            <RefreshCw size={24} className="spin" style={{ marginBottom: '12px' }} />
            <p>Loading contact messages...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="emptyContactState">
            <Inbox size={48} />
            <h3>No Messages Found</h3>
            <p>
              {query || selectedSubject !== 'All'
                ? 'Try adjusting your search query or subject filters.'
                : 'There are currently no contact messages in the database.'}
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: 'sender',
                label: 'Sender',
                render: (item) => (
                  <div className="senderCell">
                    <div className="senderAvatar">
                      {getInitial(item.fullName, item.email)}
                    </div>
                    <div className="senderMeta">
                      <span className="senderName">{item.fullName || 'Anonymous'}</span>
                      <span className="senderEmail">{item.email}</span>
                    </div>
                  </div>
                ),
              },
              {
                key: 'subject',
                label: 'Subject',
                render: (item) => (
                  <span className="subjectBadge">
                    {item.subject || 'General'}
                  </span>
                ),
              },
              {
                key: 'message',
                label: 'Message',
                render: (item) => (
                  <div className="messageSnippet" title={item.message}>
                    {item.message || 'No content'}
                  </div>
                ),
              },
              {
                key: 'date',
                label: 'Received',
                render: (item) => (
                  <span style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                ),
              },
            ]}
            rows={filteredContacts.map((item) => ({ ...item, id: item._id }))}
            renderActions={(item) => (
              <div className="actionButtonGroup">
                <button
                  type="button"
                  className="btnActionIcon"
                  title="View Message Details"
                  onClick={() => setActiveMessage(item)}
                >
                  <Eye size={16} />
                </button>

                <button
                  type="button"
                  className="btnActionIcon delete"
                  title="Delete Message"
                  disabled={deletingId === item._id}
                  onClick={() => deleteMessage(item._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        )}
      </Panel>

      {/* Message Details Modal */}
      {activeMessage && (
        <div className="modalBackdrop" onClick={() => setActiveMessage(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={20} style={{ color: 'var(--admin-primary)' }} />
                <h3>Message Details</h3>
              </div>
              <button
                type="button"
                className="modalCloseBtn"
                onClick={() => setActiveMessage(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modalBody">
              <div className="modalSenderCard">
                <div className="senderCell">
                  <div className="senderAvatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                    {getInitial(activeMessage.fullName, activeMessage.email)}
                  </div>
                  <div className="senderMeta">
                    <span className="senderName" style={{ fontSize: '16px' }}>
                      {activeMessage.fullName || 'Anonymous'}
                    </span>
                    <span className="senderEmail">{activeMessage.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="secondary-btn"
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                  onClick={() => handleCopyEmail(activeMessage.email)}
                >
                  {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Email'}
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Subject
                  </label>
                  <span className="subjectBadge">{activeMessage.subject || 'General Inquiry'}</span>
                </div>
                <h4 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--text)', fontWeight: '700' }}>
                  {activeMessage.subject || 'No Subject Provided'}
                </h4>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Message Content
                </label>
                <div className="modalMessageText">
                  {activeMessage.message || 'No message text provided.'}
                </div>
              </div>

              {activeMessage.createdAt && (
                <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'right' }}>
                  Sent on {new Date(activeMessage.createdAt).toLocaleString()}
                </div>
              )}
            </div>

            <div className="modalFooter">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setActiveMessage(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="btn-outline-secondary"
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onClick={() => deleteMessage(activeMessage._id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}