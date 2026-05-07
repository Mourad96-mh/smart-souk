import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  featured: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileRef = useRef();

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/categories').then((cats) => {
      setCategories(cats);
      if (!isEdit && cats.length > 0) {
        setForm((f) => ({ ...f, category: cats[0]._id }));
      }
    }).catch(console.error);
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/products/${id}`)
      .then((p) => {
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          category: p.category?._id || p.category,
          stock: String(p.stock),
          featured: p.featured,
        });
        setImagePreview(p.image);
      })
      .catch(console.error)
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const setField = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((er) => ({ ...er, image: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nom requis';
    if (!form.description.trim()) e.description = 'Description requise';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Prix invalide';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = 'Stock invalide';
    if (!isEdit && !imageFile) e.image = 'Image requise';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      let imageUrl = imagePreview;
      let imagePublicId = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploaded = await api.upload(formData);
        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        image: imageUrl,
        ...(imagePublicId && { imagePublicId }),
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload, true);
      } else {
        await api.post('/products', payload, true);
      }

      navigate('/admin/produits');
    } catch (err) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout title={isEdit ? 'Modifier le produit' : 'Nouveau produit'}>
        <div className="page-loader">
          <div className="spinner spinner-dark" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Modifier le produit' : 'Nouveau produit'}>
      <div className="admin-form-page">
        <div className="admin-form-card">
          <h2>{isEdit ? 'Modifier le produit' : 'Ajouter un produit'}</h2>

          <form onSubmit={handleSubmit}>
            {/* Image upload */}
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label>Image du produit {!isEdit && '*'}</label>
              <div
                className={`image-upload-area${imagePreview ? ' has-image' : ''}`}
                onClick={() => fileRef.current.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu" />
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <p>Cliquer pour choisir une image</p>
                    <span>JPG, PNG, WebP — Max 5 Mo</span>
                  </div>
                )}
              </div>
              {errors.image && (
                <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.image}</span>
              )}
              {imagePreview && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 8, color: 'var(--danger)' }}
                  onClick={() => { setImagePreview(''); setImageFile(null); }}
                >
                  Changer l'image
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Nom du produit *</label>
              <input
                type="text"
                value={form.name}
                onChange={setField('name')}
                placeholder="ex: Casque Bluetooth Pro"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={form.description}
                onChange={setField('description')}
                placeholder="Décrivez le produit..."
                rows={4}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && (
                <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.description}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prix (MAD) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={setField('price')}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.price}</span>
                )}
              </div>
              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={setField('stock')}
                  placeholder="0"
                  min="0"
                  className={errors.stock ? 'error' : ''}
                />
                {errors.stock && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.stock}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Catégorie *</label>
              <select value={form.category} onChange={setField('category')}>
                {categories.length === 0 && (
                  <option value="">Aucune catégorie — créez-en une d'abord</option>
                )}
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <label className="checkbox-group">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={setField('featured')}
              />
              <span>Produit vedette (affiché sur la page d'accueil)</span>
            </label>

            <div className="form-actions">
              <Link to="/admin/produits" className="btn btn-outline">
                Annuler
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Sauvegarde...
                  </>
                ) : isEdit ? (
                  'Enregistrer les modifications'
                ) : (
                  'Ajouter le produit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
