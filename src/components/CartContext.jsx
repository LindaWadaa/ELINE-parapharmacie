import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderModal, setOrderModal] = useState({ isOpen: false, product: null });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Open/Close Cart Drawer
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Open/Close Order Modal
  const openOrderModal = (product = null) => setOrderModal({ isOpen: true, product });
  const closeOrderModal = () => setOrderModal({ isOpen: false, product: null });

  // Automatically calculate total
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Display a notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Add a product to the cart. Accepts optional quantity (defaults to 1).
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        showNotification(`Quantité de ${product.name} mise à jour !`, 'info');
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        showNotification(`${product.name} ajouté au panier !`, 'success');
        return [...prevCart, { ...product, quantity }];
      }
    });
    // Auto-open the cart drawer when item is added
    openCart();
  };

  // Remove a product from the cart
  const removeFromCart = (productId) => {
    const product = cart.find((item) => item.id === productId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showNotification(`${product?.name || 'Produit'} supprimé du panier`, 'danger');
  };

  // Update the quantity of a product
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    showNotification('Quantité mise à jour', 'info');
  };

  // Clear the whole cart
  const clearCart = () => {
    setCart([]);
    showNotification('Panier vidé', 'info');
  };

  // Get the total number of items in the cart
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: calculateTotal(),
    cartCount: getCartCount(),
    notification,
    isCartOpen,
    openCart,
    closeCart,
    orderModal,
    openOrderModal,
    closeOrderModal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
