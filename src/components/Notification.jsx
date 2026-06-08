import React from 'react';
import { useCart } from './CartContext';


const Notification = () => {
  const { notification } = useCart();

  if (!notification.show) return null;

  // Map type to Bootstrap alert class
  const alertClass = {
    success: 'alert-success',
    danger: 'alert-danger',
    info: 'alert-info',
    warning: 'alert-warning'
  }[notification.type] || 'alert-primary';

  // Map type to Bootstrap icon
  const iconClass = {
    success: 'bi-check-circle-fill',
    danger: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill'
  }[notification.type] || 'bi-bell-fill';

  return (
    <div 
      className={`alert ${alertClass} d-flex align-items-center shadow-lg`}
      role="alert"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <i className={`bi ${iconClass} me-2`} style={{ fontSize: '1.5rem' }}></i>
      <div>{notification.message}</div>
    </div>
  );
};

export default Notification;