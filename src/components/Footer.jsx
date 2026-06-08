function Footer() {
  return (
    <footer
      className="mt-auto py-5"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #eafaf1 100%)",
        borderTop: "1px solid rgba(46, 164, 79, 0.1)",
        color: "#2e7d32",
      }}
    >
      <div className="container">
        <div className="row g-4">

          {/* ── Produits ── */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3" style={{ color: "#1b5e20" }}>Produits</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="/catalogue" className="text-decoration-none" style={{ color: "#388e3c" }}>Promotions</a></li>
              <li><a href="/catalogue" className="text-decoration-none" style={{ color: "#388e3c" }}>Nouveaux Produits</a></li>
              <li><a href="/catalogue" className="text-decoration-none" style={{ color: "#388e3c" }}>Nos coffrets</a></li>
              <li><a href="/catalogue" className="text-decoration-none" style={{ color: "#388e3c" }}>Nos marques</a></li>
            </ul>
          </div>

          {/* ── Information ── */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3" style={{ color: "#1b5e20" }}>Information</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="/about" className="text-decoration-none" style={{ color: "#388e3c" }}>À propos</a></li>
              <li><a href="/contact" className="text-decoration-none" style={{ color: "#388e3c" }}>Contact</a></li>
              <li><a href="/login" className="text-decoration-none" style={{ color: "#388e3c" }}>Connexion</a></li>
              <li><a href="/register" className="text-decoration-none" style={{ color: "#388e3c" }}>Inscription</a></li>
            </ul>
          </div>

          {/* ── Horaires ── */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold mb-3" style={{ color: "#1b5e20" }}>Horaires</h6>
            <div className="small d-flex flex-column gap-2" style={{ color: "#4a5568" }}>
              <div>
                <span className="fw-semibold" style={{ color: "#1b5e20" }}>Nabeul</span>
                <br />24h / 24 &mdash; 7j / 7
              </div>
              <div className="mt-2">
                <span className="fw-semibold" style={{ color: "#1b5e20" }}>Livraison</span>
                <br />Toute la Tunisie
              </div>
            </div>
          </div>

          {/* ── Contact ── */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold mb-3" style={{ color: "#1b5e20" }}>ELINE para</h6>
            <div className="small d-flex flex-column gap-2" style={{ color: "#4a5568" }}>
              <div>Votre parapharmacie en ligne de confiance</div>
              <div>Produits bien-être, beauté et santé</div>
              <div className="mt-2">
                <i className="bi bi-geo-alt me-1" style={{ color: "#2e7d32" }}></i> Nabeul, Tunisie
              </div>
              <div>
                <i className="bi bi-telephone me-1" style={{ color: "#2e7d32" }}></i> 22 155 054
              </div>
            </div>
          </div>

        </div>

        <hr className="my-4" style={{ borderColor: "rgba(46, 164, 79, 0.15)" }} />

        <div className="row">
          <div className="col text-center">
            <p className="small mb-0" style={{ color: "#4a5568" }}>
              &copy; {new Date().getFullYear()} ELINE para. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
