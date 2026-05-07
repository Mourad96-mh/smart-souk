import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';
import { STATUS_LABELS, STATUS_COLORS } from '../../config';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/stats/summary', true),
      api.get('/orders?limit=6', true),
      api.get('/products'),
    ])
      .then(([s, orders, products]) => {
        setStats(s);
        setRecentOrders(orders.slice(0, 6));
        setLowStock(products.filter((p) => p.stock <= 5).slice(0, 8));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Tableau de bord">
      {loading ? (
        <div className="page-loader">
          <div className="spinner spinner-dark" />
          Chargement...
        </div>
      ) : (
        <>
          {/* Revenue banner */}
          <div className="revenue-highlight">
            <div>
              <div className="revenue-highlight-label">Chiffre d'affaires total</div>
              <div className="revenue-highlight-value">
                {(stats?.revenue ?? 0).toLocaleString('fr-MA')} MAD
              </div>
              <div className="revenue-highlight-sub">Commandes confirmées + livrées</div>
            </div>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>

          {/* Stats grid */}
          <div className="stats-grid">
            <div className="stat-card stat-card-blue">
              <div className="stat-icon stat-icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats?.total ?? 0}</h3>
                <p>Total commandes</p>
              </div>
            </div>

            <div className="stat-card stat-card-yellow">
              <div className="stat-icon stat-icon-yellow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats?.pending ?? 0}</h3>
                <p>En attente</p>
              </div>
            </div>

            <div className="stat-card stat-card-green">
              <div className="stat-icon stat-icon-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats?.confirmed ?? 0}</h3>
                <p>Confirmées</p>
              </div>
            </div>

            <div className="stat-card stat-card-purple">
              <div className="stat-icon stat-icon-purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats?.delivered ?? 0}</h3>
                <p>Livrées</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="quick-actions">
            <Link to="/admin/produits/nouveau" className="quick-action-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nouveau produit
            </Link>
            <Link to="/admin/categories/nouvelle" className="quick-action-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nouvelle catégorie
            </Link>
            <Link to="/admin/commandes" className="quick-action-btn quick-action-outline">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              Commandes
              {(stats?.pending ?? 0) > 0 && (
                <span className="quick-action-badge">{stats.pending}</span>
              )}
            </Link>
            <Link to="/admin/produits" className="quick-action-btn quick-action-outline">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              </svg>
              Produits
            </Link>
            <a href="/" target="_blank" rel="noreferrer" className="quick-action-btn quick-action-outline">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Voir la boutique
            </a>
          </div>

          {/* Dashboard body */}
          <div className="dashboard-grid">
            {/* Recent orders */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Commandes récentes</h2>
                <Link to="/admin/commandes" className="btn btn-outline btn-sm">
                  Voir toutes
                </Link>
              </div>
              <div className="table-wrap">
                {recentOrders.length === 0 ? (
                  <div className="empty-table">Aucune commande pour le moment</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>N° Commande</th>
                        <th>Client</th>
                        <th>Ville</th>
                        <th>Total</th>
                        <th>Statut</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                            {o.orderNumber}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{o.customer.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              {o.customer.phone}
                            </div>
                          </td>
                          <td>{o.customer.city}</td>
                          <td style={{ fontWeight: 700 }}>{o.total.toFixed(2)} MAD</td>
                          <td>
                            <span className={`badge ${STATUS_COLORS[o.status]}`}>
                              {STATUS_LABELS[o.status]}
                            </span>
                          </td>
                          <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                            {new Date(o.createdAt).toLocaleDateString('fr-MA')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Low stock */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>
                  Stock faible
                  {lowStock.length > 0 && (
                    <span className="low-stock-count">{lowStock.length}</span>
                  )}
                </h2>
                <Link to="/admin/produits" className="btn btn-outline btn-sm">
                  Gérer
                </Link>
              </div>
              {lowStock.length === 0 ? (
                <div className="empty-table">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" strokeWidth="1.5" style={{ marginBottom: 8 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <br />
                  Tous les produits sont bien stockés
                </div>
              ) : (
                <ul className="low-stock-list">
                  {lowStock.map((p) => (
                    <li key={p._id} className="low-stock-item">
                      <img src={p.image} alt={p.name} className="low-stock-img" />
                      <div className="low-stock-info">
                        <div className="low-stock-name">{p.name}</div>
                        <div className="low-stock-meta">{p.category?.name || '—'}</div>
                      </div>
                      <span className={`low-stock-badge ${p.stock === 0 ? 'low-stock-out' : 'low-stock-warn'}`}>
                        {p.stock === 0 ? 'Rupture' : `${p.stock} rest.`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
