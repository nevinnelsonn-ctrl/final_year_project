import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ErrorMessage from '../components/ErrorMessage';

export default function CampaignsList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ status: '', campaignType: '' });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.campaignType) params.set('campaignType', filter.campaignType);
    api(`/api/campaigns?${params}`)
      .then(setCampaigns)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [filter.status, filter.campaignType]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading campaigns...</p>
      </div>
    );
  }
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="page-title">Campaigns</h1>
      <div className="row g-2 mb-4">
        <div className="col-auto">
          <select
            className="form-select form-select-sm"
            value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="col-auto">
          <select
            className="form-select form-select-sm"
            value={filter.campaignType}
            onChange={(e) => setFilter((f) => ({ ...f, campaignType: e.target.value }))}
          >
            <option value="">All types</option>
            <option value="Charity">Charity</option>
            <option value="Disaster">Disaster</option>
          </select>
        </div>
      </div>
      <div className="row g-4">
        {campaigns.map((c) => (
          <div key={c._id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex gap-2 mb-2">
                  <span className="badge bg-teal">{c.campaignType}</span>
                  <span className="badge bg-secondary">{c.status}</span>
                </div>
                <h5 className="card-title">
                  <Link to={`/campaigns/${c._id}`} className="text-decoration-none text-dark stretched-link">
                    {c.title}
                  </Link>
                </h5>
                <div className="mt-auto">
                  <div className="progress mb-2" style={{ height: '6px', borderRadius: 3 }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${Math.min(100, ((c.raisedAmount || 0) / (c.goalAmount || 1)) * 100)}%`,
                        backgroundColor: 'var(--teal-500)',
                      }}
                    />
                  </div>
                  <p className="mb-0 small">
                    <strong>₹{c.raisedAmount?.toLocaleString()}</strong>
                    <span className="text-muted"> of ₹{c.goalAmount?.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {campaigns.length === 0 && (
        <p className="text-muted text-center py-4">No campaigns found.</p>
      )}
    </div>
  );
}
