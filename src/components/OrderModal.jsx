import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useCart } from './CartContext';
import { supabase } from '../supabase';
import styles from './OrderModal.module.css';

function OrderModal({ product, onClose }) {
  const { cart, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Determine items and total
  const isDirectOrder = !!product;
  const itemsToOrder = isDirectOrder
    ? [{ id: product.id, name: product.name, price: product.price, quantity: 1 }]
    : cart;

  const totalAmount = isDirectOrder
    ? product.price
    : parseFloat(total);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (itemsToOrder.length === 0) {
      setErrorMsg("Votre panier est vide.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            customer_address: formData.address,
            total_amount: totalAmount,
            status: 'pending'
          }
        ])
        .select();

      // If Supabase is not fully configured (e.g. placeholder URL), it will throw or fail.
      // We will handle it by simulating success locally if it looks like a local dev setup
      if (orderError) {
        // If it's a real database error (not connection placeholder), display it
        if (!supabase.supabaseUrl.includes('placeholder')) {
          throw orderError;
        } else {
          console.warn("Supabase client is running with placeholder keys. Simulating success locally.");
        }
      }

      const orderId = orderData && orderData[0] ? orderData[0].id : 'mock-uuid-' + Math.random().toString(36).substring(2, 9);

      // 2. Send email notification via EmailJS
      const itemsList = itemsToOrder
        .map((item) => `${item.name} x${item.quantity} — ${(item.price * item.quantity).toFixed(2)} TND`)
        .join('\n');

      try {
        await emailjs.send(
          'service_e984dyd',
          'template_9040vtq',
          {
            to_email: 'wdaalinda424@gmail.com',
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            customer_address: formData.address,
            items: itemsList,
            total: totalAmount.toFixed(2),
            order_id: orderId,
          },
          'NAJ4Veir8G-lfdliB'
        );
      } catch (emailErr) {
        console.warn('EmailJS failed (order still saved):', emailErr);
      }

      // 3. Insert order items
      const itemsPayload = itemsToOrder.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Only attempt insert if we have a valid client connection
      if (!supabase.supabaseUrl.includes('placeholder')) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsPayload);

        if (itemsError) throw itemsError;
      } else {
        console.log("Mock Order Items Saved:", itemsPayload);
      }

      // 4. Clear cart if we ordered from cart
      if (!isDirectOrder) {
        clearCart();
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Erreur lors de la commande:", err);
      // Fallback: If developer is just testing without database, simulate success so they can demo the flow.
      if (supabase.supabaseUrl.includes('placeholder')) {
        setIsSuccess(true);
        if (!isDirectOrder) clearCart();
      } else {
        setErrorMsg(err.message || "Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
          <i className="bi bi-x-lg"></i>
        </button>

        {!isSuccess ? (
          <>
            <h2 className={styles.title}>
              <i className="bi bi-patch-check text-success"></i>
              {isDirectOrder ? 'Commander ce produit' : 'Finaliser ma commande'}
            </h2>
            <p className={styles.subtitle}>
              Remplissez les informations ci-dessous pour valider votre commande en 1 clic.
            </p>

            {errorMsg && (
              <div className="alert alert-danger py-2 small" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errorMsg}
              </div>
            )}

            {/* Shopping Summary */}
            <div className={styles.summaryBox}>
              <div className={styles.summaryTitle}>
                <span>Récapitulatif</span>
                <span>{itemsToOrder.length} article(s)</span>
              </div>
              
              {itemsToOrder.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{item.name} <strong className="text-success">x{item.quantity}</strong></span>
                  <span>{(item.price * item.quantity).toFixed(2)} TND</span>
                </div>
              ))}

              <div className={styles.totalRow}>
                <span>Total à payer</span>
                <span>{totalAmount.toFixed(2)} TND</span>
              </div>
            </div>

            {/* Delivery Form */}
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  required
                  placeholder="Ex: Mohamed Ali"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  required
                  placeholder="Ex: mohamed.ali@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.input}
                  required
                  placeholder="Ex: 98 765 432"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="address">Adresse de livraison complète</label>
                <textarea
                  id="address"
                  name="address"
                  className={`${styles.input} ${styles.textarea}`}
                  required
                  placeholder="Ex: Rue de la liberté, Appt 4, Lafayette, Tunis"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle fs-5"></i>
                    Confirmer la Commande
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success View */
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <h2 className={styles.successTitle}>Commande Validée !</h2>
            <p className={styles.successText}>
              Merci pour votre confiance. Votre commande a été enregistrée avec succès. 
              Notre équipe vous contactera par téléphone pour confirmer la livraison.
            </p>
            <button className={styles.okBtn} onClick={onClose}>
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderModal;
