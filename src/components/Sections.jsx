import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import ProduitCard from './ProduitCard';
import { AUDIENCE_PRODUCTS } from '../data/audienceProducts';
import styles from './Sections.module.css';

const AUDIENCE_SUBCATEGORIES = [
  'All',
  'Crèmes / soins',
  'Matériel',
  'Claquettes / chaussons',
  'Bien-être'
];
const MAX_PRODUCTS_PER_SECTION = 6;

const AUDIENCES = [
  {
    id: 'bebes',
    title: 'Bébés',
    subtitle: '0-3 ans',
    icon: 'bi-baby-carriage',
    dbValue: 'Bébés (0-3 ans)',
    subcategories: AUDIENCE_SUBCATEGORIES
  },
  {
    id: 'enfants',
    title: 'Enfants',
    subtitle: '3-12 ans',
    icon: 'bi-balloon-heart',
    dbValue: 'Enfants (3-12 ans)',
    subcategories: AUDIENCE_SUBCATEGORIES
  },
  {
    id: 'femmes',
    title: 'Femmes',
    subtitle: 'Soins & Éclat',
    icon: 'bi-flower1',
    dbValue: 'Femmes',
    subcategories: AUDIENCE_SUBCATEGORIES
  },
  {
    id: 'hommes',
    title: 'Hommes',
    subtitle: 'Performance',
    icon: 'bi-shield-shaded',
    dbValue: 'Hommes',
    subcategories: AUDIENCE_SUBCATEGORIES
  },
  {
    id: 'seniors',
    title: 'Séniors',
    subtitle: 'Santé & Forme',
    icon: 'bi-heart-pulse-fill',
    dbValue: 'Personnes âgées',
    subcategories: AUDIENCE_SUBCATEGORIES
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
      const localProducts = AUDIENCE_PRODUCTS;
      setProducts(localProducts);
      setLoading(false);

      try {
        const request = supabase.from('products').select('*');
        const timeout = new Promise((_, reject) => {
          window.setTimeout(() => reject(new Error('Supabase request timed out')), 5000);
        });
        const { data, error } = await Promise.race([request, timeout]);

        if (error) throw error;

        setProducts([...(data || []), ...localProducts]);
      } catch (error) {
        console.error('Unable to load Supabase homepage products:', error);
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
    const sectionProducts = products.filter((product) => {
      if (product.category_public === dbCategory) return true;

      const text = [
        product.name,
        product.description,
        product.category,
        product.subcategory
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (/(bébé|bebe|biberon|pédiat|pediat|couche)/i.test(text)) {
        return dbCategory === 'Bébés (0-3 ans)';
      }
      if (/(enfant|kids|jouet|école|ecole)/i.test(text)) {
        return dbCategory === 'Enfants (3-12 ans)';
      }
      if (/(homme|masculin|barbe|sport|performance)/i.test(text)) {
        return dbCategory === 'Hommes';
      }
      if (/(femme|féminin|feminin|visage|beauté|beaute|intime)/i.test(text)) {
        return dbCategory === 'Femmes';
      }

      return dbCategory === 'Personnes âgées' && (
        product.category === 'FOOD SUPPLEMENTS' ||
        product.category === 'HYGIENE'
      );
    });
    if (filterValue === 'All') return sectionProducts;
    return sectionProducts.filter(
      (product) => (product.audienceSubcategory || product.subcategory) === filterValue
    );
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
        const filtered = getFilteredProducts(audience.dbValue, activeFilters[audience.id])
          .slice(0, MAX_PRODUCTS_PER_SECTION);

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
