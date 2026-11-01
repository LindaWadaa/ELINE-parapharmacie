import { useCart } from "../components/CartContext";
import { COFFRET_PRODUCTS } from "../data/coffrets";

export default function Coffrets() {
  const { addToCart } = useCart();

  return (
    <main className="container py-5">
      <header className="mb-4">
        <span className="badge bg-success mb-2">CADEAUX & BIEN-ÊTRE</span>
        <h1 className="fw-bold text-success">Nos coffrets</h1>
        <p className="text-muted">{COFFRET_PRODUCTS.length} coffrets et cadeaux sélectionnés.</p>
      </header>
      <div className="row g-3">
        {COFFRET_PRODUCTS.map((product) => (
          <div className="col-sm-6 col-lg-3" key={product.id}>
            <article className="card h-100 border-0 shadow-sm">
              <img src={product.image_url} alt={product.name} loading="lazy" className="card-img-top" style={{ height: 190, objectFit: "cover" }} />
              <div className="card-body d-flex flex-column">
                <h2 className="h6 fw-bold">{product.name}</h2>
                <p className="small text-muted flex-grow-1">{product.description}</p>
                <div className="mb-3">
                  <strong className="text-success">{product.price.toFixed(3)} TND</strong>
                  {product.originalPrice > product.price && (
                    <del className="text-muted small ms-2">{product.originalPrice.toFixed(3)} TND</del>
                  )}
                </div>
                <button className="btn btn-success w-100" onClick={() => addToCart(product, 1)}>
                  Ajouter au panier
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
}
