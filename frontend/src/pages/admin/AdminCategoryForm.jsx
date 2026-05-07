import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

const EMPTY = { name: '', description: '', image: '', order: 0 };

export default function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/categories`)
      .then((cats) => {
        const cat = cats.find((c) => c._id === id);
        if (cat) setForm({ name: cat.name, description: cat.description || '', image: cat.image || '', order: cat.order || 0 });
      })
      .catch(console.error)
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const setField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nom requis';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/categories/${id}`, form, true);
      } else {
        await api.post('/categories', form, true);
      }
      navigate('/admin/categories');
    } catch (err) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout title={isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}>
        <div className="page-loader"><div className="spinner spinner-dark" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}>
      <div className="admin-form-page">
        <div className="admin-form-card">
          <h2>{isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom de la catégorie *</label>
              <input
                type="text"
                value={form.name}
                onChange={setField('name')}
                placeholder="ex: Électronique, Vêtements, Alimentation..."
                className={errors.name ? 'error' : ''}
                autoFocus
              />
              {errors.name && (
                <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={setField('description')}
                placeholder="Courte description de la catégorie..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Image (URL optionnelle)</label>
              <input
                type="text"
                value={form.image}
                onChange={setField('image')}
                placeholder="https://..."
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Aperçu"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Ordre d'affichage</label>
              <input
                type="number"
                value={form.order}
                onChange={setField('order')}
                min="0"
                style={{ maxWidth: 120 }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Les catégories sont triées par ordre croissant (0 = en premier)
              </span>
            </div>

            <div className="form-actions">
              <Link to="/admin/categories" className="btn btn-outline">
                Annuler
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <><span className="spinner" /> Sauvegarde...</>
                ) : isEdit ? 'Enregistrer' : 'Créer la catégorie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
