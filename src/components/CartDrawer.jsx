import React from 'react';
import { useCart } from './CartContext';
import styles from './CartDrawer.module.css';

function CartDrawer() {
  const { 
    cart, 
    total, 
    cartCount, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart,
    openOrderModal 
  } = useCart();

  if (!isCartOpen) return null;

  // Image Fallback
  const handleImageError = (e) => {
    e.target.src = `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=80`;
  };

  const handleCheckout = () => {
    closeCart();
    openOrderModal(); // Open order modal for the entire cart (no specific product passed)
  };

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <i className="bi bi-cart3 text-success"></i>
            Mon Panier
            <span className={styles.itemCount}>{cartCount}</span>
          </h2>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Fermer">
            <i className="bi bi-chevron-right fs-5"></i>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <i className={`bi bi-basket2 ${styles.emptyIcon}`}></i>
              <h5>Votre panier est vide</h5>
              <p className="text-muted small">
                Il semblerait que vous n'ayez pas encore ajouté de soins à votre sélection.
              </p>
              <button className={styles.exploreBtn} onClick={closeCart}>
                Continuer mes achats
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <img
                  src={item.image_url || (item.images && item.images[0]) || `https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=100&q=80`}
                  alt={item.name}
                  className={styles.itemImage}
                  onError={handleImageError}
                />
                <div className={styles.itemDetails}>
                  <h4 className={styles.itemName}>{item.name}</h4>
                  <span className={styles.itemPrice}>
                    {item.price.toFixed(2)} TND
                  </span>
                  
                  <div className={styles.itemControls}>
                    <div className={styles.quantitySelector}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className={styles.qtyText}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => removeFromCart(item.id)}
                      title="Supprimer l'article"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Sous-total</span>
              <span className={styles.totalVal}>{parseFloat(total).toFixed(2)} TND</span>
            </div>
            
            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={handleCheckout}
            >
              <i className="bi bi-credit-card-2-back-fill"></i>
              Passer la commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
