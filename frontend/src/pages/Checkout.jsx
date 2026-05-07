import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';
import { WHATSAPP_NUMBER } from '../config';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nom requis';
    if (!form.phone.trim()) e.phone = 'Téléphone requis';
    else if (!/^[0-9+\s]{8,15}$/.test(form.phone)) e.phone = 'Numéro invalide';
    if (!form.city.trim()) e.city = 'Ville requise';
    if (!form.address.trim()) e.address = 'Adresse requise';
    return e;
  };

  const buildWhatsAppMessage = (orderNumber) => {
    const itemLines = items
      .map((i) => `- ${i.name} x${i.quantity}: ${(i.price * i.quantity).toFixed(2)} MAD`)
      .join('\n');

    return (
      `*Nouvelle Commande Smart Souk*\n` +
      `N° ${orderNumber}\n\n` +
      `*Client:*\n` +
      `Nom: ${form.name}\n` +
      `Téléphone: ${form.phone}\n` +
      `Ville: ${form.city}\n` +
      `Adresse: ${form.address}\n\n` +
      `*Articles:*\n${itemLines}\n\n` +
      `*Total: ${total.toFixed(2)} MAD*\n` +
      `Paiement: Cash à la livraison`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const order = await api.post('/orders', {
        items: items.map((i) => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        customer: form,
        total,
      });

      const message = buildWhatsAppMessage(order.orderNumber);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      clearCart();
      navigate('/');
    } catch (err) {
      alert('Erreur lors de la commande. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  if (items.length === 0) {
    return (
      <main style={{ flex: 1 }}>
        <div className="container" style={{ padding: '64px 20px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: 12 }}>Panier vide</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            Ajoutez des produits avant de passer commande.
          </p>
          <Link to="/produits" className="btn btn-primary">
            Découvrir les produits
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1 }}>
      <div className="checkout-page">
        <div className="container">
          <div className="breadcrumb" style={{ marginBottom: 24 }}>
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--text)' }}>Commander</span>
          </div>

          <h1>Finaliser la commande</h1>

          <div className="checkout-grid">
            {/* Form */}
            <div className="checkout-form-card">
              <h2>Vos informations</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={setField('name')}
                    placeholder="ex: Mohamed Alami"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Numéro de téléphone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={setField('phone')}
                    placeholder="ex: 0612345678"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.phone}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ville *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={setField('city')}
                      placeholder="ex: Casablanca"
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.city}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Adresse complète *</label>
                  <textarea
                    value={form.address}
                    onChange={setField('address')}
                    placeholder="Rue, quartier, numéro..."
                    rows={3}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.address}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-whatsapp btn-lg"
                  style={{ width: '100%', marginTop: 8 }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Commander via WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div>
              <div className="order-summary-card">
                <h2>Récapitulatif</h2>
                {items.map((item) => (
                  <div key={item._id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="summary-item-info">
                      <h4>{item.name}</h4>
                      <p>Qté: {item.quantity}</p>
                    </div>
                    <div className="summary-item-price">
                      {(item.price * item.quantity).toFixed(2)} MAD
                    </div>
                  </div>
                ))}

                <div className="summary-total">
                  <span className="label">Total</span>
                  <span className="amount">{total.toFixed(2)} MAD</span>
                </div>

                <div className="cod-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Cash à la livraison
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
