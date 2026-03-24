import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Home page renders its own full-width sections, so skip the container wrapper
  const isHome = location.pathname === '/';

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-md navbar-light bg-white sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold" style={{ color: 'var(--teal-600)' }}>
            <i className="bi bi-heart-pulse-fill" style={{ fontSize: '1.4rem' }} />
            Charity&nbsp;&amp;&nbsp;Relief
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/campaigns" className="nav-link">Campaigns</Link>
              </li>
              {user && (
                <>
                  {(user.role === 'creator' || user.role === 'admin') && (
                    <li className="nav-item">
                      <Link to="/campaigns/new" className="nav-link">Create Campaign</Link>
                    </li>
                  )}
                  {(user.role === 'donor' || user.role === 'admin') && (
                    <li className="nav-item">
                      <Link to="/my-donations" className="nav-link">My Donations</Link>
                    </li>
                  )}
                  {(user.role === 'volunteer' || user.role === 'admin') && (
                    <li className="nav-item">
                      <Link to="/my-tasks" className="nav-link">My Tasks</Link>
                    </li>
                  )}
                  {user.role === 'admin' && (
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link">
                        <i className="bi bi-shield-lock me-1" />Admin
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
            <ul className="navbar-nav align-items-center">
              {user ? (
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle text-decoration-none d-flex align-items-center gap-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light" style={{ width: '2rem', height: '2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--teal-700)' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="d-none d-md-inline">{user.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <span className="dropdown-item-text small text-muted">
                        {user.email}<br />
                        <span className="badge bg-teal mt-1">{user.role}</span>
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-1" /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item ms-1">
                    <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {isHome
        ? <main className="flex-grow-1">{children}</main>
        : <main className="container py-4 flex-grow-1">{children}</main>
      }
      <footer className="text-center py-3" style={{ backgroundColor: 'var(--gray-100)', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} Charity &amp; Relief Platform
      </footer>
    </div>
  );
}
