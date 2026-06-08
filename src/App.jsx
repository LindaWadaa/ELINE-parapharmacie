import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TrustSection from "./components/TrustSection";
import Login from "./Pages/Login";
import Register from "./Pages/register";
import Home from "./Pages/Home";
import Catalogue from "./Pages/Catalogue";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import ProductDetails from "./Pages/ProductDetails";
import ForgotPassword from "./Pages/ForgotPassword";
import { CartProvider, useCart } from "./components/CartContext";
import Notification from "./components/Notification";
import Cart from "./Pages/Cart";
import CartDrawer from "./components/CartDrawer";
import OrderModal from "./components/OrderModal";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

const backgroundLeaves = [
  { top: "6%", left: "3%", size: 54, opacity: 0.55, duration: "9s", delay: "0s", rotate: -8 },
  { top: "16%", right: "5%", size: 36, opacity: 0.42, duration: "11s", delay: "1.5s", rotate: 12 },
  { top: "38%", left: "7%", size: 42, opacity: 0.35, duration: "10s", delay: "0.5s", rotate: -14 },
  { top: "56%", right: "9%", size: 30, opacity: 0.3, duration: "12s", delay: "2s", rotate: 9 },
  { top: "74%", left: "11%", size: 38, opacity: 0.4, duration: "13s", delay: "1s", rotate: -6 },
  { top: "82%", right: "3%", size: 24, opacity: 0.28, duration: "14s", delay: "0s", rotate: 15 },
  { top: "28%", left: "50%", size: 22, opacity: 0.24, duration: "15s", delay: "1.2s", rotate: 6 },
  { top: "64%", left: "57%", size: 30, opacity: 0.26, duration: "16s", delay: "2.4s", rotate: -11 },
  { top: "12%", left: "26%", size: 26, opacity: 0.2, duration: "10s", delay: "0.8s", rotate: -4 },
  { top: "24%", right: "22%", size: 20, opacity: 0.18, duration: "12s", delay: "1.8s", rotate: 10 },
  { top: "48%", left: "24%", size: 18, opacity: 0.16, duration: "13s", delay: "0.3s", rotate: -12 },
  { top: "86%", left: "44%", size: 32, opacity: 0.22, duration: "11s", delay: "2.6s", rotate: 7 },
];

function BackgroundLeaves() {
  return (
    <div className="site-background-decor" aria-hidden="true">
      {backgroundLeaves.map((leaf, index) => (
        <span
          key={index}
          className="background-leaf"
          style={{
            top: leaf.top,
            left: leaf.left,
            right: leaf.right,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            opacity: leaf.opacity,
            animationDuration: leaf.duration,
            animationDelay: leaf.delay,
            "--leaf-rotate": `${leaf.rotate}deg`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.5 3.5C16 3.5 10 7 7.2 9.8C4.2 12.8 4 16.8 5.8 18.8C7.8 21 11.7 21 14.7 18C17.9 14.8 21 8.6 21 4.8C21 4.1 20.9 3.7 20.5 3.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 16C10.2 13.6 13.1 11.2 16.8 8.8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

function AppContent() {
  const { orderModal, closeOrderModal } = useCart();

  return (
    <div className="app-shell d-flex flex-column min-vh-100 bg-light w-100 position-relative">
      <BackgroundLeaves />
      <Notification />
      <Navbar />

      <main className="flex-grow-1 w-100 m-0 bg-light app-content-layer">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<Cart />} />
          {/* Routes Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>

      <TrustSection />
      <Footer />
      <CartDrawer />

      {orderModal.isOpen && (
        <OrderModal
          product={orderModal.product}
          onClose={closeOrderModal}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
