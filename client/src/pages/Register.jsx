import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Register() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="row justify-content-center pt-3">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card">
            <div className="card-body p-4">
              <h1 className="page-title mb-3">Register</h1>
              <p className="text-muted mb-3">You are logged in as <strong>{user.name}</strong>.</p>
              <button type="button" className="btn btn-outline-danger" onClick={() => { logout(); navigate('/'); }}>
                <i className="bi bi-box-arrow-right me-1" /> Logout
              </button>
              <p className="mt-3 mb-0">
                <Link to="/">← Back to Home</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center pt-3">
      <div className="col-12 col-md-6 col-lg-5">
        <div className="card">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <div className="feature-icon mx-auto"><i className="bi bi-person-plus" /></div>
              <h1 className="page-title mb-1">Create your account</h1>
              <p className="text-muted small">Join the community and start making an impact</p>
            </div>
            <form onSubmit={handleSubmit}>
              <ErrorMessage message={error} />
              <div className="mb-3">
                <label htmlFor="reg-name" className="form-label">Name</label>
                <input
                  id="reg-name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reg-email" className="form-label">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reg-password" className="form-label">Password (min 6 characters)</label>
                <input
                  id="reg-password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reg-role" className="form-label">I want to join as</label>
                <select
                  id="reg-role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="donor">Donor</option>
                  <option value="creator">Creator / NGO</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={loading}>
                {loading ? 'Creating account…' : 'Get Started'}
              </button>
            </form>
            <p className="mt-3 mb-0 text-center small">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
