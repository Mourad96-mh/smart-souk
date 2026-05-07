import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ open, onClose }) {
  const { items, total, count, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  // ESC key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const goToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {open && <div className="cart-backdrop" onClick={onClose} />}
      <div className={`cart-panel${open ? ' open' : ''}`} aria-hidden={!open}>
        {/* Header */}
        <div className="cart-panel-header">
          <div className="cart-panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Mon Panier
            {count > 0 && <span className="cart-panel-count">{count}</span>}
          </div>
          <button className="cart-panel-close" onClick={onClose} aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cart-panel-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Votre panier est vide{'\n'}Ajoutez des produits pour commander</p>
              <button className="btn btn-outline btn-sm" onClick={onClose}>
                Continuer les achats
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {items.map((item) => (
                <li key={item._id} className="cart-item">
                  <div className="cart-item-img-wrap">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  </div>
                  <div className="cart-item-info">
                    {item.category?.name && (
                      <span className="cart-item-category">{item.category.name}</span>
                    )}
                    <div className="cart-item-name" title={item.name}>{item.name}</div>
                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Diminuer"
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        aria-label="Augmenter"
                      >+</button>
                      <span className="cart-item-price">
                        {(item.price * item.quantity).toFixed(2)} MAD
                      </span>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Supprimer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-panel-footer">
            <div className="cart-summary">
              <span>{count} article{count !== 1 ? 's' : ''}</span>
              <strong>{total.toFixed(2)} MAD</strong>
            </div>
            <button className="cart-checkout-btn" onClick={goToCheckout}>
              Commander maintenant
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button className="cart-clear-btn" onClick={clearCart}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
              </svg>
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
