import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/productCard";
import { supabase } from "../supabase";

function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamValue = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParamValue);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortOrder, setSortOrder] = useState("");

  // Sync search input if URL search parameter changes
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // ✅ MERGED MAIN CATEGORIES
  const mainCategories = [
    "All",
    "FACE",
    "BODY",
    "HAIR",
    "BABY & MOM",
    "FOOD SUPPLEMENTS",
    "DIETARY SUPPLEMENTS",
    "HYGIENE",
    "MEN",
    "SUN CARE",
    "MAKEUP",
    "PROMO",
  ];

  const categoryLabels = {
    All: "Tous",
    FACE: "Visage",
    BODY: "Corps",
    HAIR: "Cheveux",
    "BABY & MOM": "Bébés & Maman",
    "FOOD SUPPLEMENTS": "Compléments alimentaires",
    "DIETARY SUPPLEMENTS": "Suppléments diététiques",
    HYGIENE: "Hygiène",
    MEN: "Homme",
    "SUN CARE": "Soin solaire",
    MAKEUP: "Maquillage",
    PROMO: "Promo",
  };

  // Short labels to keep the category nav compact
  const categoryShortLabels = {
    All: "Tous",
    FACE: "Visage",
    BODY: "Corps",
    HAIR: "Cheveux",
    "BABY & MOM": "Bébés",
    "FOOD SUPPLEMENTS": "Compléments",
    "DIETARY SUPPLEMENTS": "Suppléments",
    HYGIENE: "Hygiène",
    MEN: "Homme",
    "SUN CARE": "Solaire",
    MAKEUP: "Maquillage",
    PROMO: "Promo",
  };

  // ✅ MERGED SUBCATEGORIES
  const subcategories = {
    FACE: [
      "Soins hydratants et nourrissants",
      "Anti-âge & anti-rides",
      "Maquillage",
      "Démaquillants & nettoyants visage",
      "Peaux grasses, mixtes & anti-acné",
      "Masques & gommages visage",
      "Anti-rougeurs & peaux sensibles",
    ],

    BODY: [
      "Hydratation & nutrition du corps",
      "Soin des pieds",
      "Épilation",
      "Soins amincissants",
      "Soins du corps",
      "Soins des articulations",
    ],

    "BABY & MOM": [
      "Équipement bébé",
      "Bain & soins bébé",
      "Change bébé",
      "Coffrets & cadeaux bébé",
      "Compléments bébé & enfants",
      "Poux & lentes",
    ],

    "FOOD SUPPLEMENTS": [
      "Vitamines",
      "Oméga & acides gras",
      "Protéines",
      "Minéraux",
      "Antioxydants",
    ],

    "DIETARY SUPPLEMENTS": [
      "Vitamines",
      "Oméga & acides gras",
      "Protéines",
      "Minéraux",
      "Antioxydants",
    ],

    HYGIENE: [
      "Désinfectants mains",
      "Savons & désinfectants",
      "Hygiène intime",
      "Soins des mains",
    ],

    All: ["Tous"],
  };

  // Load products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setLoadError("");

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (err) {
        setLoadError(err.message || "Impossible de charger les produits.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Apply filters & sorting
  useEffect(() => {
    let results = products.filter((product) => {
      const productCategory = String(product.category || "").toLowerCase().trim();
      const productSubcategory = String(product.subcategory || "").toLowerCase().trim();
      const query = String(searchTerm || "").toLowerCase().trim();

      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        String(product.description || "").toLowerCase().includes(query) ||
        productCategory.includes(query) ||
        productSubcategory.includes(query);

      const matchesCategory =
        selectedCategory === "All" || productCategory === selectedCategory.toLowerCase().trim();

      const matchesSubcategory =
        selectedSubcategory === "All" || productSubcategory === selectedSubcategory.toLowerCase().trim();

      const price = Number(product.price) || 0;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
    });

    if (sortOrder === "price-asc") {
      results.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    setFilteredProducts(results);
  }, [products, searchTerm, selectedCategory, priceRange, sortOrder]);

  return (
    <div className="container-fluid py-4">
      {/* Horizontal category nav */}
      <section className="mb-4 border-bottom">
        <div className="category-nav">
          {mainCategories.map((category, index) => (
            <button
              key={index}
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedSubcategory("All");
              }}
            >
              {categoryShortLabels[category] || categoryLabels[category] || category}
            </button>
          ))}
        </div>
      </section>

      <div className="row">
        {/* LEFT SIDEBAR */}
        <div className="col-md-3 mb-4">
          {/* Subcategories */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              {selectedCategory === "All" ? "CATÉGORIES" : (categoryLabels[selectedCategory] || selectedCategory)}
            </div>

            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {(subcategories[selectedCategory] || subcategories["All"]).map(
                  (subcat, index) => (
                    <li
                      key={index}
                      className={`list-group-item border-0 py-2 px-3 ${
                        selectedSubcategory === subcat ? "bg-light fw-bold" : ""
                      }`}
                      onClick={() => setSelectedSubcategory(subcat)}
                      style={{ cursor: "pointer" }}
                    >
                      {subcat}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Filters */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-light fw-bold">FILTRES</div>
            <div className="card-body">
              {/* Search */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Recherche</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  Prix (TND)
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Trier par</label>
                <select
                  className="form-select form-select-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Par défaut</option>
                  <option value="price-asc">Prix : du plus bas au plus élevé</option>
                  <option value="price-desc">Prix : du plus élevé au plus bas</option>
                </select>
              </div>

              <div className="border-top pt-2">
                <small className="text-muted">
                  {filteredProducts.length} produit(s) trouvé(s)
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary fw-bold mb-0">
              {selectedCategory === "All" ? "TOUS LES PRODUITS" : categoryLabels[selectedCategory] || selectedCategory}
            </h2>

            {selectedSubcategory !== "All" && (
              <span className="badge bg-secondary fs-6">
                {selectedSubcategory}
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="card shadow-sm bg-white p-5 border-0">
                <h4 className="text-secondary mb-3">Chargement des produits...</h4>
              </div>
            </div>
          ) : loadError ? (
            <div className="text-center py-5">
              <div className="card shadow-sm bg-white p-5 border-0">
                <h4 className="text-danger mb-3">Erreur de chargement</h4>
                <p className="text-muted">{loadError}</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <div className="card shadow-sm bg-white p-5 border-0">
                <h4 className="text-secondary mb-3">Aucun produit trouvé</h4>
                <p className="text-muted">
                  Ajustez vos critères de recherche ou vos filtres pour trouver ce que vous recherchez.
                </p>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-sm-6 col-lg-4 col-xl-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalogue;
