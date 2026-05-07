import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../utils/api';

export default function AdminSettings() {
  const currentUsername = localStorage.getItem('adminUsername') || '';

  const [form, setForm] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.currentPassword) {
      return setError('Le mot de passe actuel est requis');
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      return setError('Les nouveaux mots de passe ne correspondent pas');
    }
    if (!form.username && !form.newPassword) {
      return setError('Aucune modification à enregistrer');
    }

    const payload = { currentPassword: form.currentPassword };
    if (form.username) payload.username = form.username;
    if (form.newPassword) payload.newPassword = form.newPassword;

    setLoading(true);
    try {
      const res = await api.patch('/auth/profile', payload, true);
      setSuccess(res.message);
      if (res.username) localStorage.setItem('adminUsername', res.username);
      setForm({ username: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Paramètres du compte">
      <div className="admin-form-page">
        <div className="admin-form-card">
          <h2>Modifier mes identifiants</h2>

          <div style={{ marginBottom: 'var(--space-6)', padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Compte actuel : <strong style={{ color: 'var(--color-text)' }}>{currentUsername}</strong>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nouveau nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handle}
                placeholder="Laisser vide pour ne pas modifier"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Mot de passe actuel *</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handle}
                placeholder="Requis pour confirmer toute modification"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handle}
                placeholder="Laisser vide pour ne pas modifier"
                autoComplete="new-password"
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Minimum 6 caractères
              </span>
            </div>

            <div className="form-group">
              <label>Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handle}
                placeholder="Répétez le nouveau mot de passe"
                autoComplete="new-password"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
