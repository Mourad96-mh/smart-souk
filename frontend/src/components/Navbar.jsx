import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';

export default function Navbar({ onCartOpen }) {
  const { count } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeAll = () => { setDropdownOpen(false); setMobileOpen(false); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    closeAll();
  };

  return (
    <>
      <nav className="navbar">
        {/* Announcement bar */}
        <div className="announcement-bar">
          <span>🚚 Livraison partout au Maroc sous 24–48h</span>
          <span className="announcement-sep">|</span>
          <span>💳 Paiement à la livraison</span>
          <span className="announcement-sep">|</span>
          <span>✅ Qualité garantie</span>
        </div>

        {/* Main navbar */}
        <div className="navbar-main">
          <div className="container">
            <NavLink to="/" className="navbar-logo" onClick={closeAll}>
              <img src="/logo.png" alt="Smart Souk" className="navbar-logo-img" />
            </NavLink>

            {/* Search bar */}
            <form className="navbar-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="navbar-search-btn" aria-label="Rechercher">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Rechercher
              </button>
            </form>

            {/* Desktop nav */}
            <ul className="navbar-nav">
              <li><NavLink to="/" end onClick={closeAll}>Accueil</NavLink></li>
              <li><NavLink to="/produits" onClick={closeAll}>Produits</NavLink></li>
              {categories.length > 0 && (
                <li className="nav-dropdown" ref={dropdownRef}>
                  <button
                    className={`nav-dropdown-trigger${dropdownOpen ? ' active' : ''}`}
                    onClick={() => setDropdownOpen((o) => !o)}
                  >
                    Catégories
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="nav-dropdown-menu">
                      <Link to="/produits" className="nav-dropdown-item nav-dropdown-all" onClick={closeAll}>
                        Tous les produits
                      </Link>
                      <div className="nav-dropdown-divider" />
                      {categories.map((cat) => (
                        <Link key={cat._id} to={`/produits?category=${cat._id}`} className="nav-dropdown-item" onClick={closeAll}>
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )}
              <li><NavLink to="/contact" onClick={closeAll}>Contact</NavLink></li>
            </ul>

            <div className="navbar-actions">
              <button className="cart-btn" onClick={onCartOpen}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                Panier
                {count > 0 && <span className="cart-count">{count}</span>}
              </button>
              <button className="navbar-mobile-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
                {mobileOpen ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div className="mobile-backdrop" onClick={closeAll} />
          <div className="mobile-menu">
            <form onSubmit={handleSearch} style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}
              />
              <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '0 14px', cursor: 'pointer' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>
            <NavLink to="/" end className="mobile-nav-item" onClick={closeAll}>Accueil</NavLink>
            <NavLink to="/produits" className="mobile-nav-item" onClick={closeAll}>Tous les produits</NavLink>
            <NavLink to="/contact" className="mobile-nav-item" onClick={closeAll}>Contact</NavLink>
            {categories.length > 0 && (
              <>
                <div className="mobile-nav-section">Catégories</div>
                {categories.map((cat) => (
                  <Link key={cat._id} to={`/produits?category=${cat._id}`} className="mobile-nav-item mobile-nav-sub" onClick={closeAll}>
                    {cat.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
