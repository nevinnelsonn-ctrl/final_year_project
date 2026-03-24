import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import AdminLayout from '../components/AdminLayout';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignForm, setAssignForm] = useState({
    volunteerId: '',
    taskType: 'Food',
    assignedLocation: '',
  });
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  const load = () => {
    Promise.all([
      api('/api/campaigns'),
      api('/api/users'),
      api('/api/tasks'),
    ])
      .then(([c, u, t]) => {
        setCampaigns(c);
        setUsers(u);
        setTasks(t);
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    try {
      const updated = await api(`/api/campaigns/approve/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setCampaigns((list) => list.map((c) => (c._id === id ? updated : c)));
    } catch (err) {
      alert(err.message || 'Failed');
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setAssignError('');
    setAssigning(true);
    try {
      await api('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          volunteerId: assignForm.volunteerId,
          taskType: assignForm.taskType,
          assignedLocation: assignForm.assignedLocation,
        }),
      });
      setAssignForm({ volunteerId: '', taskType: 'Food', assignedLocation: '' });
      load();
    } catch (err) {
      setAssignError(err.message || 'Failed to assign');
    } finally {
      setAssigning(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <i className="bi bi-shield-x" style={{ fontSize: '3rem', color: 'var(--gray-300)' }} />
          <p className="mt-2 text-muted">Access denied. Admin only.</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const pending = campaigns.filter((c) => c.status === 'Pending');
  const approved = campaigns.filter((c) => c.status === 'Approved');
  const volunteers = users.filter((u) => u.role === 'volunteer');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  if (loading) {
    return (
      <AdminLayout activeTab={tab} onTabChange={setTab}>
        <div className="d-flex align-items-center justify-content-center" style={{ height: '60vh' }}>
          <div className="spinner-border" role="status" />
        </div>
      </AdminLayout>
    );
  }
  if (error) {
    return (
      <AdminLayout activeTab={tab} onTabChange={setTab}>
        <ErrorMessage message={error} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab}>
      {/* ======= Dashboard ======= */}
      {tab === 'dashboard' && (
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="row g-3 mb-4">
            {[
              { label: 'Total Campaigns', value: campaigns.length, icon: 'bi-megaphone', color: 'var(--teal-600)' },
              { label: 'Pending Approval', value: pending.length, icon: 'bi-clock-history', color: '#e67e22' },
              { label: 'Approved', value: approved.length, icon: 'bi-check-circle', color: 'var(--teal-500)' },
              { label: 'Total Users', value: users.length, icon: 'bi-people', color: '#3498db' },
              { label: 'Volunteers', value: volunteers.length, icon: 'bi-person-check', color: '#9b59b6' },
              { label: 'Tasks Completed', value: completedTasks.length, icon: 'bi-list-check', color: '#27ae60' },
            ].map((s) => (
              <div key={s.label} className="col-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="feature-icon" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                      <i className={`bi ${s.icon}`} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1, color: 'var(--gray-900)' }}>{s.value}</div>
                      <div className="text-muted small">{s.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick: recent pending */}
          {pending.length > 0 && (
            <>
              <h2 className="h6 mb-2">Needs your attention</h2>
              <div className="row g-3">
                {pending.slice(0, 4).map((c) => (
                  <div key={c._id} className="col-12 col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <span className="badge bg-teal mb-1">{c.campaignType}</span>
                        <h6 className="card-title mb-1">{c.title}</h6>
                        <p className="text-muted small mb-2">Goal: ₹{c.goalAmount?.toLocaleString()}</p>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => setStatus(c._id, 'Approved')}>
                            <i className="bi bi-check-lg me-1" />Approve
                          </button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setStatus(c._id, 'Rejected')}>
                            <i className="bi bi-x-lg me-1" />Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ======= Pending Campaigns ======= */}
      {tab === 'campaigns' && (
        <div>
          <h1 className="page-title">Pending Campaigns</h1>
          <div className="row g-3">
            {pending.map((c) => (
              <div key={c._id} className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <span className="badge bg-teal mb-1">{c.campaignType}</span>
                    <h6 className="card-title mb-1">{c.title}</h6>
                    <p className="text-muted small mb-1">{c.description?.length > 120 ? c.description.slice(0, 120) + '…' : c.description}</p>
                    <p className="text-muted small mb-2">Goal: ₹{c.goalAmount?.toLocaleString()}</p>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setStatus(c._id, 'Approved')}>
                        <i className="bi bi-check-lg me-1" />Approve
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setStatus(c._id, 'Rejected')}>
                        <i className="bi bi-x-lg me-1" />Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pending.length === 0 && <p className="text-muted text-center py-4">No pending campaigns.</p>}
        </div>
      )}

      {/* ======= Users ======= */}
      {tab === 'users' && (
        <div>
          <h1 className="page-title">Users ({users.length})</h1>
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ fontSize: '0.9rem' }}>
                  <thead className="table-light">
                    <tr><th>Name</th><th>Email</th><th>Role</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td className="text-muted">{u.email}</td>
                        <td><span className="badge bg-teal">{u.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======= Assign Task ======= */}
      {tab === 'assign' && (
        <div>
          <h1 className="page-title">Assign Task to Volunteer</h1>
          <div className="card">
            <div className="card-body p-4">
              <ErrorMessage message={assignError} />
              <form onSubmit={handleAssignTask} style={{ maxWidth: 480 }}>
                <div className="mb-3">
                  <label className="form-label">Volunteer</label>
                  <select
                    className="form-select"
                    value={assignForm.volunteerId}
                    onChange={(e) => setAssignForm((f) => ({ ...f, volunteerId: e.target.value }))}
                    required
                  >
                    <option value="">Select volunteer</option>
                    {volunteers.map((v) => (
                      <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Task type</label>
                  <select
                    className="form-select"
                    value={assignForm.taskType}
                    onChange={(e) => setAssignForm((f) => ({ ...f, taskType: e.target.value }))}
                  >
                    <option value="Food">Food</option>
                    <option value="Disaster">Disaster</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    className="form-control"
                    value={assignForm.assignedLocation}
                    onChange={(e) => setAssignForm((f) => ({ ...f, assignedLocation: e.target.value }))}
                    required
                    placeholder="Assigned location"
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={assigning}>
                  {assigning ? 'Assigning…' : 'Assign Task'}
                </button>
              </form>
              {volunteers.length === 0 && (
                <p className="text-muted mt-3 mb-0">No volunteers registered yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======= All Tasks ======= */}
      {tab === 'tasks' && (
        <div>
          <h1 className="page-title">All Tasks ({tasks.length})</h1>
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ fontSize: '0.9rem' }}>
                  <thead className="table-light">
                    <tr><th>Type</th><th>Location</th><th>Volunteer</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t._id}>
                        <td><span className="badge bg-teal">{t.taskType}</span></td>
                        <td>{t.assignedLocation}</td>
                        <td>{t.volunteer?.name || t.volunteer}</td>
                        <td><span className="badge bg-secondary">{t.status}</span></td>
                      </tr>
                    ))}
                    {tasks.length === 0 && (
                      <tr><td colSpan="4" className="text-muted text-center py-3">No tasks yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
