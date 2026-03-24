import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function MyDonations() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    api(`/api/donations/user/${user.id}`)
      .then(setDonations)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) return <p>Please log in to see your donations.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="page-title">My Donations</h1>
      <div className="row g-3">
        {donations.map((d) => (
          <div key={d._id} className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title mb-1">
                  <Link to={`/campaigns/${d.campaign?._id}`} className="text-decoration-none text-dark">
                    {d.campaign?.title}
                  </Link>
                </h6>
                <p className="text-muted small mb-0">
                  <strong>₹{d.amount?.toLocaleString()}</strong>
                  {' '}&middot; {d.paymentStatus === 'Success'
                    ? <span style={{ color: 'var(--teal-600)' }}><i className="bi bi-check-circle me-1" />Success</span>
                    : <span className="text-danger">{d.paymentStatus}</span>
                  }
                  {' '}&middot; {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {donations.length === 0 && <p className="text-muted text-center py-4">No donations yet.</p>}
    </div>
  );
}
