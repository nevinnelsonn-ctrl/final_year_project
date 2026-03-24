import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function CampaignDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donateAmount, setDonateAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [donateError, setDonateError] = useState('');

  useEffect(() => {
    api(`/api/campaigns/${id}`)
      .then(setCampaign)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donateAmount || Number(donateAmount) < 1) return;
    setDonateError('');
    setDonating(true);
    try {
      await api('/api/donations', {
        method: 'POST',
        body: JSON.stringify({ campaignId: id, amount: Number(donateAmount) }),
      });
      setCampaign((c) => ({ ...c, raisedAmount: c.raisedAmount + Number(donateAmount) }));
      setDonateAmount('');
    } catch (err) {
      setDonateError(err.message || 'Donation failed');
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <ErrorMessage message={error} />;
  if (!campaign) return null;

  const canDonate = user && (user.role === 'donor' || user.role === 'admin') && campaign.status === 'Approved';

  const pct = Math.min(100, ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100);

  return (
    <div>
      <p className="mb-3">
        <Link to="/campaigns" className="text-decoration-none">
          <i className="bi bi-arrow-left me-1" />Campaigns
        </Link>
      </p>
      <div className="card mb-4">
        <div className="card-body p-4">
          <div className="d-flex gap-2 mb-2">
            <span className="badge bg-teal">{campaign.campaignType}</span>
            {campaign.disasterType && <span className="badge bg-secondary">{campaign.disasterType}</span>}
            <span className="badge bg-secondary">{campaign.status}</span>
          </div>
          <h1 className="page-title">{campaign.title}</h1>
          {campaign.location && (
            <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1" />{campaign.location}</p>
          )}
          <div className="progress mb-2" style={{ height: '8px', borderRadius: 4 }}>
            <div className="progress-bar" role="progressbar" style={{ width: `${pct}%`, backgroundColor: 'var(--teal-500)' }} />
          </div>
          <p className="mb-3">
            <strong>₹{campaign.raisedAmount?.toLocaleString()}</strong>
            <span className="text-muted"> raised of ₹{campaign.goalAmount?.toLocaleString()} ({pct.toFixed(0)}%)</span>
          </p>
          <p className="card-text">{campaign.description}</p>
          {campaign.creator?.name && (
            <p className="text-muted small mb-0"><i className="bi bi-person me-1" />By {campaign.creator.name}</p>
          )}
        </div>
      </div>

      {canDonate && (
        <div className="card">
          <div className="card-body p-4">
            <h5 className="card-title mb-3"><i className="bi bi-heart me-2" style={{ color: 'var(--teal-600)' }} />Make a Donation</h5>
            <ErrorMessage message={donateError} />
            <form onSubmit={handleDonate} className="row g-2 align-items-end">
              <div className="col-auto">
                <label htmlFor="donate-amount" className="form-label small mb-0">Amount (₹)</label>
                <input
                  id="donate-amount"
                  type="number"
                  min="1"
                  className="form-control"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  placeholder="Amount"
                  style={{ width: '10rem' }}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary" disabled={donating}>
                  {donating ? 'Donating…' : 'Donate Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {user && !canDonate && campaign.status !== 'Approved' && (
        <p className="text-muted small mt-3"><i className="bi bi-info-circle me-1" />Only approved campaigns accept donations.</p>
      )}
      {!user && <p className="text-muted small mt-3"><i className="bi bi-info-circle me-1" />Log in as a donor to donate.</p>}
    </div>
  );
}
