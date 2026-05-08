import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Smart Souk',
  url: 'https://souk-smart.com',
  telephone: '+212660708240',
  image: 'https://souk-smart.com/logo.png',
  description: 'Boutique en ligne multi-catégories au Maroc. Livraison sous 24-48h. Paiement à la livraison.',
  address: { '@type': 'PostalAddress', addressCountry: 'MA' },
  areaServed: 'MA',
  currenciesAccepted: 'MAD',
  paymentAccepted: 'Cash',
  openingHours: 'Mo-Sa 09:00-20:00',
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Livrez-vous partout au Maroc ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, nous livrons dans toutes les villes du Maroc sous 24 à 48h. Commandez avant 14h pour recevoir le lendemain.' },
    },
    {
      '@type': 'Question',
      name: 'Comment payer ma commande ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Le paiement se fait uniquement à la livraison en cash. Aucun paiement en ligne n\'est requis.' },
    },
    {
      '@type': 'Question',
      name: 'Puis-je retourner un produit ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, si vous recevez un produit défectueux ou non conforme, contactez-nous immédiatement via WhatsApp pour un échange ou remboursement.' },
    },
    {
      '@type': 'Question',
      name: 'Comment suivre ma commande ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Après confirmation de votre commande, notre équipe vous contacte par WhatsApp pour vous communiquer les détails de livraison.' },
    },
  ],
};

const PER_PAGE = 4;
const FAQS = FAQ_SCHEMA.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text }));

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (i) => setOpenFaq((prev) => (prev === i ? null : i));

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=true'),
      api.get('/categories'),
    ])
      .then(([prods, cats]) => {
        setFeatured(prods);
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ flex: 1 }}>
      <Seo
        title="Accueil"
        description="Smart Souk — Boutique en ligne multi-catégories au Maroc. Électronique, maison, mode, sport. Livraison sous 24-48h. Paiement à la livraison."
        keywords="boutique en ligne maroc, achat en ligne maroc, livraison rapide maroc, paiement livraison maroc, électronique maroc, mode maroc, sport maroc, maison maroc"
        canonical="/"
        schema={[HOME_SCHEMA, FAQ_SCHEMA]}
      />
      {/* Hero */}
      <section
        className="hero"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgba(15,23,42,0.96) 0%, rgba(29,78,216,0.82) 55%, rgba(37,99,235,0.22) 100%)',
            'url("https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80")',
          ].join(', '),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-inner">
          <div className="container">
            <div className="hero-content">
              <div className="hero-tag">⚡ Nouveautés chaque semaine</div>
              <h1>
                Tout ce dont vous avez
                <span> besoin, livré chez vous</span>
              </h1>
              <p>
                Des milliers de produits dans toutes les catégories.
                Qualité garantie, livraison sous 24–48h. Payez à la livraison.
              </p>
              <div className="hero-actions">
                <Link to="/produits" className="btn btn-accent btn-lg">
                  Voir tous les produits
                </Link>
                <Link to="/produits" className="hero-btn-outline">
                  Parcourir les catégories
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Mobile-only infinite ticker — sits below hero, outside its background */}
      <div className="hero-ticker">
        <div className="hero-ticker-track">
          <span>🚚 Livraison partout au Maroc sous 24–48h</span>
          <span className="ticker-dot">·</span>
          <span>💳 Paiement à la livraison</span>
          <span className="ticker-dot">·</span>
          <span>✅ Qualité garantie</span>
          <span className="ticker-dot">·</span>
          <span>🚚 Livraison partout au Maroc sous 24–48h</span>
          <span className="ticker-dot">·</span>
          <span>💳 Paiement à la livraison</span>
          <span className="ticker-dot">·</span>
          <span>✅ Qualité garantie</span>
          <span className="ticker-dot">·</span>
        </div>
      </div>

      {/* Trust badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <h4>Livraison rapide</h4>
              <p>Livraison partout au Maroc sous 24-48h</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h4>Paiement à la livraison</h4>
              <p>Payez cash uniquement à la réception</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h4>Produits de qualité</h4>
              <p>Sélection rigoureuse, qualité garantie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories — only shown if categories exist */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Nos catégories</h2>
            <p className="section-subtitle">Trouvez exactement ce que vous cherchez</p>
            <div className="categories-grid">
              {categories.map((cat) => (
                <Link key={cat._id} to={`/produits?category=${cat._id}`} className="category-card">
                  {cat.image && <img src={cat.image} alt={cat.name} className="category-card-bg" />}
                  {!cat.image && (
                    <div className="category-card-icon">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                  )}
                  <div className="category-card-overlay">
                    <h3>{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section
        className="section"
        style={{ background: 'var(--white)', borderTop: '1px solid var(--border)' }}
      >
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Produits vedettes</h2>
              <p className="section-subtitle">Notre sélection du moment</p>
            </div>
            <Link to="/produits" className="btn btn-outline btn-sm">Voir tout</Link>
          </div>

          {loading ? (
            <div className="page-loader">
              <div className="spinner spinner-dark" />
              Chargement...
            </div>
          ) : featured.length === 0 ? (
            <div className="products-empty">
              <h3>Aucun produit vedette pour le moment</h3>
            </div>
          ) : (() => {
            const totalPages = Math.ceil(featured.length / PER_PAGE);
            const slice = featured.slice((page - 1) * PER_PAGE, page * PER_PAGE);
            return (
              <>
                <div className="products-grid">
                  {slice.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        className={`pagination-btn${page === n ? ' active' : ''}`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
            <div>
              <h2 className="section-title">Questions fréquentes</h2>
              <p className="section-subtitle">Tout ce que vous devez savoir</p>
            </div>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '0',
                }}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '18px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: 16,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                    {faq.q}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{
                      flexShrink: 0,
                      color: 'var(--primary)',
                      transition: 'transform 0.2s',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openFaq === i && (
                  <p style={{ margin: '0 0 18px', color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
