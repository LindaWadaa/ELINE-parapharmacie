function About() {
  // Use images that actually exist in your public folder
  const carouselImages = [
    "/assets/prod1.webp",
    "/assets/prod2.jpg", 
    "/assets/prod4.png"
  ];

  return (
    <div className="container py-5">
      {/* ABOUT SECTION */}
      <section className="mb-5 p-4 rounded shadow-sm bg-light">
        <h2 className="mb-3 text-primary fw-bold">À propos de ELINE parapharmacie</h2>

        <p className="fs-5">
          Cette application <strong>Parapharmacie</strong> offre une expérience simple, rapide
          et intuitive pour les utilisateurs souhaitant parcourir ou acheter
          des produits de bien-être, soins de la peau, beauté et hygiène.
        </p>

        <h4 className="mt-4 fw-bold">✨ Fonctionnalités principales</h4>
        <ul className="fs-5 mt-2">
          <li>
            <strong>Catalogue complet :</strong> Produits organisés par catégories.
          </li>
          <li>
            <strong>Recherche intelligente :</strong> Trouvez rapidement n'importe quel produit.
          </li>
          <li>
            <strong>Fiche produit détaillée :</strong> Prix, description,
            ingrédients, et plus encore.
          </li>
          <li>
            <strong>Panier :</strong> Ajouter, modifier et supprimer des articles facilement.
          </li>
          <li>
            <strong>Interface moderne :</strong> Design épuré, responsive et convivial.
          </li>
        </ul>
      </section>

      {/* CAROUSEL SECTION */}
      <section className="p-4 rounded shadow-sm bg-white">
        <div
          id="demoCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          {/* Indicators */}
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#demoCarousel"
              data-bs-slide-to="0"
              className="active"
            ></button>
            <button
              type="button"
              data-bs-target="#demoCarousel"
              data-bs-slide-to="1"
            ></button>
            <button
              type="button"
              data-bs-target="#demoCarousel"
              data-bs-slide-to="2"
            ></button>
          </div>

          {/* Carousel images */}
          <div className="carousel-inner rounded shadow-sm">
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={img}
                  className="d-block w-100"
                  alt={`Slide ${index + 1}`}
                  style={{
                    height: "250px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236c757d'%3EImage: " + img + "%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#demoCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#demoCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;