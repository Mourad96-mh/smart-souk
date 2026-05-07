import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/categories')
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (cat) => {
    if (!window.confirm(`Supprimer la catégorie "${cat.name}" ?`)) return;
    setDeleting(cat._id);
    try {
      await api.delete(`/categories/${cat._id}`, true);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout title="Catégories">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{categories.length} catégorie{categories.length !== 1 ? 's' : ''}</h2>
          <Link to="/admin/categories/nouvelle" className="btn btn-primary btn-sm">
            + Nouvelle catégorie
          </Link>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="page-loader"><div className="spinner spinner-dark" /></div>
          ) : categories.length === 0 ? (
            <div className="empty-table">
              Aucune catégorie. Créez-en une pour pouvoir ajouter des produits.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Ordre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td style={{ fontWeight: 700 }}>{cat.name}</td>
                    <td>
                      <code style={{ fontSize: '0.8rem', background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>
                        {cat.slug}
                      </code>
                    </td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 280 }}>{cat.description || '—'}</td>
                    <td>{cat.order}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/categories/${cat._id}/modifier`}
                          className="btn btn-outline btn-sm"
                        >
                          Modifier
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(cat)}
                          disabled={deleting === cat._id}
                        >
                          {deleting === cat._id ? '...' : 'Supprimer'}
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
