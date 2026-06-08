//les imports 
//use state gerer les valeur du champs email password
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//from data contient ce que l'utilisateur tape 
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
//met a jour les inputs 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      //e target name houwa l email wala pass wala confirm pass
      [e.target.name]: e.target.value
    });
  };
// when the user clicks on create account
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { email, password, confirmPassword } = formData;
// verifie si les champs are full or not
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Check if user exists
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      const parsedUser = JSON.parse(existingUser);
      if (parsedUser.email === email) {
        setError("An account with this email already exists.");
        return;
      }
    }

    // Save user to localstorage
    const user = {
      email,
      password,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("loggedIn", "true");
    
    // Redirect to home
    navigate("/");
  };

  return (
    <div className="container py-5">
      {/* Top Navigation */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center py-2">
          <div className="text-muted small">
            <i className="bi bi-geo-alt me-1"></i>
            PARAPHARMACIE EN LIGNE
          </div>
          <div className="d-flex align-items-center">
            <Link to="/" className="text-decoration-none me-2">
              <i className="bi bi-house me-1"></i>
              Accueil
            </Link>
            <span className="text-muted mx-2">|</span>
            <span className="ms-2 text-primary fw-semibold">S'inscrire</span>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <h1 className="h4 text-center fw-bold text-dark mb-1">
                JE N'AI PAS DE COMPTE, INSCRIPTION
              </h1>
              <p className="text-center text-muted small mb-0">
                Créez votre compte parapharmacie
              </p>
            </div>

            <div className="card-body px-4 px-md-5 py-4">
              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-uppercase mb-2">
                    Entrez votre e-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control py-3"
                    placeholder="votre.email@exemple.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-uppercase mb-2">
                    Entrez votre mot de passe
                  </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control py-3"
                      placeholder="Au moins 6 caractères"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-uppercase mb-2">
                    Confirmez votre mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control py-3"
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger small py-2 mb-4" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Create Account Button */}
                <div className="mb-4">
                  <button type="submit" className="btn btn-success w-100 py-3 fw-bold text-uppercase">
                    CRÉER UN COMPTE
                  </button>
                </div>

                {/* Divider */}
                <div className="position-relative text-center my-4">
                  <hr />
                  <span className="bg-white px-3 text-muted position-absolute top-50 start-50 translate-middle small">
                    OU
                  </span>
                </div>

                {/* Facebook Button */}
                <div className="mb-4">
                  <button type="button" className="btn btn-outline-primary w-100 py-3">
                    <i className="bi bi-facebook me-2"></i>
                    Se connecter avec Facebook
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-3">
                  <p className="mb-0 small">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-bold text-decoration-none">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-award text-primary me-2"></i>
                Avantages de la création d'un compte
              </h6>
              <ul className="list-unstyled small mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Paiement plus rapide avec informations enregistrées
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Suivre l'historique de vos commandes
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Accès à des offres et promotions exclusives
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Enregistrer des produits dans votre liste de souhaits
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}