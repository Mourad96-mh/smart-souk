import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import Seo from '../../components/Seo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/login', form);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', data.username);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Seo title="Connexion Admin" noindex />
      <div className="admin-login-card">
        <div className="logo">
          <img src="/logo.png" alt="Smart Souk" style={{ height: 48, margin: '0 auto var(--space-2)' }} />
          <p>Espace administrateur</p>
        </div>

        <h3>Connexion</h3>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="admin"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
