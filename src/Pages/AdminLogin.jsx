import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@eline.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Identifiants administrateur incorrects.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={styles.page}>
      {/* Background animated blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#4ade80" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M12 2v20M3 7l9 5 9-5" stroke="#4ade80" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={styles.title}>Espace Admin</h1>
          <p style={styles.subtitle}>ELINE Parapharmacie — Tableau de bord</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Adresse e-mail</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="#6b7280" strokeWidth="1.8"/>
                <path d="M2 8l10 7 10-7" stroke="#6b7280" strokeWidth="1.8"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eline.com"
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = "#4ade80"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6b7280" strokeWidth="1.8"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#6b7280" strokeWidth="1.8"/>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = "#4ade80"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#6b7280" strokeWidth="1.8"/>
                    <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="1.8"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="1.8"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#f87171"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            ...styles.btn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Accéder au Dashboard
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.badge}>🔒 Accès restreint — Administrateurs uniquement</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f2818 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  },
  blob1: {
    position: "absolute", top: "-10%", right: "-5%",
    width: "400px", height: "400px",
    background: "radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(40px)",
  },
  blob2: {
    position: "absolute", bottom: "-10%", left: "-5%",
    width: "500px", height: "500px",
    background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(60px)",
  },
  blob3: {
    position: "absolute", top: "40%", left: "40%",
    width: "300px", height: "300px",
    background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(50px)",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.1)",
    position: "relative",
    zIndex: 10,
  },
  header: {
    textAlign: "center",
    marginBottom: "36px",
  },
  iconWrap: {
    width: "64px", height: "64px",
    background: "rgba(74,222,128,0.12)",
    border: "1px solid rgba(74,222,128,0.25)",
    borderRadius: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
    boxShadow: "0 0 30px rgba(74,222,128,0.15)",
  },
  title: {
    color: "#fff",
    fontSize: "1.75rem",
    fontWeight: "800",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "0.85rem",
    margin: 0,
    fontWeight: "400",
    letterSpacing: "0.3px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.8rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute",
    left: "14px",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "14px 44px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: "14px",
    background: "none", border: "none",
    cursor: "pointer", padding: "4px",
    display: "flex", alignItems: "center",
  },
  errorBox: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f87171",
    fontSize: "0.875rem",
  },
  btn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "15px",
    fontSize: "0.95rem",
    fontWeight: "700",
    letterSpacing: "0.3px",
    transition: "all 0.2s",
    boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
    marginTop: "4px",
  },
  spinner: {
    width: "20px", height: "20px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  footer: {
    textAlign: "center",
    marginTop: "28px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  badge: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "0.78rem",
    letterSpacing: "0.3px",
  },
};
