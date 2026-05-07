import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-card">
      <Link to={`/produits/${product.slug || product._id}`} className="product-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.featured && <span className="product-featured-tag">Vedette</span>}
      </Link>

      <div className="product-card-body">
        {product.category?.name && (
          <span className="product-category-label">{product.category.name}</span>
        )}
        <Link to={`/produits/${product.slug || product._id}`}>
          <h3>{product.name}</h3>
        </Link>

        <div className="product-card-footer">
          <div className="product-price">
            {product.price.toFixed(2)}<span> MAD</span>
          </div>
          {product.stock > 0 ? (
            <button
              className={`add-to-cart-btn${added ? ' added' : ''}`}
              onClick={handleAdd}
            >
              {added ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Ajouté !
                </>
              ) : 'Ajouter au panier'}
            </button>
          ) : (
            <button className="add-to-cart-btn" disabled>Épuisé</button>
          )}
        </div>
      </div>
    </div>
  );
}
