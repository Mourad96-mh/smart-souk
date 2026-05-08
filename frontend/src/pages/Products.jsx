import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);

    api
      .get(`/products?${params}`)
      .then(setProducts)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [category, search]);

  const setCategory = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set('category', val);
    else next.delete('category');
    setSearchParams(next);
  };

  const setSearch = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set('search', val);
    else next.delete('search');
    setSearchParams(next);
  };

  const activeCategory = categories.find((c) => c._id === category);
  const pageTitle = activeCategory ? activeCategory.name : 'Tous les produits';

  const SITE_URL = 'https://souk-smart.com';

  const seoTitle = activeCategory ? activeCategory.name : 'Tous les produits';
  const seoDesc = activeCategory
    ? `Découvrez notre sélection ${activeCategory.name} — livraison sous 24-48h au Maroc, paiement à la livraison.`
    : 'Tous nos produits disponibles au Maroc. Électronique, maison, mode, sport. Livraison rapide, paiement à la livraison.';
  const seoKeywords = activeCategory
    ? `${activeCategory.name.toLowerCase()}, achat ${activeCategory.name.toLowerCase()} maroc, livraison maroc, paiement livraison`
    : 'produits en ligne maroc, achat en ligne maroc, électronique maroc, mode maroc, maison maroc, sport maroc';

  const breadcrumbSchema = activeCategory
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Produits', item: `${SITE_URL}/produits` },
          { '@type': 'ListItem', position: 3, name: activeCategory.name, item: `${SITE_URL}/produits?category=${activeCategory._id}` },
        ],
      }
    : null;

  return (
    <main style={{ flex: 1 }}>
      <Seo title={seoTitle} description={seoDesc} keywords={seoKeywords} canonical="/produits" schema={breadcrumbSchema} />
      <div className="products-page">
        <div className="container">
          <div className="products-page-header">
            <h1>{pageTitle}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {loading ? '...' : `${products.length} produit${products.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="products-toolbar">
            <div className="search-input-wrap">
              <span className="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              <button
                className={`filter-tab${category === '' ? ' active' : ''}`}
                onClick={() => setCategory('')}
              >
                Tous
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  className={`filter-tab${category === c._id ? ' active' : ''}`}
                  onClick={() => setCategory(c._id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="page-loader">
              <div className="spinner spinner-dark" />
              Chargement...
            </div>
          ) : error ? (
            <div className="products-empty">
              <h3>Erreur de connexion</h3>
              <p style={{ color: 'var(--danger)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{error}</p>
              <p style={{ marginTop: 8 }}>Vérifiez que le backend tourne sur le port 5000</p>
            </div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <h3>Aucun produit trouvé</h3>
              <p>Essayez une autre recherche ou catégorie</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
