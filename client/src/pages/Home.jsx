import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, API_BASE } from '../api';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: 'bi-megaphone', title: 'Create a Campaign', desc: 'Launch a charity or disaster-relief campaign in minutes and share it with the world.' },
  { icon: 'bi-cash-coin', title: 'Donate Money', desc: 'Support approved campaigns with secure monetary donations and track every contribution.' },
  { icon: 'bi-basket2', title: 'Donate Food', desc: 'List surplus food with quantity, expiry and pickup location so nothing goes to waste.' },
  { icon: 'bi-person-check', title: 'Volunteer Tasks', desc: 'Admins assign food or disaster tasks to volunteers who update progress in real time.' },
  { icon: 'bi-shield-check', title: 'Admin Verification', desc: 'Every campaign is reviewed and approved by an admin before it can receive donations.' },
  { icon: 'bi-bar-chart-line', title: 'Transparent Tracking', desc: 'Donors, creators and admins can view donation history and campaign progress at any time.' },
];

const STEPS = [
  { num: '1', title: 'Register', desc: 'Create an account and pick your role – donor, creator, volunteer, or admin.' },
  { num: '2', title: 'Start a Campaign', desc: 'Fill in the details, set your goal, and submit for admin approval.' },
  { num: '3', title: 'Get Funded', desc: 'Once approved, donors can contribute and you track progress toward your goal.' },
];

const TRUST = [
  { icon: 'bi-lock', label: 'Secure Authentication' },
  { icon: 'bi-clipboard-check', label: 'Admin-Verified Campaigns' },
  { icon: 'bi-eye', label: 'Full Donation Transparency' },
  { icon: 'bi-people', label: 'Role-Based Access Control' },
];

export default function Home() {
  const { user } = useAuth();
  const [backendOk, setBackendOk] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch(API_BASE)
      .then((r) => r.json())
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false));

    api('/api/campaigns?status=Approved')
      .then((data) => setCampaigns(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="container">
          <h1>Laser-focused on your<br />fundraising success</h1>
          <p>
            A unified platform for charity crowdfunding, disaster relief, and food donation —
            raise funds, coordinate volunteers, and make an impact.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/campaigns" className="btn btn-light btn-lg">Browse Campaigns</Link>
            {!user && (
              <Link to="/register" className="btn btn-outline-light btn-lg">Get Started Free</Link>
            )}
          </div>
          {backendOk === false && (
            <p className="mt-3 small" style={{ opacity: 0.75 }}>
              <i className="bi bi-exclamation-circle me-1" />Backend not reachable – make sure the server is running.
            </p>
          )}
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-2" style={{ fontSize: '2rem' }}>Powerful, free online fundraising platform</h2>
          <p className="text-center mb-5" style={{ color: 'var(--gray-500)', maxWidth: 600, margin: '0 auto' }}>
            Everything you need to raise money, manage relief efforts, and coordinate food donations — all in one place.
          </p>
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="col-12 col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className={`bi ${f.icon}`} />
                  </div>
                  <h5>{f.title}</h5>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it Works ===== */}
      <section className="section-alt py-5">
        <div className="container">
          <h2 className="text-center mb-2" style={{ fontSize: '2rem' }}>Seamless fundraising experience</h2>
          <p className="text-center mb-5" style={{ color: 'var(--gray-500)' }}>
            Launch a campaign in three simple steps.
          </p>
          <div className="row g-4 justify-content-center">
            {STEPS.map((s) => (
              <div key={s.num} className="col-12 col-md-4 text-center">
                <div className="step-number">{s.num}</div>
                <h5>{s.title}</h5>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            {user
              ? (user.role === 'creator' || user.role === 'admin') && (
                  <Link to="/campaigns/new" className="btn btn-primary btn-lg">Create a Campaign</Link>
                )
              : <Link to="/register" className="btn btn-primary btn-lg">Start Fundraising</Link>
            }
          </div>
        </div>
      </section>

      {/* ===== Recent Campaigns ===== */}
      {campaigns.length > 0 && (
        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-4" style={{ fontSize: '2rem' }}>Active Campaigns</h2>
            <div className="row g-4">
              {campaigns.map((c) => (
                <div key={c._id} className="col-12 col-md-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-teal align-self-start mb-2">{c.campaignType}</span>
                      <h5 className="card-title">
                        <Link to={`/campaigns/${c._id}`} className="text-decoration-none text-dark stretched-link">
                          {c.title}
                        </Link>
                      </h5>
                      <p className="text-muted small flex-grow-1">
                        {c.description?.length > 100 ? c.description.slice(0, 100) + '…' : c.description}
                      </p>
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
                          <span className="text-muted"> raised of ₹{c.goalAmount?.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/campaigns" className="btn btn-outline-primary">View All Campaigns</Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== Trust & Security ===== */}
      <section className="section-alt py-5">
        <div className="container">
          <h2 className="text-center mb-2" style={{ fontSize: '2rem' }}>Built on transparency &amp; security</h2>
          <p className="text-center mb-5" style={{ color: 'var(--gray-500)' }}>
            Every campaign is equipped with safeguards to protect donors and creators.
          </p>
          <div className="row g-4 justify-content-center">
            {TRUST.map((t) => (
              <div key={t.label} className="col-6 col-md-3 text-center">
                <div className="trust-icon"><i className={`bi ${t.icon}`} /></div>
                <p className="small fw-medium mb-0">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="hero" style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <h2 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '0.75rem' }}>Ready to make a difference?</h2>
          <p>Join thousands of donors, creators and volunteers already using the platform.</p>
          <Link to={user ? '/campaigns' : '/register'} className="btn btn-light btn-lg">
            {user ? 'Explore Campaigns' : 'Create Your Account'}
          </Link>
        </div>
      </section>
    </>
  );
}
