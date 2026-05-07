import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel est le délai de livraison ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Livraison sous 24 à 48h partout au Maroc. Commandez avant 14h pour recevoir le lendemain.' },
    },
    {
      '@type': 'Question',
      name: 'Comment payer ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Paiement uniquement à la livraison en cash. Aucun paiement en ligne requis.' },
    },
    {
      '@type': 'Question',
      name: 'Puis-je modifier ma commande ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, contactez-nous par WhatsApp dans les 2 heures suivant votre commande.' },
    },
    {
      '@type': 'Question',
      name: 'Que faire si je reçois un produit défectueux ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Contactez-nous immédiatement. Nous procédons à un échange ou un remboursement intégral.' },
    },
    {
      '@type': 'Question',
      name: 'Livrez-vous partout au Maroc ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, nous livrons dans toutes les villes du Maroc. Les frais peuvent varier selon la région.' },
    },
    {
      '@type': 'Question',
      name: 'Les produits sont-ils garantis ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Tous nos produits sont sélectionnés avec soin. Satisfaction garantie ou remboursement.' },
    },
  ],
};

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '212600000000';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Bonjour, je m'appelle ${form.name}.\nTél: ${form.phone}\n\n${form.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    setSent(true);
    setForm({ name: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main style={{ flex: 1 }}>
      <Seo
        title="Contact"
        description="Contactez Smart Souk par WhatsApp au +212 660-708240. Disponibles 7j/7. Livraison partout au Maroc sous 24-48h, paiement à la livraison."
        canonical="/contact"
        schema={FAQ_SCHEMA}
      />

      {/* Hero banner */}
      <section className="page-header">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p>Une question ? Notre équipe vous répond sous 24h.</p>
        </div>
      </section>

      {/* Main content */}
      <section className="section">
        <div className="container">
          <div className="contact-layout">

            {/* Left — info */}
            <div className="contact-info">
              <h2>Nos coordonnées</h2>
              <p className="contact-intro">
                Disponibles 7j/7 pour répondre à toutes vos questions.
                Contactez-nous par WhatsApp pour une réponse immédiate.
              </p>

              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.21 2 2 0 012 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 14.92z"/>
                    </svg>
                  </div>
                  <div>
                    <h4>WhatsApp</h4>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                      +{WHATSAPP_NUMBER}
                    </a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <a href="mailto:contact@souk-smart.com">contact@souk-smart.com</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Zone de livraison</h4>
                    <p>Maroc — Livraison nationale</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Horaires</h4>
                    <p>Lun – Sam : 9h à 20h</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      Dimanche : horaires réduits
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ marginTop: 'var(--space-6)', display: 'inline-flex', alignItems: 'center', gap: 10 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contacter sur WhatsApp
              </a>
            </div>

            {/* Right — form */}
            <div className="contact-form-card">
              <h2>Envoyer un message</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                Votre message sera envoyé directement via WhatsApp.
              </p>

              {sent && (
                <div className="contact-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Message envoyé ! Nous vous répondrons rapidement.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nom complet *</label>
                  <input id="name" name="name" type="text" placeholder="Votre nom" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Téléphone *</label>
                  <input id="phone" name="phone" type="tel" placeholder="06 XX XX XX XX" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" rows={5} placeholder="Votre question ou demande..." value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  Envoyer via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
            <div>
              <h2 className="section-title">Questions fréquentes</h2>
              <p className="section-subtitle">Tout ce que vous devez savoir</p>
            </div>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Quel est le délai de livraison ?</h4>
              <p>Livraison sous 24 à 48h partout au Maroc. Commandez avant 14h pour recevoir le lendemain.</p>
            </div>
            <div className="faq-item">
              <h4>Comment payer ?</h4>
              <p>Paiement uniquement à la livraison en cash. Aucun paiement en ligne requis.</p>
            </div>
            <div className="faq-item">
              <h4>Puis-je modifier ma commande ?</h4>
              <p>Oui, contactez-nous par WhatsApp dans les 2 heures suivant votre commande.</p>
            </div>
            <div className="faq-item">
              <h4>Que faire si je reçois un produit défectueux ?</h4>
              <p>Contactez-nous immédiatement. Nous procédons à un échange ou un remboursement intégral.</p>
            </div>
            <div className="faq-item">
              <h4>Livrez-vous partout au Maroc ?</h4>
              <p>Oui, nous livrons dans toutes les villes du Maroc. Les frais peuvent varier selon la région.</p>
            </div>
            <div className="faq-item">
              <h4>Les produits sont-ils garantis ?</h4>
              <p>Tous nos produits sont sélectionnés avec soin. Satisfaction garantie ou remboursement.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
