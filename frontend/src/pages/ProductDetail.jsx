import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import Seo from '../components/Seo';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stockStatus = () => {
    if (!product || product.stock === 0)
      return { dot: 'out-stock', label: 'Rupture de stock', color: 'var(--danger)' };
    if (product.stock <= 5)
      return { dot: 'low-stock', label: `Plus que ${product.stock} en stock`, color: 'var(--warning)' };
    return { dot: 'in-stock', label: 'En stock', color: 'var(--success)' };
  };

  if (loading) {
    return (
      <main style={{ flex: 1 }}>
        <div className="container">
          <div className="page-loader">
            <div className="spinner spinner-dark" />
            Chargement...
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ flex: 1 }}>
        <div className="container" style={{ padding: '64px 20px', textAlign: 'center' }}>
          <h2>Produit introuvable</h2>
          <Link to="/produits" className="btn btn-primary" style={{ marginTop: 16 }}>
            Retour aux produits
          </Link>
        </div>
      </main>
    );
  }

  const stock = stockStatus();
  const slug = product.slug || product._id;
  const SITE_URL = 'https://souk-smart.com';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product._id,
    brand: { '@type': 'Brand', name: 'Smart Souk' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/produits/${slug}`,
      price: product.price,
      priceCurrency: 'MAD',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Smart Souk' },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Produits', item: `${SITE_URL}/produits` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/produits/${slug}` },
    ],
  };

  const productKeywords = [
    product.name,
    product.category?.name,
    `${product.name} maroc`,
    `acheter ${product.name}`,
    'livraison maroc',
    'paiement livraison',
  ].filter(Boolean).join(', ');

  return (
    <main style={{ flex: 1 }}>
      <Seo
        title={product.name}
        description={`${product.name} — ${product.description.slice(0, 120)}. Livraison au Maroc sous 24-48h. Paiement à la livraison.`}
        keywords={productKeywords}
        canonical={`/produits/${slug}`}
        image={product.image}
        type="product"
        schema={[productSchema, breadcrumbSchema]}
      />
      <div className="product-detail">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/produits">Produits</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--text)' }}>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            <div className="product-detail-img">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-detail-info">
              {product.category?.name && (
                <span className="badge badge-category">{product.category.name}</span>
              )}

              <h1>{product.name}</h1>

              <div className="product-detail-price">
                {product.price.toFixed(2)}
                <span> MAD</span>
              </div>

              <p className="product-detail-description">{product.description}</p>

              <div className="stock-indicator">
                <div className={`stock-dot ${stock.dot}`} />
                <span style={{ color: stock.color }}>{stock.label}</span>
              </div>

              {product.stock > 0 && (
                <>
                  <div style={{ marginBottom: 8, fontSize: '0.875rem', fontWeight: 600 }}>
                    Quantité
                  </div>
                  <div className="quantity-selector" style={{ marginBottom: 24 }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
                  </div>

                  <button
                    className={`btn btn-lg ${added ? 'btn-accent' : 'btn-primary'}`}
                    style={{ width: '100%' }}
                    onClick={handleAdd}
                  >
                    {added ? 'Ajouté au panier !' : 'Ajouter au panier'}
                  </button>
                </>
              )}

              <div
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  background: '#d1fae5',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.85rem',
                  color: '#065f46',
                  fontWeight: 600,
                }}
              >
                Paiement Cash à la livraison uniquement
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
