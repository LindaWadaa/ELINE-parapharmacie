function TrustSection() {
  const items = [
    {
      icon: "bi bi-truck",
      title: "Livraison",
      desc: "Livraison disponible partout en Tunisie",
    },
    {
      icon: "bi bi-shield-check",
      title: "Produits authentiques",
      desc: "Produits commercialisés à 100% par des pharmacies tunisiennes",
    },
    {
      icon: "bi bi-headset",
      title: "Service client",
      desc: (
        <>
          Contactez nous sur le numéro :
          <br />
          Livraison: (+216) 22 155 054
          <br />
          Réclamation: (+216) 96 255 343
        </>
      ),
    },
  ];

  return (
    <section
      style={{
        background: "#ffffff",
        borderTop: "1px solid rgba(46, 164, 79, 0.08)",
        borderBottom: "1px solid rgba(46, 164, 79, 0.08)",
        padding: "2.5rem 0",
      }}
    >
      <div className="container">
        <div className="row g-4 justify-content-center">
          {items.map((item, i) => (
            <div key={i} className="col-12 col-md-4 d-flex">
              <div
                className="d-flex align-items-start gap-3 w-100 p-3 rounded-3"
                style={{
                  background: "#fafff7",
                  border: "1px solid rgba(46, 164, 79, 0.12)",
                  borderRadius: "12px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(46, 164, 79, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    fontSize: "1.3rem",
                  }}
                >
                  <i className={item.icon}></i>
                </div>
                <div className="d-flex flex-column">
                  <h6 className="fw-bold mb-1" style={{ color: "#1b5e20", fontSize: "0.95rem" }}>
                    {item.title}
                  </h6>
                  <p className="mb-0 small" style={{ color: "#4a5568", lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
