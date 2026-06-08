import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const CATEGORIES = [
  "FACE", "BODY", "HAIR", "BABY & MOM", "FOOD SUPPLEMENTS",
  "DIETARY SUPPLEMENTS", "HYGIENE", "MEN", "SUN CARE", "MAKEUP", "PROMO",
];

const SUBCATEGORIES = {
  FACE: ["Soins hydratants et nourrissants", "Anti-âge & anti-rides", "Maquillage", "Démaquillants & nettoyants visage", "Peaux grasses, mixtes & anti-acné", "Masques & gommages visage", "Anti-rougeurs & peaux sensibles"],
  BODY: ["Hydratation & nutrition du corps", "Soin des pieds", "Épilation", "Soins amincissants", "Soins du corps", "Soins des articulations"],
  HAIR: ["Shampooings", "Après-shampooings", "Masques capillaires", "Sérums capillaires", "Colorations"],
  "BABY & MOM": ["Équipement bébé", "Bain & soins bébé", "Change bébé", "Coffrets & cadeaux bébé", "Compléments bébé & enfants", "Poux & lentes"],
  "FOOD SUPPLEMENTS": ["Vitamines", "Oméga & acides gras", "Protéines", "Minéraux", "Antioxydants"],
  "DIETARY SUPPLEMENTS": ["Vitamines", "Oméga & acides gras", "Protéines", "Minéraux", "Antioxydants"],
  HYGIENE: ["Désinfectants mains", "Savons & désinfectants", "Hygiène intime", "Soins des mains"],
  MEN: ["Soins visage homme", "Rasage & barbe", "Corps homme"],
  "SUN CARE": ["Protection solaire", "Après-soleil", "Autobronzants"],
  MAKEUP: ["Fond de teint", "Yeux", "Lèvres", "Ongles"],
  PROMO: ["Offres spéciales"],
};

const EMPTY_FORM = {
  name: "", description: "", price: "", category: "FACE",
  subcategory: "", image_url: "", discount_percent: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ── Load products ──────────────────────────────────────────────
  const loadProducts = async (showCountMsg = false) => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      console.log(`Supabase: count=${count}, data.length=${data?.length}`);
      setProducts(data || []);
      if (showCountMsg) {
        showToast(`${data?.length || 0} produit(s) chargés (${count} dans la base)`, "info");
      }
    } catch (err) {
      console.error("Erreur chargement produits:", err?.message || err);
      showToast("Erreur chargement: " + (err?.message || "inconnue"), "error");
    }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  // ── Toast helper ───────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Image upload (base64 direct) ───────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("L'image ne doit pas dépasser 2 Mo", "error");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Lecture du fichier échouée"));
        reader.readAsDataURL(file);
      });
      setForm({ ...form, image_url: dataUrl });
      showToast("Image ajoutée", "success");
    } catch (err) {
      console.error("Erreur upload image:", err?.message || err);
      showToast("Erreur : " + (err?.message || "inconnue"), "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Logout ─────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin");
  };

  // ── Open modal ─────────────────────────────────────────────────
  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "FACE",
      subcategory: product.subcategory || "",
      image_url: product.image_url || "",
      discount_percent: product.discount_percent || "",
    });
    setShowModal(true);
  };

  // ── Save (add / update) ────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      subcategory: form.subcategory,
      image_url: form.image_url,
      discount_percent: form.discount_percent ? parseFloat(form.discount_percent) : null,
    };

    try {
      if (editingProduct) {
        const { data, error, status, statusText } = await supabase
          .from("products")
          .update(payload)
          .eq("id", Number(editingProduct.id));
        if (error) throw error;
        console.log("UPDATE response:", { data, status, statusText });
        showToast("Produit mis à jour avec succès !");
      } else {
        const { data, error, status, statusText } = await supabase
          .from("products")
          .insert([payload]);
        if (error) throw error;
        console.log("INSERT response:", { data, status, statusText });
        showToast("Produit ajouté avec succès !");
      }
      setShowModal(false);
      await loadProducts();
    } catch (err) {
      console.error("Erreur sauvegarde:", err?.message || err);
      showToast("Erreur : " + (err?.message || "inconnue"), "error");
    }
    setSaving(false);
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const { data, error, status, statusText } = await supabase
        .from("products")
        .delete()
        .eq("id", Number(id));
      if (error) throw error;
      console.log("DELETE response:", { data, status, statusText });
      if (data && data.length === 0) {
        console.warn("Aucune ligne supprimée — l'ID", id, "n'existe pas dans Supabase");
      }
      showToast("Produit supprimé !");
      await loadProducts();
    } catch (err) {
      console.error("Erreur suppression:", err?.message || err);
      showToast("Erreur : " + (err?.message || "inconnue"), "error");
    } finally {
      setDeleteId(null);
    }
  };

  // ── Filtered products ──────────────────────────────────────────
  const filtered = products.filter((p) => {
    const cat = (p.category || p.category_public || "").toUpperCase();
    const matchCat = filterCategory === "All" || cat === filterCategory;
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Stats ──────────────────────────────────────────────────────
  const totalProducts = products.length;
  const promoCount = products.filter(p => p.discount_percent > 0).length;
  const categories = [...new Set(products.map(p => p.category || p.category_public).filter(Boolean))].length;

  return (
    <div style={s.page}>
      {/* Responsive styles for admin dashboard */}
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-main { padding: 16px !important; }
          .admin-table-wrap { overflow-x: auto !important; }
          .admin-table { min-width: 600px !important; }
          .admin-filters { flex-direction: column !important; }
          .admin-filters > div { min-width: 100% !important; }
          .admin-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-modal { max-width: 100% !important; margin: 0 8px !important; max-height: calc(100vh - 120px) !important; }
          .admin-overlay { padding: 100px 8px 16px !important; align-items: stretch !important; }
          .admin-topbar { flex-direction: column !important; align-items: stretch !important; }
          .admin-topbar > div:last-child { justify-content: stretch !important; }
          .admin-topbar button { flex: 1 !important; justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .admin-stats { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .admin-stat-card { padding: 12px !important; gap: 10px !important; }
          .admin-row { flex-direction: column !important; }
        }
      `}</style>
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <div style={s.sidebarIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#4ade80" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={s.sidebarTitle}>ELINE Admin</div>
            <div style={s.sidebarSub}>Para</div>
          </div>
        </div>

        <nav style={s.nav}>
          <div style={{ ...s.navItem, ...s.navItemActive }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Tableau de bord
          </div>
          <a href="/" target="_blank" rel="noreferrer" style={{ ...s.navItem, textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Voir le site
          </a>
        </nav>

        <button onClick={handleLogout} style={s.logoutBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Déconnexion
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main" style={s.main}>
        {/* Toast */}
        {toast && (
          <div style={{ ...s.toast, background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(34,197,94,0.95)" }}>
            {toast.type === "error" ? "❌" : "✅"} {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="admin-topbar" style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>Gestion des Produits</h1>
            <p style={s.pageSub}>{totalProducts} produit(s) dans la base</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => loadProducts(true)} style={s.refreshBtn} title="Rafraîchir">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
              </svg>
              Rafraîchir
            </button>
            <button onClick={openAdd} style={s.addBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats" style={s.statsGrid}>
          {[
            { label: "Total produits", value: totalProducts, icon: "📦", color: "#4ade80" },
            { label: "En promotion", value: promoCount, icon: "🏷️", color: "#f59e0b" },
            { label: "Catégories", value: categories, icon: "🗂️", color: "#60a5fa" },
            { label: "Valeur moy.", value: products.length ? (products.reduce((s, p) => s + Number(p.price || 0), 0) / products.length).toFixed(2) + " TND" : "—", icon: "💰", color: "#a78bfa" },
          ].map((stat) => (
            <div key={stat.label} className="admin-stat-card" style={s.statCard}>
              <div style={{ fontSize: "2rem" }}>{stat.icon}</div>
              <div>
                <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="admin-filters" style={s.filtersRow}>
          <div style={s.searchWrap}>
            <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#6b7280" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={s.searchInput}
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={s.select}>
            <option value="All">Toutes catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="admin-table-wrap" style={s.tableWrap}>
          {loading ? (
            <div style={s.center}>
              <div style={s.spinnerLarge} />
              <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "16px" }}>Chargement des produits...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={s.center}>
              <div style={{ fontSize: "3rem" }}>📭</div>
              <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>Aucun produit trouvé</p>
            </div>
          ) : (
            <table className="admin-table" style={s.table}>
              <thead>
                <tr>
                  {["Image", "Nom", "Catégorie", "Sous-catégorie", "Prix", "Promo", "Actions"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} style={s.tr}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={s.td}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} style={s.thumb}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div style={s.thumbPlaceholder}>📦</div>
                      )}
                    </td>
                    <td style={s.td}>
                      <div style={s.productName}>{product.name}</div>
                      <div style={s.productDesc}>{(product.description || "").substring(0, 60)}{product.description?.length > 60 ? "…" : ""}</div>
                    </td>
                    <td style={s.td}>
                      <span style={s.catBadge}>{product.category || product.category_public || "—"}</span>
                    </td>
                    <td style={{ ...s.td, color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
                      {product.subcategory || "—"}
                    </td>
                    <td style={s.td}>
                      <span style={s.price}>{Number(product.price).toFixed(3)} TND</span>
                    </td>
                    <td style={s.td}>
                      {product.discount_percent ? (
                        <span style={s.discountBadge}>-{product.discount_percent}%</span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>—</span>
                      )}
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => openEdit(product)} style={s.editBtn} title="Modifier">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Modifier
                        </button>
                        <button onClick={() => setDeleteId(product.id)} style={s.deleteBtn} title="Supprimer">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="admin-overlay" style={s.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="admin-modal" style={s.modal}>
            {/* Modal Header */}
            <div style={s.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: editingProduct ? "rgba(96,165,250,0.15)" : "rgba(74,222,128,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem"
                }}>
                  {editingProduct ? "✏️" : "➕"}
                </div>
                <div>
                  <h2 style={s.modalTitle}>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</h2>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", margin: 0 }}>
                    {editingProduct ? "Modifiez les informations ci-dessous" : "Remplissez tous les champs obligatoires (*)"}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={s.closeBtn}>✕</button>
            </div>

            <form onSubmit={handleSave} style={s.modalForm}>
              <div style={s.modalBody}>

                {/* ── Section 1 : Infos de base ── */}
                <div style={s.section}>
                  <div style={s.sectionTitle}>
                    <span style={s.sectionDot} />
                    Informations de base
                  </div>
                  <div style={s.row}>
                    <div style={{ ...s.formField, flex: 2 }}>
                      <label style={s.formLabel}>Nom du produit *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ex : Crème hydratante SVR 200ml"
                        style={s.formInput}
                      />
                    </div>
                    <div style={{ ...s.formField, flex: 1 }}>
                      <label style={s.formLabel}>Prix (TND) *</label>
                      <input
                        required
                        type="number"
                        step="0.001"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="Ex : 29.900"
                        style={s.formInput}
                      />
                    </div>
                    <div style={{ ...s.formField, flex: 1 }}>
                      <label style={s.formLabel}>Remise (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={form.discount_percent}
                        onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                        placeholder="Ex : 15"
                        style={s.formInput}
                      />
                    </div>
                  </div>
                </div>

                  {/* ── Section 2 : Catégories ── */}
                  <div style={s.section}>
                    <div style={s.sectionTitle}>
                      <span style={s.sectionDot} />
                      Catégorisation
                    </div>
                  <div className="admin-row" style={s.row}>
                      <div style={{ ...s.formField, flex: 1 }}>
                        <label style={s.formLabel}>Catégorie *</label>
                        <select
                          required
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
                          style={s.formInput}
                        >
                          {CATEGORIES.map(c => (
                            <option key={c} value={c} style={{ color: "#000", background: "#fff" }}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ ...s.formField, flex: 1 }}>
                        <label style={s.formLabel}>Sous-catégorie</label>
                        <select
                          value={form.subcategory}
                          onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                          style={s.formInput}
                        >
                          <option value="" style={{ color: "#000", background: "#fff" }}>— Sélectionner —</option>
                          {(SUBCATEGORIES[form.category] || []).map(sc => (
                            <option key={sc} value={sc} style={{ color: "#000", background: "#fff" }}>{sc}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                {/* ── Section 3 : Image ── */}
                <div style={s.section}>
                  <div style={s.sectionTitle}>
                    <span style={s.sectionDot} />
                    Image du produit
                  </div>
                  <div style={s.imageUploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                    {form.image_url ? (
                      <div style={s.imagePreviewWrap}>
                        <img
                          src={form.image_url}
                          alt="Aperçu"
                          style={s.imagePreview}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={s.changeImageBtn}
                          disabled={uploading}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          {uploading ? "..." : "Modifier"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={s.uploadBtn}
                        disabled={uploading}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        {uploading ? "Téléchargement..." : "Choisir une image"}
                      </button>
                    )}
                    {form.image_url && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
                          ✓ Image ajoutée
                        </span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image_url: "" })}
                          style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.78rem", textDecoration: "underline", padding: 0 }}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Section 4 : Description ── */}
                <div style={s.section}>
                  <div style={s.sectionTitle}>
                    <span style={s.sectionDot} />
                    Description
                  </div>
                  <div style={s.formField}>
                    <label style={s.formLabel}>Description du produit</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Décrivez le produit : ingrédients, bienfaits, utilisation..."
                      rows={4}
                      style={{ ...s.formInput, resize: "vertical", minHeight: "100px", lineHeight: "1.5" }}
                    />
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={s.modalFooter}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }}>
                  {saving
                    ? "⏳ Enregistrement..."
                    : editingProduct
                    ? "💾 Mettre à jour"
                    : "✅ Ajouter le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: "420px", padding: "32px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🗑️</div>
              <h3 style={{ color: "#fff", margin: "0 0 8px", fontSize: "1.2rem" }}>Confirmer la suppression</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", margin: 0, fontSize: "0.9rem" }}>
                Cette action est irréversible. Le produit sera définitivement supprimé.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setDeleteId(null)} style={{ ...s.cancelBtn, flex: 1 }}>Annuler</button>
              <button onClick={() => handleDelete(deleteId)} style={{ ...s.deleteConfirmBtn, flex: 1 }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1a2744 100%)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: "240px",
    minHeight: "100vh",
    background: "rgba(255,255,255,0.04)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    position: "sticky",
    top: 0,
    height: "100vh",
    backdropFilter: "blur(10px)",
    flexShrink: 0,
  },
  sidebarLogo: {
    display: "flex", alignItems: "center", gap: "12px",
    marginBottom: "36px", paddingBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  sidebarIcon: {
    width: "40px", height: "40px",
    background: "rgba(74,222,128,0.15)",
    borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  sidebarTitle: { color: "#fff", fontWeight: "700", fontSize: "0.95rem" },
  sidebarSub: { color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", marginTop: "2px" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  navItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 14px", borderRadius: "10px",
    color: "rgba(255,255,255,0.5)", fontSize: "0.87rem", fontWeight: "500",
    cursor: "pointer", transition: "all 0.15s",
    textDecoration: "none",
  },
  navItemActive: {
    background: "rgba(74,222,128,0.12)",
    color: "#4ade80",
  },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px", color: "#f87171",
    padding: "10px 14px", fontSize: "0.87rem", cursor: "pointer",
    marginTop: "16px", fontWeight: "500",
    transition: "all 0.15s",
  },
  main: { flex: 1, padding: "32px", overflow: "auto", position: "relative" },
  toast: {
    position: "fixed", top: "20px", right: "20px", zIndex: 999999,
    color: "#fff", padding: "14px 20px", borderRadius: "12px",
    fontSize: "0.9rem", fontWeight: "600",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    animation: "fadeIn 0.2s ease",
  },
  topBar: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: "28px", flexWrap: "wrap", gap: "16px",
  },
  pageTitle: { color: "#fff", fontSize: "1.6rem", fontWeight: "800", margin: "0 0 4px", letterSpacing: "-0.5px" },
  pageSub: { color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", margin: 0 },
  refreshBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.8)", borderRadius: "12px",
    padding: "12px 18px", fontSize: "0.9rem", fontWeight: "600",
    cursor: "pointer", whiteSpace: "nowrap",
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff", border: "none", borderRadius: "12px",
    padding: "12px 20px", fontSize: "0.9rem", fontWeight: "700",
    cursor: "pointer", boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
    whiteSpace: "nowrap",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px", marginBottom: "28px",
  },
  statCard: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", padding: "20px",
    display: "flex", alignItems: "center", gap: "16px",
    backdropFilter: "blur(10px)",
  },
  statValue: { fontSize: "1.5rem", fontWeight: "800", lineHeight: 1 },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginTop: "4px" },
  filtersRow: {
    display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap",
  },
  searchWrap: { position: "relative", flex: 1, minWidth: "200px" },
  searchInput: {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
    padding: "10px 14px 10px 40px", color: "#fff", fontSize: "0.875rem",
    outline: "none", boxSizing: "border-box",
  },
  select: {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "10px 14px",
    color: "#fff", fontSize: "0.875rem", outline: "none", cursor: "pointer",
    minWidth: "180px",
  },
  tableWrap: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", overflow: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "14px 16px", textAlign: "left",
    color: "rgba(255,255,255,0.4)", fontSize: "0.75rem",
    fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)",
    whiteSpace: "nowrap",
  },
  tr: { transition: "background 0.15s" },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    color: "#fff", fontSize: "0.875rem",
    verticalAlign: "middle",
  },
  thumb: { width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" },
  thumbPlaceholder: {
    width: "48px", height: "48px", borderRadius: "8px",
    background: "rgba(255,255,255,0.06)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
  },
  productName: { fontWeight: "600", fontSize: "0.875rem", marginBottom: "2px" },
  productDesc: { color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" },
  catBadge: {
    background: "rgba(96,165,250,0.15)", color: "#60a5fa",
    border: "1px solid rgba(96,165,250,0.2)",
    padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600",
    whiteSpace: "nowrap",
  },
  price: { color: "#4ade80", fontWeight: "700", fontSize: "0.9rem" },
  discountBadge: {
    background: "rgba(245,158,11,0.15)", color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.2)",
    padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700",
  },
  editBtn: {
    display: "flex", alignItems: "center", gap: "5px",
    background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)",
    color: "#60a5fa", borderRadius: "8px",
    padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600",
    whiteSpace: "nowrap",
  },
  deleteBtn: {
    display: "flex", alignItems: "center", gap: "5px",
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
    color: "#f87171", borderRadius: "8px",
    padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600",
    whiteSpace: "nowrap",
  },
  center: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "60px 20px",
  },
  spinnerLarge: {
    width: "40px", height: "40px",
    border: "3px solid rgba(255,255,255,0.1)",
    borderTopColor: "#4ade80",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  // Modal
  overlay: {
    position: "fixed", inset: 0, zIndex: 99999,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    display: "flex", alignItems: "flex-start", justifyContent: "center",
    padding: "170px 24px 24px",
    overflowY: "auto",
  },
  modal: {
    background: "linear-gradient(135deg, #1e2d40, #1a2a1a)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "760px",
    maxHeight: "calc(100vh - 194px)",
    overflow: "hidden",
    boxShadow: "0 30px 100px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "22px 28px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    flexShrink: 0,
  },
  modalTitle: { color: "#fff", fontSize: "1.2rem", fontWeight: "700", margin: 0 },
  closeBtn: {
    background: "rgba(255,255,255,0.08)", border: "none",
    color: "rgba(255,255,255,0.6)", borderRadius: "8px",
    width: "32px", height: "32px", cursor: "pointer",
    fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    minHeight: 0,
  },
  modalBody: {
    padding: "22px 28px 8px",
    overflowY: "auto",
    flex: "1 1 auto",
    minHeight: 0,
  },
  section: {
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  sectionTitle: {
    display: "flex", alignItems: "center", gap: "8px",
    color: "rgba(255,255,255,0.55)", fontSize: "0.75rem",
    fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px",
    marginBottom: "14px",
  },
  sectionDot: {
    display: "inline-block", width: "6px", height: "6px",
    borderRadius: "50%", background: "#4ade80", flexShrink: 0,
  },
  row: { display: "flex", gap: "14px", flexWrap: "wrap" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  formField: { display: "flex", flexDirection: "column", gap: "6px" },
  formLabel: {
    color: "rgba(255,255,255,0.6)", fontSize: "0.78rem",
    fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.4px",
  },
  formInput: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "11px 14px",
    color: "#fff", fontSize: "0.9rem",
    outline: "none", width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  imageUploadArea: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
    padding: "24px", borderRadius: "12px",
    border: "2px dashed rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.03)",
    cursor: "pointer", transition: "all 0.2s",
  },
  uploadBtn: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
    background: "none", border: "none", color: "rgba(255,255,255,0.5)",
    cursor: "pointer", padding: "16px", borderRadius: "12px",
    fontSize: "0.85rem", fontWeight: "500",
    transition: "all 0.2s",
  },
  imagePreviewWrap: {
    display: "flex", alignItems: "center", gap: "16px",
    width: "100%",
  },
  imagePreview: {
    width: "80px", height: "80px", borderRadius: "10px",
    objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)",
  },
  changeImageBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.7)", borderRadius: "8px",
    padding: "8px 14px", fontSize: "0.82rem", cursor: "pointer", fontWeight: "500",
  },
  modalFooter: {
    display: "flex", justifyContent: "flex-end", gap: "12px",
    padding: "18px 28px 22px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(16,24,32,0.35)",
    flexShrink: 0,
  },
  cancelBtn: {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.7)", borderRadius: "10px",
    padding: "11px 20px", fontSize: "0.9rem", cursor: "pointer", fontWeight: "600",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none", color: "#fff", borderRadius: "10px",
    padding: "11px 24px", fontSize: "0.9rem", cursor: "pointer", fontWeight: "700",
    boxShadow: "0 4px 15px rgba(34,197,94,0.25)",
  },
  deleteConfirmBtn: {
    background: "rgba(239,68,68,0.9)", border: "none",
    color: "#fff", borderRadius: "10px",
    padding: "11px 24px", fontSize: "0.9rem", cursor: "pointer", fontWeight: "700",
  },
};
