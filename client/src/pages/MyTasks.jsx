import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    api(`/api/tasks/volunteer/${user.id}`)
      .then(setTasks)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const updateStatus = async (taskId, status) => {
    try {
      const updated = await api(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setTasks((list) => list.map((t) => (t._id === taskId ? updated : t)));
    } catch (err) {
      alert(err.message || 'Failed to update');
    }
  };

  if (!user) return <p>Please log in to see your tasks.</p>;
  if (user.role !== 'volunteer' && user.role !== 'admin') {
    return <p>Only volunteers have tasks. Your role: {user.role}</p>;
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="page-title">My Tasks</h1>
      <div className="row g-3">
        {tasks.map((t) => (
          <div key={t._id} className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex gap-2 mb-2">
                  <span className="badge bg-teal">{t.taskType}</span>
                  <span className="badge bg-secondary">{t.status}</span>
                </div>
                <p className="mb-2"><i className="bi bi-geo-alt me-1" />{t.assignedLocation}</p>
                <div>
                  {t.status === 'Assigned' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => updateStatus(t._id, 'In Progress')}
                    >
                      <i className="bi bi-play-fill me-1" />Start Task
                    </button>
                  )}
                  {t.status === 'In Progress' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => updateStatus(t._id, 'Completed')}
                    >
                      <i className="bi bi-check-lg me-1" />Mark Completed
                    </button>
                  )}
                  {t.status === 'Completed' && (
                    <span style={{ color: 'var(--teal-600)' }}><i className="bi bi-check-circle me-1" />Done</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {tasks.length === 0 && <p className="text-muted text-center py-4">No tasks assigned yet.</p>}
    </div>
  );
}
