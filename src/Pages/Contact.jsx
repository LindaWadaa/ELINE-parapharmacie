import { useState } from "react";

const contactDetails = [
  {
    icon: "bi-geo-alt",
    title: "Notre adresse",
    text: "Nabeul, Tunisie",
  },
  {
    icon: "bi-clock",
    title: "Nos horaires",
    text: "24h / 24 — 7j / 7",
  },
  {
    icon: "bi-truck",
    title: "Livraison",
    text: "Partout en Tunisie",
  },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="contact-page">
      <div className="container py-4 py-lg-5">
        <div className="contact-hero text-center mb-4 mb-lg-5">
          <span className="contact-eyebrow">ELINE para</span>
          <h1 className="contact-title">Nous sommes à votre écoute</h1>
          <p className="contact-subtitle mb-0">
            Une question sur un produit ou votre commande ? Notre équipe vous
            répond avec plaisir.
          </p>
        </div>

        <div className="contact-layout">
          <aside className="contact-intro">
            <div className="intro-icon">
              <i className="bi bi-chat-heart" aria-hidden="true"></i>
            </div>
            <h2>Parlons de vos besoins</h2>
            <p>
              Chez ELINE para, nous vous accompagnons pour trouver les soins
              et produits adaptés à votre quotidien.
            </p>

            <div className="contact-details">
              {contactDetails.map((detail) => (
                <div className="contact-detail" key={detail.title}>
                  <span className="detail-icon">
                    <i className={`bi ${detail.icon}`} aria-hidden="true"></i>
                  </span>
                  <div>
                    <strong>{detail.title}</strong>
                    <span>{detail.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="contact-form-card">
            {isSubmitted ? (
              <div className="success-message" role="status">
                <div className="success-icon">
                  <i className="bi bi-check-lg" aria-hidden="true"></i>
                </div>
                <h2>Message envoyé !</h2>
                <p className="mb-0">
                  Merci pour votre message. Nous vous répondrons dans les plus
                  brefs délais.
                </p>
              </div>
            ) : (
              <>
                <div className="form-heading">
                  <h2>Envoyez-nous un message</h2>
                  <p>Les champs marqués d’un astérisque sont obligatoires.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label htmlFor="name">
                      Nom complet <span aria-hidden="true">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="bi bi-person" aria-hidden="true"></i>
                      <input
                        id="name"
                        type="text"
                        placeholder="Votre nom"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Adresse email <span aria-hidden="true">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="bi bi-envelope" aria-hidden="true"></i>
                      <input
                        id="email"
                        type="email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      Votre message <span aria-hidden="true">*</span>
                    </label>
                    <div className="input-wrapper textarea-wrapper">
                      <i className="bi bi-pencil" aria-hidden="true"></i>
                      <textarea
                        id="message"
                        placeholder="Comment pouvons-nous vous aider ?"
                        rows="5"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="form-alert" role="alert">
                      <i className="bi bi-exclamation-circle" aria-hidden="true"></i>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner" aria-hidden="true"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <i className="bi bi-arrow-right" aria-hidden="true"></i>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-page {
          min-height: 640px;
          background:
            radial-gradient(circle at 8% 12%, rgba(129, 199, 132, 0.16), transparent 28%),
            linear-gradient(180deg, #f8fdf9 0%, #ffffff 70%);
          color: #234b2a;
        }

        .contact-hero {
          max-width: 720px;
          margin-inline: auto;
        }

        .contact-eyebrow {
          display: inline-block;
          color: #2e7d32;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 0.7rem;
        }

        .contact-title {
          color: #1b5e20;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin-bottom: 0.75rem;
        }

        .contact-subtitle {
          color: #5f7563;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .contact-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          max-width: 1060px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid rgba(46, 125, 50, 0.12);
          border-radius: 24px;
          box-shadow: 0 18px 45px rgba(27, 94, 32, 0.1);
          background: #fff;
        }

        .contact-intro {
          padding: clamp(2rem, 5vw, 3.5rem);
          background: linear-gradient(145deg, #eaf7ed, #d9f0df);
        }

        .intro-icon {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          margin-bottom: 1.5rem;
          border-radius: 18px;
          background: #2e7d32;
          color: #fff;
          font-size: 1.55rem;
          box-shadow: 0 8px 18px rgba(46, 125, 50, 0.2);
        }

        .contact-intro h2,
        .form-heading h2 {
          color: #1b5e20;
          font-size: 1.45rem;
          font-weight: 800;
        }

        .contact-intro > p {
          color: #507057;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .contact-details {
          display: grid;
          gap: 1.2rem;
        }

        .contact-detail {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .detail-icon {
          display: grid;
          place-items: center;
          flex: 0 0 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          color: #2e7d32;
        }

        .contact-detail strong,
        .contact-detail span:not(.detail-icon) {
          display: block;
        }

        .contact-detail strong {
          color: #285d30;
          font-size: 0.9rem;
        }

        .contact-detail div > span {
          color: #66836b;
          font-size: 0.88rem;
          margin-top: 0.15rem;
        }

        .contact-form-card {
          padding: clamp(2rem, 5vw, 3.5rem);
          background: #fff;
        }

        .form-heading {
          margin-bottom: 1.7rem;
        }

        .form-heading p {
          color: #7a8a7d;
          font-size: 0.88rem;
          margin: 0.35rem 0 0;
        }

        .form-group {
          margin-bottom: 1.15rem;
        }

        .form-group label {
          display: block;
          color: #315d38;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 0.45rem;
        }

        .form-group label span {
          color: #c62828;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper > i {
          position: absolute;
          top: 50%;
          left: 1rem;
          color: #65a36b;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .input-wrapper input,
        .input-wrapper textarea {
          width: 100%;
          border: 1px solid #d6e5d8;
          border-radius: 12px;
          background: #fbfefb;
          color: #274c2d;
          font: inherit;
          padding: 0.82rem 1rem 0.82rem 2.8rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-wrapper textarea {
          min-height: 130px;
          resize: vertical;
          padding-top: 0.9rem;
        }

        .textarea-wrapper > i {
          top: 1rem;
          transform: none;
        }

        .input-wrapper input:focus,
        .input-wrapper textarea:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.13);
          background: #fff;
        }

        .input-wrapper input::placeholder,
        .input-wrapper textarea::placeholder {
          color: #a4b4a6;
        }

        .form-alert {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.75rem 0.9rem;
          border-radius: 10px;
          background: #fff4f3;
          color: #b3261e;
          font-size: 0.88rem;
          margin-bottom: 1rem;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          border: 0;
          border-radius: 12px;
          background: #2e7d32;
          color: #fff;
          font-weight: 700;
          padding: 0.9rem 1.2rem;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1b5e20;
          box-shadow: 0 8px 18px rgba(46, 125, 50, 0.2);
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: contact-spin 0.8s linear infinite;
        }

        @keyframes contact-spin {
          to { transform: rotate(360deg); }
        }

        .success-message {
          display: grid;
          place-items: center;
          min-height: 390px;
          text-align: center;
          color: #66836b;
        }

        .success-message h2 {
          color: #1b5e20;
          font-weight: 800;
          margin: 1rem 0 0.5rem;
        }

        .success-icon {
          display: grid;
          place-items: center;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #e4f4e7;
          color: #2e7d32;
          font-size: 2.2rem;
        }

        @media (max-width: 767.98px) {
          .contact-layout {
            grid-template-columns: 1fr;
            border-radius: 18px;
          }

          .contact-intro {
            padding-bottom: 2rem;
          }

          .contact-form-card {
            padding-top: 2.2rem;
          }
        }
      `}</style>
    </section>
  );
}
