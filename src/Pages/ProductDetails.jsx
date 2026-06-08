import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../components/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [productImages, setProductImages] = useState([]);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleImageError = (e) => {
    e.target.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%236c757d'%3EImage not available%3C/text%3E%3C/svg%3E";
  };

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (error) throw error;

        if (!cancelled && data) {
          setProduct(data);
          setProductImages(
            data.image_url
              ? [data.image_url]
              : []
          );
        }
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3 text-muted">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5">
          <h3 className="text-secondary mb-3">Produit non trouvé</h3>
          <p className="text-muted">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <a href="/catalogue" className="btn btn-primary mt-3">Retour au catalogue</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <>
        {/* Add-to-cart success message */}
        {addedToCart && (
          <div
            className="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3"
            style={{ zIndex: 9999, minWidth: '300px' }}
            role="alert"
          >
            <strong>✓ Ajouté au panier !</strong> {quantity} x {product.name}
          </div>
        )}

        <div className="row g-4 mb-5">
          {/* IMAGE SECTION */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 p-3">
              {/* Main Image */}
              <div
                className="mb-3"
                style={{
                  height: '400px',
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}
              >
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'contain' }}
                  onError={handleImageError}
                />
              </div>

              {/* Thumbnail Images */}
              <div className="d-flex gap-2 justify-content-center">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`border rounded ${selectedImage === index ? 'border-primary border-3' : ''}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 p-4">

              {/* Category Badge */}
              <div className="mb-3">
                <span className="badge bg-primary text-white px-3 py-2 fs-6">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="h3 fw-bold text-dark mb-3">{product.name}</h1>

              {/* Price */}
              <div className="mb-4">
                <span className="text-primary fw-bold" style={{ fontSize: '2rem' }}>
                  {Number(product.price).toFixed(3)} TND
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="fw-bold mb-2">Description</h5>
                <p className="text-muted lh-lg">{product.description}</p>
              </div>

              <hr />

              {/* Quantity Selector */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Quantité</h6>
                <div className="d-flex align-items-center gap-3">
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-outline-secondary btn-lg px-4"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <i className="bi bi-dash"></i> -
                    </button>

                    <button className="btn btn-outline-secondary btn-lg px-4 fw-bold" disabled>
                      {quantity}
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-lg px-4"
                      onClick={increaseQuantity}
                    >
                      <i className="bi bi-plus"></i> +
                    </button>
                  </div>

                  <span className="text-muted">
                    Total :{" "}
                    <strong className="text-dark">
                      {(Number(product.price) * quantity).toFixed(3)} TND
                    </strong>
                  </span>
                </div>
              </div>

              {/* Add To Cart Button */}
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-lg py-3 fw-bold"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Ajouter au panier
                </button>
              </div>

              {/* INFO BOX */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-2">Informations</h6>
                <ul className="list-unstyled mb-0 small">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    En stock et disponible immédiatement
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-truck text-primary me-2"></i>
                    Livraison gratuite pour les commandes supérieures à 100 TND
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SPECIFICATIONS */}
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0 py-2">Spécifications détaillées</h4>
          </div>

          <div className="card-body">
            <div className="row">

              <div className="col-md-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="fw-bold text-muted">Référence :</td>
                      <td>{product.id}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-muted">Catégorie :</td>
                      <td>{product.category}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-md-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="fw-bold text-muted">Prix unitaire :</td>
                      <td>{Number(product.price).toFixed(3)} TND</td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-muted">Disponibilité :</td>
                      <td><span className="badge bg-success">En stock</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default ProductDetails;
