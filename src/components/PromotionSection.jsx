import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { PROMOTION_PRODUCTS } from "../data/promotions";

function PromotionCard({ product, addToCart }) {
  const fallbackImage = "/assets/prod1.webp";
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, new Date(product.expiresAt).getTime() - Date.now())
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, new Date(product.expiresAt).getTime() - Date.now()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [product.expiresAt]);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
  const hours = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return (
    <article className="card h-100 border-0 shadow-sm">
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                  className="card-img-top"
                  style={{ height: 180, objectFit: "cover" }}
                  onError={(event) => {
                    if (event.currentTarget.src.endsWith(fallbackImage)) return;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-danger align-self-start mb-2">-{product.discount_percent}%</span>
                  <div className="small text-danger fw-semibold mb-2">
                    {remaining > 0 ? `Fin dans ${days}j ${hours}:${minutes}:${seconds}` : "Promotion expirée"}
                  </div>
                  <h3 className="h6 fw-bold">{product.name}</h3>
                  <p className="small text-muted flex-grow-1">{product.description}</p>
                  <div className="mb-3">
                    <strong className="text-danger fs-5">{product.price.toFixed(3)} TND</strong>{" "}
                    <del className="text-muted small">{product.originalPrice.toFixed(3)} TND</del>
                    <div className="small text-muted">
                      Économie : {product.discount_amount.toFixed(3)} TND · {product.sourceStock}
                    </div>
                  </div>
                  <button className="btn btn-success w-100" onClick={() => addToCart(product, 1)}>
                    Ajouter au panier
                  </button>
                </div>
    </article>
  );
}

function PromotionSection() {
  const { addToCart } = useCart();

  return (
    <section className="container py-5" id="promotions">
      <div className="rounded-4 p-4 p-md-5 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #176b3a, #49a65a)" }}>
        <div className="mb-4">
          <span className="badge bg-warning text-dark mb-2">OFFRES LIMITÉES</span>
          <h1 className="h3 fw-bold mb-1">Promotions & packs bien-être</h1>
          <p className="mb-0 opacity-75">{PROMOTION_PRODUCTS.length} offres importées avec leurs prix et remises.</p>
        </div>
        <div className="row g-3">
          {PROMOTION_PRODUCTS.map((product) => (
            <div className="col-sm-6 col-lg-4" key={product.id}>
              <PromotionCard product={product} addToCart={addToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromotionSection;
