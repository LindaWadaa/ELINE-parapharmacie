import React from 'react';

function Header() {
  // Fallback text and layout in case logo fails
  const handleImageError = (e) => {
    console.warn("Logo image failed to load, showing text fallback");
    e.target.style.display = 'none';
    const fallbackElement = document.querySelector('.logo-fallback');
    if (fallbackElement) {
      fallbackElement.style.display = 'flex';
    }
  };

  return (
    <header 
      className="py-3 w-100" 
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #eafaf1 100%)',
        borderBottom: '1px solid rgba(46, 164, 79, 0.1)',
        boxShadow: '0 2px 10px rgba(46, 164, 79, 0.05)'
      }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* Logo and Brand */}
        <div className="d-flex align-items-center position-relative mx-auto">
          {/* Pulsating Brand Icon */}
          <div 
            className="me-3 d-flex align-items-center justify-content-center"
            style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              background: '#ffffff',
              border: '1.5px solid #b8ebb0',
              boxShadow: '0 4px 10px rgba(46, 164, 79, 0.08)'
            }}
          >
            <i className="bi bi-heart-pulse-fill text-success fs-3 floating"></i>
          </div>

          <img
            src="/assets/logo.svg"
            alt="Parapharmacy Plus Logo"
            style={{ 
              height: '60px', 
              objectFit: 'contain',
              maxWidth: '180px'
            }}
            onError={handleImageError}
          />
          
          {/* Text Fallback - Hidden by default, shown if image fails */}
          <div 
            className="logo-fallback flex-column align-items-start ms-2" 
            style={{ display: 'none' }}
          >
            <span className="h3 mb-0 fw-extrabold text-success tracking-wide" style={{ letterSpacing: '-0.5px' }}>
              ELINE
            </span>
            <span className="small text-muted fw-semibold uppercase tracking-wider" style={{ marginTop: '-4px' }}>
              para
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;