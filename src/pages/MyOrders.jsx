import { useEffect, useState } from "react";
import "./MyOrders.css";

import API_URL from "../config/api";

function MyOrders({ goTo }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to view your orders.");
        goTo("login");
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/my-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Your session has expired. Please login again.");
        goTo("login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders error:", err);
      setError(
        err.message || "Something went wrong while loading orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return `â‚¹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  if (loading) {
    return (
      <section className="orders-page">
        <div className="orders-loading">
          <div className="orders-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="orders-page">
        <div className="orders-header">
          <p className="orders-label">ABARNA CLOTHING</p>

          <h1>My Orders</h1>

          <p>
            Track and view your previous purchases.
          </p>
        </div>

        <div className="orders-error">
          <span>âš </span>

          <h3>Unable to load orders</h3>

          <p>{error}</p>

          <button
            className="orders-btn"
            onClick={fetchOrders}
          >
            TRY AGAIN
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="orders-page">

      {/* HEADER */}
      <div className="orders-header">
        <p className="orders-label">
          ABARNA CLOTHING
        </p>

        <h1>My Orders</h1>

        <p>
          View your orders and track your purchases.
        </p>
      </div>

      {/* EMPTY ORDERS */}
      {orders.length === 0 ? (
        <div className="empty-orders">

          <div className="empty-orders-icon">
            ðŸ›ï¸
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
            Start shopping and your orders will appear here.
          </p>

          <button
            className="orders-btn"
            onClick={() => goTo("shop")}
          >
            START SHOPPING â†’
          </button>

        </div>
      ) : (
        <div className="orders-container">

          {/* ORDER COUNT */}
          <div className="orders-topbar">
            <span>
              {orders.length}{" "}
              {orders.length === 1 ? "Order" : "Orders"}
            </span>

            <button
              className="refresh-btn"
              onClick={fetchOrders}
            >
              â†» Refresh
            </button>
          </div>

          {/* ORDERS */}
          {orders.map((order) => (
            <article
              className="order-card"
              key={order.id}
            >

              {/* ORDER TOP */}
              <div className="order-top">

                <div>
                  <p className="order-small">
                    ORDER NUMBER
                  </p>

                  <h3>
                    {order.order_number}
                  </h3>
                </div>

                <div className="order-date">
                  <p className="order-small">
                    ORDER DATE
                  </p>

                  <span>
                    {formatDate(order.created_at)}
                  </span>
                </div>

                <span
                  className={`order-status ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </span>

              </div>

              {/* PRODUCTS */}
              <div className="order-products">

                {order.items?.map((item) => (
                  <div
                    className="order-product"
                    key={item.id}
                  >

                    <div className="order-product-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.product_name}
                        />
                      ) : (
                        <span>AB</span>
                      )}
                    </div>

                    <div className="order-product-info">

                      <h4>
                        {item.product_name}
                      </h4>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    <strong>
                      {formatPrice(item.price)}
                    </strong>

                  </div>
                ))}

              </div>

              {/* DELIVERY */}
              <div className="order-delivery">

                <div>
                  <p className="order-small">
                    DELIVERY ADDRESS
                  </p>

                  <p>
                    {order.full_name}
                    <br />

                    {order.address}, {order.city}
                    <br />

                    {order.pincode}
                    <br />

                    Phone: {order.phone}
                  </p>
                </div>

                <div className="payment-info">

                  <p className="order-small">
                    PAYMENT
                  </p>

                  <p>
                    {order.payment_method ||
                      "Cash on Delivery"}
                  </p>

                </div>

              </div>

              {/* TOTAL */}
              <div className="order-bottom">

                <span>
                  Order Total
                </span>

                <strong>
                  {formatPrice(order.total_amount)}
                </strong>

              </div>

            </article>
          ))}

          {/* SHOP MORE */}
          <div className="orders-footer">

            <button
              className="continue-shopping-btn"
              onClick={() => goTo("shop")}
            >
              CONTINUE SHOPPING â†’
            </button>

          </div>

        </div>
      )}

    </section>
  );
}

export default MyOrders;
