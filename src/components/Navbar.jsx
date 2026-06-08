import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const { cartCount, openCart } = useCart();
  const [animateBadge, setAnimateBadge] = useState(false);

  useEffect(() => {
    const isLogged = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLogged);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  const navLinkClass = "header-nav-pill";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light w-100 px-3 sticky-top"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(46, 164, 79, 0.1)",
        boxShadow: "0 4px 20px rgba(46, 164, 79, 0.04)",
        minHeight: "140px",
        paddingTop: "8px",
        paddingBottom: "8px",
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between gap-3 flex-wrap flex-lg-nowrap">
        <div className="d-flex align-items-center flex-nowrap gap-3 flex-shrink-0">
          <NavLink to="/" className="d-flex align-items-center text-decoration-none me-3 flex-shrink-0">
            <img
              src="/assets/logo.svg"
              alt="Parapharmacy Plus Logo"
              style={{ height: "130px", objectFit: "contain", maxWidth: "350px" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </NavLink>

          <div className="d-none d-lg-flex align-items-center" style={{ gap: "20px" }}>
            <NavLink to="/" className={navLinkClass}>
              Accueil
            </NavLink>
            <NavLink to="/catalogue" className={navLinkClass}>
              Catalogue
            </NavLink>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 ms-auto flex-nowrap justify-content-end">
          {!loggedIn ? (
            <NavLink to="/login" className={navLinkClass}>
              Connexion
            </NavLink>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <NavLink to="/account" className={navLinkClass}>
                Mon Compte
              </NavLink>

              <button
                onClick={handleLogout}
                className="btn btn-danger px-3 py-2 rounded-pill fw-bold"
                style={{ fontSize: "0.95rem", border: "none", background: "#ffebee", color: "#e53935" }}
              >
                Déconnexion
              </button>
            </div>
          )}

          <button
            type="button"
            className="btn btn-light position-relative d-flex align-items-center justify-content-center p-2"
            onClick={openCart}
            style={{
              background: "#eafaf1",
              border: "1px solid rgba(46, 164, 79, 0.2)",
              borderRadius: "12px",
              color: "#2e7d32",
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(46, 164, 79, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <i className="bi bi-cart3 fs-5"></i>
            {cartCount > 0 && (
              <span
                className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success ${
                  animateBadge ? "pulse-green" : ""
                }`}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  padding: "5px 8px",
                  boxShadow: "0 2px 5px rgba(46, 164, 79, 0.3)",
                  transition: "transform 0.15s ease",
                  transform: animateBadge ? "translate(-50%, -50%) scale(1.3)" : "translate(-50%, -50%) scale(1)",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="navbar-toggler border-0 ms-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu"
            aria-controls="menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ background: "#f1fbf5", borderRadius: "10px", padding: "8px" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse w-100 mt-2 mt-lg-0 justify-content-lg-center" id="menu">
          <ul className="navbar-nav flex-column flex-lg-row align-items-lg-center mb-2 mb-lg-0 gap-1">
            <li className="nav-item d-lg-none">
              <NavLink to="/" className={navLinkClass}>
                Accueil
              </NavLink>
            </li>
            <li className="nav-item d-lg-none">
              <NavLink to="/catalogue" className={navLinkClass}>
                Catalogue
              </NavLink>
            </li>
            <li className="nav-item d-lg-none">
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
