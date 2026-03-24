import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { key: 'dashboard',  icon: 'bi-grid',          label: 'Dashboard' },
  { key: 'campaigns',  icon: 'bi-clock-history',  label: 'Pending Campaigns' },
  { key: 'users',      icon: 'bi-people',         label: 'Users' },
  { key: 'assign',     icon: 'bi-person-plus',    label: 'Assign Task' },
  { key: 'tasks',      icon: 'bi-list-task',       label: 'All Tasks' },
];

export default function AdminLayout({ activeTab, onTabChange, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* ---- Sidebar ---- */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <i className="bi bi-shield-lock" style={{ fontSize: '1.3rem' }} />
          <span>Admin Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`admin-nav-link${activeTab === item.key ? ' active' : ''}`}
              onClick={() => onTabChange(item.key)}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-nav-link"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-arrow-left-circle" />
            <span>Back to Site</span>
          </button>

          <div className="admin-user-info">
            <span className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.name}</span>
              <span className="admin-user-email">{user?.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-nav-link text-danger"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ---- Main content ---- */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
