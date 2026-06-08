import React from 'react';
import { useCart } from '../components/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h2 className="display-4 text-muted mb-3">Your cart is empty</h2>
          <p className="lead text-secondary">Add your product</p>
          <a href="/catalogue" className="btn btn-primary btn-lg mt-3">
            Go to catalogue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">My Cart</h1>

      <div className="row">
        {/* Product list */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              {cart.map(item => (
                <div key={item.id} className="row align-items-center py-3 border-bottom">
                  
                  {/* Image */}
                  <div className="col-md-2 col-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="img-fluid rounded"
                      style={{ maxHeight: '100px', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Details */}
                  <div className="col-md-4 col-9">
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="text-muted small mb-1">{item.category}</p>
                    <p className="text-success fw-bold mb-0">{item.price} DH</p>
                  </div>

                  {/* Quantity */}
                  <div className="col-md-3 col-6 mt-2 mt-md-0">
                    <div className="input-group input-group-sm">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input 
                        type="text" 
                        className="form-control text-center"
                        value={item.quantity}
                        readOnly
                        style={{ maxWidth: '60px' }}
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total + Remove */}
                  <div className="col-md-2 col-4 mt-2 mt-md-0 text-end">
                    <p className="fw-bold mb-2">{(item.price * item.quantity).toFixed(2)} DH</p>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>

            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span className="fw-bold">{total} DH</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success fw-bold">Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span className="h5">Total:</span>
                <span className="h5 text-success fw-bold">{total} DH</span>
              </div>

              <button className="btn btn-success w-100 mb-2">
                <i className="bi bi-check-circle"></i> Checkout
              </button>

              <button 
                className="btn btn-outline-danger w-100"
                onClick={clearCart}
              >
                <i className="bi bi-trash"></i> Clear Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
