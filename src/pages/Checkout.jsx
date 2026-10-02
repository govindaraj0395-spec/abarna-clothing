import React, { useEffect, useState } from "react";
import "./Checkout.css";

import API_URL from "../config/api";

function Checkout({ cart, setCart, goTo }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [addressLoaded, setAddressLoaded] = useState(false);

  // Load saved address automatically
  useEffect(() => {
    const savedAddress = localStorage.getItem("address");

    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);

        setForm({
          fullName: parsedAddress.fullName || "",
          phone: parsedAddress.phone || "",
          address: parsedAddress.address || "",
          city: parsedAddress.city || "",
          pincode: parsedAddress.pincode || "",
        });

        setAddressLoaded(true);
      } catch (error) {
        console.error("Failed to load saved address:", error);
      }
    }
  }, []);

  const getPrice = (price) => {
    return Number(String(price).replace(/[â‚¹,]/g, "")) || 0;
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + getPrice(item.price) * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setAddressLoaded(false);
  };

  // Go to My Address page
  const handleEditAddress = () => {
    goTo("address");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      alert("Your cart is empty.");
      goTo("shop");
      return;
    }

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.pincode.trim()
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before placing your order.");
      goTo("login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
          paymentMethod: "Cash on Delivery",
          items: cart,
          totalAmount: total,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired. Please login again.");

        goTo("login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Order failed."
        );
      }

      const orderNumber =
        data.order?.orderNumber ||
        data.orderNumber ||
        "ABARNA";

      alert(
        `Order placed successfully!\nOrder Number: ${orderNumber}`
      );

      setCart([]);

      setForm({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
      });

      goTo("home");
    } catch (error) {
      console.error("Place order error:", error);

      alert(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">ðŸ›</div>

          <h1>Your Cart is Empty</h1>

          <p>
            Add some beautiful pieces before checking out.
          </p>

          <button
            className="checkout-primary-btn"
            onClick={() => goTo("shop")}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* HEADER */}
      <div className="checkout-header">
        <span className="checkout-brand">
          ABARNA CLOTHING
        </span>

        <h1>Checkout</h1>

        <p>
          Complete your details and place your order.
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="checkout-container">

        {/* LEFT SIDE */}
        <form
          className="checkout-form-card"
          onSubmit={handlePlaceOrder}
        >

          {/* DELIVERY DETAILS */}
          <div className="card-heading">
            <span>01</span>

            <div>
              <h2>Delivery Details</h2>

              <p>
                Where should we deliver your order?
              </p>
            </div>
          </div>

          {/* SAVED ADDRESS MESSAGE */}
          {addressLoaded && (
            <div className="saved-address-notice">
              <div>
                <strong>âœ“ Saved Address Loaded</strong>

                <p>
                  Your saved delivery address has been
                  filled automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={handleEditAddress}
              >
                EDIT ADDRESS
              </button>
            </div>
          )}

          <div className="checkout-fields">

            {/* FULL NAME */}
            <div className="field full">
              <label>FULL NAME</label>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            {/* PHONE */}
            <div className="field">
              <label>PHONE NUMBER</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* PINCODE */}
            <div className="field">
              <label>PINCODE</label>

              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
              />
            </div>

            {/* ADDRESS */}
            <div className="field full">
              <label>FULL ADDRESS</label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House No, Street, Area"
                rows="4"
              />
            </div>

            {/* CITY */}
            <div className="field full">
              <label>CITY</label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

          </div>

          {/* PAYMENT */}
          <div className="payment-section">

            <div className="card-heading">
              <span>02</span>

              <div>
                <h2>Payment Method</h2>

                <p>
                  Choose your preferred payment method.
                </p>
              </div>
            </div>

            <div className="payment-option">

              <div className="payment-radio">
                <input
                  type="radio"
                  checked
                  readOnly
                />
              </div>

              <div>
                <strong>
                  Cash on Delivery
                </strong>

                <p>
                  Pay when your order arrives.
                </p>
              </div>

            </div>

          </div>

          {/* PLACE ORDER */}
          <button
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >
            {loading
              ? "PLACING ORDER..."
              : "PLACE ORDER"}
          </button>

        </form>

        {/* RIGHT SIDE */}
        <aside className="order-summary-card">

          <div className="summary-title">

            <div>
              <span>YOUR ORDER</span>

              <h2>Order Summary</h2>
            </div>

            <span className="item-count">
              {cart.length} ITEM
              {cart.length > 1 ? "S" : ""}
            </span>

          </div>

          {/* PRODUCTS */}
          <div className="summary-products">

            {cart.map((item, index) => (
              <div
                className="summary-product"
                key={`${item.id}-${index}`}
              >

                <div className="product-image-box">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>AB</span>
                  )}

                </div>

                <div className="product-info">

                  <h3>{item.name}</h3>

                  <p>
                    Quantity: {item.quantity || 1}
                  </p>

                  <strong>
                    â‚¹
                    {(
                      getPrice(item.price) *
                      (item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>
            ))}

          </div>

          <div className="summary-divider"></div>

          {/* SUBTOTAL */}
          <div className="summary-row">

            <span>Subtotal</span>

            <strong>
              â‚¹{total.toLocaleString("en-IN")}
            </strong>

          </div>

          {/* DELIVERY */}
          <div className="summary-row">

            <span>Delivery</span>

            <strong className="free">
              FREE
            </strong>

          </div>

          <div className="summary-divider"></div>

          {/* TOTAL */}
          <div className="total-row">

            <span>TOTAL</span>

            <strong>
              â‚¹{total.toLocaleString("en-IN")}
            </strong>

          </div>

          {/* CONTINUE SHOPPING */}
          <button
            type="button"
            className="continue-shopping-btn"
            onClick={() => goTo("shop")}
          >
            â† CONTINUE SHOPPING
          </button>

          {/* SECURE CHECKOUT */}
          <div className="secure-note">

            <span>ðŸ”’</span>

            <div>
              <strong>
                Secure Checkout
              </strong>

              <p>
                Your order details are protected.
              </p>
            </div>

          </div>

        </aside>

      </div>
    </div>
  );
}

export default Checkout;
