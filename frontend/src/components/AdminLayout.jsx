import { NavLink, useNavigate } from 'react-router-dom';
import Seo from './Seo';

export default function AdminLayout({ title, children }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('adminUsername') || 'Admin';

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <Seo title={title} noindex />
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src="/logo.png" alt="Smart Souk" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
          <p>Tableau de bord</p>
        </div>

        <nav className="admin-sidebar-nav">
          <NavLink to="/admin" end className="admin-nav-item">
            <span className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </span>
            Tableau de bord
          </NavLink>

          <NavLink to="/admin/categories" className="admin-nav-item">
            <span className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </span>
            Catégories
          </NavLink>

          <NavLink to="/admin/produits" className="admin-nav-item">
            <span className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              </svg>
            </span>
            Produits
          </NavLink>

          <NavLink to="/admin/commandes" className="admin-nav-item">
            <span className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </span>
            Commandes
          </NavLink>

          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-item">
            <span className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </span>
            Voir la boutique
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={logout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <div className="admin-topbar">
          <h1>{title}</h1>
          <div className="admin-topbar-user">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {username}
          </div>
        </div>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
