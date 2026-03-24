import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import ErrorMessage from '../components/ErrorMessage';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goalAmount: '',
    campaignType: 'Charity',
    disasterType: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          goalAmount: Number(form.goalAmount) || 0,
        }),
      });
      navigate('/campaigns');
    } catch (err) {
      setError(err.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <div className="feature-icon mx-auto"><i className="bi bi-megaphone" /></div>
              <h1 className="page-title mb-1">Create Campaign</h1>
              <p className="text-muted small">Fill in the details to launch your fundraiser</p>
            </div>
            <ErrorMessage message={error} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  placeholder="Campaign title"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                  rows={4}
                  placeholder="Describe your campaign…"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Goal amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.goalAmount}
                  onChange={(e) => setForm((f) => ({ ...f, goalAmount: e.target.value }))}
                  required
                  placeholder="10000"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={form.campaignType}
                  onChange={(e) => setForm((f) => ({ ...f, campaignType: e.target.value }))}
                >
                  <option value="Charity">Charity</option>
                  <option value="Disaster">Disaster</option>
                </select>
              </div>
              {form.campaignType === 'Disaster' && (
                <div className="mb-3">
                  <label className="form-label">Disaster type (optional)</label>
                  <input
                    className="form-control"
                    value={form.disasterType}
                    onChange={(e) => setForm((f) => ({ ...f, disasterType: e.target.value }))}
                    placeholder="e.g. Flood, Earthquake"
                  />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Location (optional)</label>
                <input
                  className="form-control"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="City or region"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={loading}>
                {loading ? 'Creating…' : 'Launch Campaign'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
