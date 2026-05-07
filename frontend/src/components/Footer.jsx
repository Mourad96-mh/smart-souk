import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/logo.png" alt="Smart Souk" style={{ height: 40, marginBottom: 'var(--space-3)', filter: 'brightness(0) invert(1)' }} />
            <p>
              Votre boutique en ligne multi-catégories. Des produits de qualité livrés
              partout au Maroc. Paiement à la livraison.
            </p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/produits">Tous les produits</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Informations</h4>
            <ul>
              <li>
                <a href="#">Livraison</a>
              </li>
              <li>
                <a href="#">Paiement</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Smart Souk — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
