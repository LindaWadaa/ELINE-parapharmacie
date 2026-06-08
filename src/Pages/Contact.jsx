import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after success message
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <div className="contact-header">
          <h2 className="contact-title">Contactez-nous</h2>
          <p className="contact-subtitle">
            Nous serons ravis de répondre à vos questions
          </p>
        </div>

        {isSubmitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Message envoyé avec succès !</h3>
            <p>Nous vous répondrons dans les plus brefs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="input-icon">👤</div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="input-icon">✉️</div>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                id="message"
                className="form-textarea"
                placeholder="Votre message..."
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <div className="textarea-icon">📝</div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le message"
              )}
            </button>

            <div className="form-footer">
              <p className="form-note">
                <span className="required">*</span> Tous les champs sont
                obligatoires
              </p>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .contact-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #ffffff;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .contact-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          padding: 40px;
          width: 100%;
          max-width: 500px;
          border: 1px solid #e9ecef;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .contact-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .contact-title {
          color: #2d3436;
          font-size: 2.2rem;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .contact-subtitle {
          color: #636e72;
          font-size: 1rem;
          line-height: 1.5;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          position: relative;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #2d3436;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background-color: #f8f9fa;
          color: #2d3436;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #4263eb;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.1);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #adb5bd;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        .input-icon,
        .textarea-icon {
          position: absolute;
          left: 16px;
          top: 42px;
          font-size: 1.2rem;
          opacity: 0.7;
        }

        .textarea-icon {
          top: 42px;
        }

        .error-message {
          background-color: #fff5f5;
          color: #e53e3e;
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          animation: shake 0.5s ease-in-out;
          border-left: 4px solid #e53e3e;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .error-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }

        .submit-btn {
          background: #4263eb;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #364fc7;
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(66, 99, 235, 0.2);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-footer {
          text-align: center;
          margin-top: 10px;
        }

        .form-note {
          color: #868e96;
          font-size: 0.9rem;
        }

        .required {
          color: #e53e3e;
          font-weight: bold;
        }

        .success-message {
          text-align: center;
          padding: 40px 20px;
          animation: fadeIn 0.5s ease-out;
        }

        .success-icon {
          background: #37b24d;
          color: white;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 25px;
          animation: pop 0.5s ease-out;
        }

        @keyframes pop {
          0% {
            transform: scale(0);
          }
          80% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .success-message h3 {
          color: #2d3436;
          font-size: 1.8rem;
          margin-bottom: 10px;
        }

        .success-message p {
          color: #636e72;
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Responsive design */
        @media (max-width: 600px) {
          .contact-container {
            padding: 10px;
            background: #f8f9fa;
          }

          .contact-card {
            padding: 30px 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #dee2e6;
          }

          .contact-title {
            font-size: 1.8rem;
          }

          .form-input,
          .form-textarea {
            padding: 14px 14px 14px 44px;
          }

          .input-icon,
          .textarea-icon {
            left: 14px;
            top: 40px;
          }
        }

        @media (max-width: 400px) {
          .contact-card {
            padding: 25px 15px;
          }

          .contact-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
