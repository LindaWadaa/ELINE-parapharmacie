import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// etats du composant
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
//Cette fonction se déclenche lorsque l’utilisateur clique sur send reset instructions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Veuillez saisir votre adresse e-mail.");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez saisir une adresse e-mail valide.");
      setLoading(false);
      return;
    }
//fausse attente de loading

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const savedUser = JSON.parse(localStorage.getItem("user"));
      
      if (!savedUser) {
        setError("Aucun compte trouvé avec cette adresse e-mail.");
        setLoading(false);
        return;
      }
      if (savedUser.email === email) {
        setSuccess(`Les instructions de réinitialisation du mot de passe ont été envoyées à ${email}`);
        setEmail("");
        
        // Auto-redirect after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setError("Aucun compte trouvé avec cette adresse e-mail.");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
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
            <Link to="/login" className="text-decoration-none me-2">
              Se connecter
            </Link>
            <span className="text-muted mx-2">|</span>
            <span className="ms-2 text-primary fw-semibold">Mot de passe oublié</span>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <div className="text-center">
                <i className="bi bi-key-fill text-primary display-6 mb-3"></i>
                <h1 className="h4 text-center fw-bold text-dark mb-1">
                  MOT DE PASSE OUBLIÉ ?
                </h1>
                <p className="text-center text-muted small mb-0">
                  Saisissez votre e-mail pour réinitialiser votre mot de passe
                </p>
              </div>
            </div>

            <div className="card-body px-4 px-md-5 py-4">
              <form onSubmit={handleSubmit} noValidate>
                {/* Instructions */}
                <div className="alert alert-info small mb-4">
                  <i className="bi bi-info-circle me-2"></i>
                  Saisissez l'adresse e-mail associée à votre compte et nous vous enverrons les instructions pour réinitialiser votre mot de passe.
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-uppercase mb-2">
                    <i className="bi bi-envelope me-2"></i>
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    className="form-control py-3"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <small className="text-muted mt-1 d-block">
                    Saisissez l'e-mail que vous avez utilisé lors de la création de votre compte
                  </small>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger small py-2 mb-4" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="alert alert-success small py-2 mb-4" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                      {success}
                    <div className="mt-2">
                      <small>Vous serez redirigé vers la page de connexion dans 5 secondes...</small>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mb-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 fw-bold text-uppercase"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ENVOI EN COURS...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        ENVOYER LES INSTRUCTIONS DE RÉINITIALISATION
                      </>
                    )}
                  </button>
                </div>

                {/* Back to Login */}
                <div className="text-center pt-3">
                  <p className="mb-0 small">
                    Vous vous souvenez de votre mot de passe ?{" "}
                    <Link to="/login" className="text-primary fw-bold text-decoration-none">
                      Retour à la connexion
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Card Footer */}
            <div className="card-footer bg-light border-0 py-3">
              <div className="text-center">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Votre e-mail est en sécurité avec nous. Nous ne le partagerons jamais.
                </small>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-question-circle text-primary me-2"></i>
                Besoin d'aide ?
              </h6>
              <ul className="list-unstyled small mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Vérifiez votre dossier spam si vous ne recevez pas d'e-mail
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Assurez-vous de saisir l'e-mail que vous avez utilisé pour vous inscrire
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Toujours des problèmes ? Contactez le support à support@parapharmacy.tn
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}