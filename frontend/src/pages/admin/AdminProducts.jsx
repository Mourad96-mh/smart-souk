import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get('/products')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer "${product.name}" ?`)) return;
    setDeleting(product._id);
    try {
      await api.delete(`/products/${product._id}`, true);
      setProducts((p) => p.filter((x) => x._id !== product._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Produits">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{products.length} produit{products.length !== 1 ? 's' : ''}</h2>
          <div className="admin-card-header-actions">
            <div className="search-input-wrap" style={{ minWidth: 220 }}>
              <span className="search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/admin/produits/nouveau" className="btn btn-primary btn-sm">
              + Nouveau produit
            </Link>
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="page-loader">
              <div className="spinner spinner-dark" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-table">
              {products.length === 0 ? 'Aucun produit. Ajoutez-en un !' : 'Aucun résultat'}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Vedette</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.image} alt={p.name} className="table-product-img" />
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 200 }}>{p.name}</td>
                    <td>
                      <span className="badge badge-category">
                        {p.category?.name || '—'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{p.price.toFixed(2)} MAD</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: p.stock === 0 ? 'var(--danger)' : p.stock <= 5 ? 'var(--warning)' : 'var(--success)',
                        }}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      {p.featured ? (
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Oui</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Non</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/produits/${p._id}/modifier`}
                          className="btn btn-outline btn-sm"
                        >
                          Modifier
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p)}
                          disabled={deleting === p._id}
                        >
                          {deleting === p._id ? '...' : 'Supprimer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
