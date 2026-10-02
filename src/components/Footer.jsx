import React from "react";
import "./Footer.css";

function Footer({ goTo }) {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">
          <h2>ABARNA</h2>

          <p>
            Elegance in every thread.
            <br />
            Fashion made with confidence.
          </p>
        </div>

        <div className="footer-links">
          <h3>QUICK LINKS</h3>

          <button onClick={() => goTo("home")}>
            Home
          </button>

          <button onClick={() => goTo("shop")}>
            Shop
          </button>

          <button onClick={() => goTo("about")}>
            About
          </button>

          <button onClick={() => goTo("contact")}>
            Contact
          </button>
        </div>

        <div className="footer-admin">
          <h3>ACCOUNT</h3>

          <button onClick={() => goTo("login")}>
            Customer Login
          </button>

          <button
            className="admin-access-btn"
            onClick={() => goTo("admin-login")}
          >
            Admin Access
          </button>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 ABARNA CLOTHING. All Rights Reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;