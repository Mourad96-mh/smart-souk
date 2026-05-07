import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16) var(--space-5)' }}>
      <Seo title="Page introuvable" noindex />
      <div style={{ textAlign: 'center', maxWidth: 520 }}>

        {/* Big 404 */}
        <div style={{
          fontSize: 'clamp(6rem, 20vw, 10rem)',
          fontWeight: 'var(--font-extrabold)',
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-6)',
          userSelect: 'none',
        }}>
          404
        </div>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="12"/>
              <circle cx="11" cy="15" r=".5" fill="var(--color-primary)"/>
            </svg>
          </div>
        </div>

        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
          Page introuvable
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-10)' }}>
          La page que vous recherchez n'existe pas ou a été déplacée.
          Revenez à l'accueil ou parcourez notre catalogue.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Accueil
          </Link>
          <Link to="/produits" className="btn btn-outline btn-lg">
            Voir les produits
          </Link>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-lg">
            ← Retour
          </button>
        </div>

      </div>
    </main>
  );
}
