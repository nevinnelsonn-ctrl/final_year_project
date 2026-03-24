import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'Login failed');
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
              <h1 className="page-title mb-3">Login</h1>
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
              <div className="feature-icon mx-auto"><i className="bi bi-box-arrow-in-right" /></div>
              <h1 className="page-title mb-1">Welcome back</h1>
              <p className="text-muted small">Sign in to continue to your account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <ErrorMessage message={error} />
              <div className="mb-3">
                <label htmlFor="login-email" className="form-label">Email</label>
                <input
                  id="login-email"
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
                <label htmlFor="login-password" className="form-label">Password</label>
                <input
                  id="login-password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={loading}>
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>
            <p className="mt-3 mb-0 text-center small">
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
