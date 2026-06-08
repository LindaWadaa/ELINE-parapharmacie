import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const imageUrl =
    product.image_url ||
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "") ||
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80";
  const price = Number(product.price) || 0;
  const discountPercentage = Number(product.discount_percent) || 0;

  // Discount Logic
  const hasDiscount = discountPercentage > 0;
  const originalPrice = hasDiscount
    ? (price * 100 / (100 - discountPercentage)).toFixed(3)
    : null;

  // Image Fallback
  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80";
  };

  // Navigation
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="card h-100 shadow-sm border-0"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-danger fs-6">-{discountPercentage}%</span>
        </div>
      )}

      {/* Product Image */}
      <div style={{ height: "200px", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
        <img
          src={imageUrl}
          alt={product.name}
          className="card-img-top"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={handleImageError}
        />
      </div>

      {/* Product Details */}
      <div className="card-body d-flex flex-column p-3">
        <h6 className="card-title text-dark fw-bold mb-2" style={{ fontSize: "0.9rem" }}>
          {product.name}
        </h6>

        <p className="card-text flex-grow-1 text-muted small mb-2">
          {product.description}
        </p>

        <div className="mb-2">
          <span className="badge bg-light text-dark border small">
            {product.category || product.category_public || "Produit"}
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          {hasDiscount ? (
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="fw-bold text-danger fs-5">
                {price.toFixed(3)} TND
              </span>
              <span className="text-muted text-decoration-line-through small">
                {originalPrice} TND
              </span>
            </div>
          ) : (
            <div className="mb-2">
              <span className="fw-bold text-dark fs-5">
                {price.toFixed(3)} TND
              </span>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            className="btn btn-primary w-100 py-2 fw-semibold"
            style={{ fontSize: "0.85rem" }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
