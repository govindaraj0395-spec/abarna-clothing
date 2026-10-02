import { useEffect, useState } from "react";
import "./App.css";

import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Wishlist from "./pages/Wishlist";
import AdminLogin from "./pages/AdminLogin";
import ProductDetails from "./pages/ProductDetails";
import AdminProducts from "./pages/AdminProducts";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Address from "./pages/Address";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState("home");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setLoggedInUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  /* ================= NAVIGATION ================= */

  const goTo = (page) => {
    if (page !== "product") {
      setSelectedProduct(null);
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= PRODUCT DETAILS ================= */

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setCurrentPage("product");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= LOGIN ================= */

  const handleLogin = (user) => {
    setLoggedInUser(user);
    setCurrentPage("home");
  };

  /* ================= REGISTER ================= */

  const handleRegister = (user) => {
    setLoggedInUser(user);
    setCurrentPage("home");
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedInUser(null);
    setCurrentPage("home");

    alert("You have been logged out.");
  };

  /* ================= ADD CART ================= */

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    alert(`${product.name} added to cart!`);
  };

  /* ================= WISHLIST ================= */

  const toggleWishlist = (product) => {
    setWishlist((previousWishlist) => {
      const exists = previousWishlist.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return previousWishlist.filter(
          (item) => item.id !== product.id
        );
      }

      return [...previousWishlist, product];
    });
  };

  /* ================= CART ================= */

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id, change) => {
    setCart((previousCart) =>
      previousCart
        .map((item) => {
          if (item.id !== id) return item;

          return {
            ...item,
            quantity: (item.quantity || 1) + change,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <button
          className="logo"
          onClick={() => goTo("home")}
        >
          ABARNA
        </button>

        <div className="nav-links">

          <button onClick={() => goTo("home")}>
            Home
          </button>

          <button onClick={() => goTo("shop")}>
            Shop
          </button>

          <button onClick={() => goTo("shop")}>
            Collections
          </button>

          <button onClick={() => goTo("about")}>
            About
          </button>

          <button onClick={() => goTo("contact")}>
            Contact
          </button>

        </div>

        <div className="nav-actions">

          <button
            className="nav-icon"
            onClick={() => goTo("shop")}
          >
            🔍
          </button>

          <button
            className="nav-icon"
            onClick={() => goTo("wishlist")}
          >
            ♡

            {wishlist.length > 0 && (
              <span className="nav-count">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            className="nav-icon"
            onClick={() => goTo("cart")}
          >
            🛒

            {cartCount > 0 && (
              <span className="nav-count">
                {cartCount}
              </span>
            )}
          </button>

          {!loggedInUser ? (

            <button
              className="login-nav-btn"
              onClick={() => goTo("login")}
            >
              LOGIN
            </button>

          ) : (

            <div className="user-menu">

              <span className="user-name">
                Hi, {loggedInUser.name}
              </span>

              <button
                className="orders-nav-btn"
                onClick={() => goTo("orders")}
              >
                MY ORDERS
              </button>

              <button
                className="address-nav-btn"
                onClick={() => goTo("address")}
              >
                MY ADDRESS
              </button>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                LOGOUT
              </button>

            </div>

          )}

        </div>
      </nav>

      {/* ================= HOME ================= */}

      {currentPage === "home" && (

        <main>

          <section className="hero">

            <div className="hero-content">

              <p className="hero-small">
                NEW COLLECTION 2026
              </p>

              <h1>
                Elegance in
                <br />
                Every Thread
              </h1>

              <p className="hero-description">
                Discover timeless fashion crafted
                with elegance, comfort and confidence.
              </p>

              <button
                className="hero-btn"
                onClick={() => goTo("shop")}
              >
                SHOP COLLECTION →
              </button>

            </div>

          </section>

          <section className="home-section">

            <p className="section-label">
              ABARNA CLOTHING
            </p>

            <h2>
              Shop Our Collection
            </h2>

            <p>
              Discover elegant styles designed
              for every occasion.
            </p>

            <button
              className="hero-btn"
              onClick={() => goTo("shop")}
            >
              EXPLORE SHOP →
            </button>

          </section>

        </main>
      )}

      {/* ================= SHOP ================= */}

      {currentPage === "shop" && (

        <Shop
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          openProductDetails={openProductDetails}
        />

      )}

      {/* ================= PRODUCT DETAILS ================= */}

      {currentPage === "product" && selectedProduct && (

        <ProductDetails
          product={selectedProduct}
          setCart={setCart}
          setSelectedProduct={setSelectedProduct}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
          goTo={goTo}
        />

      )}

      {/* ================= CART ================= */}

      {currentPage === "cart" && (

        <Cart
          cart={cart}
          setCart={setCart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          goTo={goTo}
        />

      )}

      {/* ================= WISHLIST ================= */}

      {currentPage === "wishlist" && (

        <Wishlist
          wishlist={wishlist}
          setWishlist={setWishlist}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          goTo={goTo}
        />

      )}

      {/* ================= CHECKOUT ================= */}

      {currentPage === "checkout" && (

        <Checkout
          cart={cart}
          setCart={setCart}
          goTo={goTo}
        />

      )}

      {/* ================= ORDERS ================= */}

      {currentPage === "orders" && (

        <MyOrders
          goTo={goTo}
        />

      )}

      {/* ================= ADDRESS ================= */}

      {currentPage === "address" && (

        <Address
          goTo={goTo}
        />

      )}

      {/* ================= LOGIN ================= */}

      {currentPage === "login" && (

        <Login
          onLogin={handleLogin}
          onRegister={() => goTo("register")}
        />

      )}

      {/* ================= ADMIN LOGIN ================= */}

      {currentPage === "admin-login" && (
        <AdminLogin goTo={goTo} />
      )}

      {/* ================= ADMIN DASHBOARD ================= */}

      {currentPage === "admin-dashboard" && (
        <AdminDashboard goTo={goTo} />
      )}

      {/* ================= ADMIN PRODUCTS ================= */}

      {currentPage === "admin-products" && (
        <AdminProducts goTo={goTo} />
      )}

      {/* ================= ADMIN ORDERS ================= */}

      {currentPage === "admin-orders" && (
        <AdminOrders goTo={goTo} />
      )}

      {/* ================= REGISTER ================= */}

      {currentPage === "register" && (

        <Register
          onRegisterSuccess={handleRegister}
          onLogin={() => goTo("login")}
        />

      )}

      {/* ================= ABOUT ================= */}

      {currentPage === "about" && (

        <section className="simple-page">

          <p className="section-label">
            ABOUT ABARNA
          </p>

          <h1>
            About Us
          </h1>

          <p>
            ABARNA CLOTHING brings together elegant
            fashion, comfort and modern style.
          </p>

          <button
            className="hero-btn"
            onClick={() => goTo("shop")}
          >
            SHOP NOW
          </button>

        </section>

      )}

      {/* ================= CONTACT ================= */}

      {currentPage === "contact" && (

        <section className="simple-page">

          <p className="section-label">
            ABARNA CLOTHING
          </p>

          <h1>
            Contact Us
          </h1>

          <p>
            We would love to hear from you.
          </p>

        </section>

      )}

      <Footer goTo={goTo} />

    </div>
  );
}

export default App;