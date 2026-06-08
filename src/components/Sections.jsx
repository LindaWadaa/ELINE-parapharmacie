import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import ProduitCard from './ProduitCard';
import styles from './Sections.module.css';

const AUDIENCES = [
  {
    id: 'bebes',
    title: 'Bébés (0-3 ans)',
    subtitle: 'La douceur pure pour les premiers instants de la vie.',
    icon: 'bi-baby-carriage',
    dbValue: 'Bébés (0-3 ans)',
    subcategories: ['All', 'Crèmes / soins', 'Cuillères / accessoires', 'Vêtements', 'Matériel']
  },
  {
    id: 'enfants',
    title: 'Enfants (3-12 ans)',
    subtitle: 'Tout pour les accompagner dans leur croissance et leurs jeux.',
    icon: 'bi-balloon-heart',
    dbValue: 'Enfants (3-12 ans)',
    subcategories: ['All', 'Crèmes / soins', 'Chaussures', 'Vêtements', 'Bien-être']
  },
  {
    id: 'femmes',
    title: 'Femmes',
    subtitle: 'Des rituels de beauté et de bien-être qui révèlent votre éclat.',
    icon: 'bi-flower1',
    dbValue: 'Femmes',
    subcategories: ['All', 'Crèmes / soins', 'Maquillages', 'Nature', 'Bien-être']
  },
  {
    id: 'hommes',
    title: 'Hommes',
    subtitle: 'Soins quotidiens et essentiels conçus pour la vitalité masculine.',
    icon: 'bi-shield-shaded',
    dbValue: 'Hommes',
    subcategories: ['All', 'Crèmes / soins', 'Bien-être', 'Routine du matin']
  },
  {
    id: 'seniors',
    title: 'Personnes âgées',
    subtitle: 'Le confort, l\'autonomie et la forme au fil des années.',
    icon: 'bi-heart-pulse-fill',
    dbValue: 'Personnes âgées',
    subcategories: ['All', 'Crèmes / soins', 'Matériel', 'Claquettes / chaussons', 'Bien-être']
  }
];

// 🎨 PREMIUM CUSTOM GREEN INLINE SVGS FOR SECTION HEADERS
const CategoryIcon = ({ id, size = 32, color = "#2e7d32" }) => {
  switch (id) {
    case 'bebes':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4" />
          <path d="M9 6h6" />
          <circle cx="12" cy="14" r="6" />
          <path d="M12 8v6M8 12h8" />
        </svg>
      );
    case 'enfants':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12Z" />
          <path d="M12 15c-1 2-2 3-2 5a2 2 0 0 0 4 0c0-2-1-3-2-5Z" />
        </svg>
      );
    case 'femmes':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8 6 8 11 12 14c4-3 4-8 0-12Z" />
          <path d="M12 14c-4-2-9-1-10 2 2 4 7 4 10-2Z" />
          <path d="M12 14c4-2 9-1 10 2-2 4-7 4-10-2Z" />
        </svg>
      );
    case 'hommes':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="M12 6v10M8 10h8" />
        </svg>
      );
    case 'seniors':
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

function Sections({ onOrderClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    bebes: 'All',
    enfants: 'All',
    femmes: 'All',
    hommes: 'All',
    seniors: 'All'
  });

  // Load products from Supabase or Fallback
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        setProducts(data || []);
      } catch { } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Scroll Reveal Observer
  const sectionRefs = useRef({});
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealed);
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentRefs = sectionRefs.current;
    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [loading, products]);

  const handleFilterChange = (audienceId, subcat) => {
    setActiveFilters((prev) => ({
      ...prev,
      [audienceId]: subcat
    }));
  };

  const getFilteredProducts = (dbCategory, filterValue) => {
    const sectionProducts = products.filter(p => p.category_public === dbCategory);
    if (filterValue === 'All') return sectionProducts;
    return sectionProducts.filter(p => p.subcategory === filterValue);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className="fw-semibold">Chargement des espaces bien-être...</p>
      </div>
    );
  }

  return (
    <div className={styles.sectionsContainer}>
      {AUDIENCES.map((audience) => {
        const filtered = getFilteredProducts(audience.dbValue, activeFilters[audience.id]);

        return (
          <section
            key={audience.id}
            id={audience.id}
            ref={(el) => (sectionRefs.current[audience.id] = el)}
            className={`${styles.section} ${styles.reveal}`}
          >
            {/* Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.iconWrapper}>
                <CategoryIcon id={audience.id} size={32} color="#2e7d32" />
              </div>
              <h2 className={styles.sectionTitle}>{audience.title}</h2>
              <p className={styles.sectionSubtitle}>{audience.subtitle}</p>
            </div>

            {/* Subcategory tabs */}
            <div className={styles.tabsContainer}>
              {audience.subcategories.map((subcat) => (
                <button
                  key={subcat}
                  className={`${styles.tab} ${
                    activeFilters[audience.id] === subcat ? styles.activeTab : ''
                  }`}
                  onClick={() => handleFilterChange(audience.id, subcat)}
                >
                  {subcat === 'All' ? 'Tous les produits' : subcat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className={styles.grid}>
              {filtered.length > 0 ? (
                filtered.map((prod) => (
                  <ProduitCard
                    key={prod.id}
                    product={prod}
                    onOrderClick={onOrderClick}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <i className="bi bi-patch-exclamation-fill"></i>
                  <h5>Aucun produit disponible</h5>
                  <p className="text-muted small">
                    Nous mettons régulièrement à jour notre catalogue. Repassez plus tard !
                  </p>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default Sections;
