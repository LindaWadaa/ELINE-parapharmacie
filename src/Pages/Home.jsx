import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import Sections from '../components/Sections';

// 🎨 PREMIUM CUSTOM GREEN INLINE SVGS FOR ALL CATEGORIES
export const CategoryIcon = ({ id, size = 32, color = "#2e7d32" }) => {
  switch (id) {
    case 'bebes':
      // Cute pacifier for Bébés (0-3 ans)
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4" />
          <path d="M9 6h6" />
          <circle cx="12" cy="14" r="6" />
          <path d="M12 8v6M8 12h8" />
        </svg>
      );
    case 'enfants':
      // Balloon for Enfants (3-12 ans)
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12Z" />
          <path d="M12 15c-1 2-2 3-2 5a2 2 0 0 0 4 0c0-2-1-3-2-5Z" />
        </svg>
      );
    case 'femmes':
      // Lotus flower for Femmes
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8 6 8 11 12 14c4-3 4-8 0-12Z" />
          <path d="M12 14c-4-2-9-1-10 2 2 4 7 4 10-2Z" />
          <path d="M12 14c4-2 9-1 10 2-2 4-7 4-10-2Z" />
        </svg>
      );
    case 'hommes':
      // Active shield for Hommes
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="M12 6v10M8 10h8" />
        </svg>
      );
    case 'seniors':
      // Heart with pulse wave for Séniors
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M6 10h2.5L10 7l2 6 1.5-4h2" />
        </svg>
      );
    default:
      return null;
  }
};

const NAV_CARDS = [
  { id: 'bebes', title: 'Bébés', subtitle: '0-3 ans', color: '#eefbf3' },
  { id: 'enfants', title: 'Enfants', subtitle: '3-12 ans', color: '#f7fdfa' },
  { id: 'femmes', title: 'Femmes', subtitle: 'Soins & Éclat', color: '#eefbf3' },
  { id: 'hommes', title: 'Hommes', subtitle: 'Performance', color: '#f7fdfa' },
  { id: 'seniors', title: 'Séniors', subtitle: 'Santé & Forme', color: '#eefbf3' }
];

function Home() {
  const { openOrderModal } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalogue');
    }
  };

  return (
    <div className="position-relative overflow-hidden w-100">
      {/* HERO SECTION */}
      <section 
        className="py-5 text-center position-relative w-100" 
        style={{ 
          background: 'linear-gradient(180deg, #eafaf1 0%, #ffffff 100%)',
          borderBottom: '1px solid rgba(46, 164, 79, 0.05)'
        }}
      >
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <span className="badge bg-light text-success border px-3 py-2 rounded-pill mb-3 fw-bold tracking-wider uppercase">
            <i className="bi bi-patch-check-fill me-1"></i> Parapharmacie 100% Naturelle & Professionnelle
          </span>
          
          <h1 className="display-4 fw-extrabold text-dark mb-3" style={{ letterSpacing: '-1.5px', fontWeight: 800 }}>
            Votre Espace <span className="text-success" style={{ background: 'linear-gradient(120deg, rgba(184, 235, 176, 0.4) 0%, rgba(184, 235, 176, 0.1) 100%)', padding: '0 8px', borderRadius: '8px' }}>Santé & Bien-être</span>
          </h1>
          
          <p className="lead mx-auto mb-4 text-muted" style={{ maxWidth: '750px', fontSize: '1.15rem', lineHeight: '1.6' }}>
            Découvrez nos soins testés cliniquement, nos compléments et accessoires adaptés à toute la famille. 
            Une expérience sereine, des conseils d'experts et une livraison à domicile en toute simplicité.
          </p>

          {/* 🔍 PREMIUM SITE-WIDE SEARCH BAR */}
          <div className="mx-auto mt-4 mb-3" style={{ maxWidth: '640px' }}>
            <form 
              onSubmit={handleSearchSubmit} 
              className="d-flex shadow-sm rounded-pill p-1.5 bg-white border border-success-subtle"
              style={{
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(46, 164, 79, 0.12)';
                e.currentTarget.style.borderColor = '#2e7d32';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(184, 235, 176, 0.5)';
              }}
            >
              <div className="d-flex align-items-center ps-3 text-muted">
                <i className="bi bi-search fs-5"></i>
              </div>
              <input
                type="text"
                className="form-control border-0 bg-transparent rounded-pill px-2 shadow-none"
                placeholder="Rechercher un produit dans tout le site (biberon, crème, soin...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.98rem', color: '#1b3a24' }}
              />
              <button
                type="submit"
                className="btn btn-primary px-4 py-2.5 rounded-pill fw-bold d-flex align-items-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #4caf50, #2e7d32)', 
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(46, 164, 79, 0.2)'
                }}
              >
                <i className="bi bi-search d-sm-none"></i>
                <span className="d-none d-sm-inline">Rechercher</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* QUICK AUDIENCE NAVIGATION */}
      <section className="container py-5 text-center">
        <h2 className="h4 fw-bold text-muted mb-4 uppercase tracking-wider">
          <i className="bi bi-arrow-down-circle-fill me-2 text-success"></i> Accéder rapidement par profil
        </h2>
        
        <div className="row g-3 justify-content-center">
          {NAV_CARDS.map((card) => (
            <div className="col-6 col-sm-4 col-md-2" key={card.id}>
              <div 
                className="card h-100 border border-success-subtle p-3 text-center cursor-pointer shadow-sm"
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: '20px', 
                  transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  backgroundColor: 'white'
                }}
                onClick={() => scrollToSection(card.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(46, 164, 79, 0.15)';
                  e.currentTarget.style.borderColor = '#2e7d32';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(184, 235, 176, 0.3)';
                }}
              >
                <div 
                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-2"
                  style={{ width: '48px', height: '48px', backgroundColor: '#eafaf1', color: '#2e7d32' }}
                >
                  <CategoryIcon id={card.id} size={26} color="#2e7d32" />
                </div>
                <h3 className="h6 fw-bold mb-0 text-dark">{card.title}</h3>
                <span className="text-muted small">{card.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED CATEGORY SECTIONS */}
      <main className="container-fluid px-0">
        <Sections onOrderClick={openOrderModal} />
      </main>
    </div>
  );
}

export default Home;