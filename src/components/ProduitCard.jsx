import React from 'react';
import { useCart } from './CartContext';
import styles from './ProduitCard.module.css';

function ProduitCard({ product, onOrderClick }) {
  const { addToCart } = useCart();

  // Price formatting
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

  const discountPercentage = Number(product.discount_percent) || 0;
  const hasDiscount = discountPercentage > 0;
  const oldPrice = hasDiscount ? (price * 100 / (100 - discountPercentage)).toFixed(2) : null;

  // Image Fallback
  const handleImageError = (e) => {
    e.target.src = `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80`; // beautiful medical/skincare fallback
  };

  const getImageUrl = () => {
    if (product.image_url) return product.image_url;
    if (product.images && product.images.length > 0) return product.images[0];
    return `https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80`;
  };

  return (
    <div className={styles.card}>
      {/* Badges */}
      {hasDiscount && (
        <div className={styles.discountBadge}>
          -{discountPercentage}%
        </div>
      )}
      
      {/* Category Tag */}
      <span className={styles.badge}>
        {product.subcategory || product.category || 'Bien-être'}
      </span>

      {/* Product Image */}
      <div className={styles.imageContainer}>
        <img
          src={getImageUrl()}
          alt={product.name}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        
        <p className={styles.description}>
          {product.description || 'Soin de qualité supérieure pour votre bien-être et votre santé au quotidien.'}
        </p>

        {/* Pricing */}
        <div className={styles.priceContainer}>
          <span className={styles.price}>
            {price.toFixed(2)} TND
          </span>
          {hasDiscount && (
            <span className={styles.oldPrice}>
              {oldPrice} TND
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button 
            type="button"
            className={styles.btnCart}
            onClick={() => addToCart(product)}
            title="Ajouter au panier"
          >
            <i className="bi bi-cart-plus fs-5"></i>
          </button>
          
          <button
            type="button"
            className={styles.btnOrder}
            onClick={() => onOrderClick(product)}
          >
            <i className="bi bi-bag-check-fill"></i>
            Commander
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProduitCard;
