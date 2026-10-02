import React, { useEffect, useState } from "react";
import "./AdminOrders.css";

import API_URL from "../config/api";

function AdminOrders({ goTo }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ================================
     FETCH ORDERS
  ================================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin login required.");
        goTo("admin-login");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        alert(
          data.message || "Admin access denied."
        );

        goTo("admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders."
        );
      }

      setOrders(data.recentOrders || []);
    } catch (error) {
      console.error("Orders error:", error);

      alert(
        error.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================================
     FORMAT PRICE
  ================================= */

  const formatPrice = (amount) => {
    return `â‚¹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  /* ================================
     FORMAT DATE
  ================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ================================
     STATUS CLASS
  ================================= */

  const getStatusClass = (status) => {
    return String(
      status || "Pending"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /* ================================
     FILTER ORDERS
  ================================= */

  const filteredOrders = orders.filter(
    (order) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        String(
          order.order_number || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          order.full_name || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          order.email || ""
        )
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        String(
          order.status || ""
        ).toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  /* ================================
     UPDATE ORDER STATUS
  ================================= */

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin login required.");
      goTo("admin-login");
      return;
    }

    try {
      setUpdatingId(orderId);

      /*
        Backend endpoint expected:
        PUT /api/admin/orders/:id/status
      */

      const response = await fetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );

        alert(
          data.message ||
            "Admin access denied."
        );

        goTo("admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status."
        );
      }

      /*
        Update UI immediately
      */

      setOrders((previousOrders) =>
        previousOrders.map(
          (order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
        )
      );

      alert(
        `Order status changed to ${newStatus}.`
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="orders-loading">

        <div className="orders-spinner"></div>

        <p className="orders-loading-label">
          ABARNA CLOTHING
        </p>

        <h2>
          Loading Orders...
        </h2>

        <p>
          Please wait while we load
          customer orders.
        </p>

      </div>
    );
  }

  /* ================================
     PAGE
  ================================= */

  return (
    <div className="admin-orders">

      {/* =================================
          HEADER
      ================================= */}

      <header className="orders-header">

        <div className="orders-header-content">

          <p className="orders-brand">
            ABARNA CLOTHING
          </p>

          <h1>
            Order Management
          </h1>

          <p className="orders-subtitle">
            View and manage customer orders
            from one place.
          </p>

        </div>

        <div className="orders-header-actions">

          <button
            className="back-dashboard-btn"
            onClick={() =>
              goTo("admin-dashboard")
            }
          >
            â† DASHBOARD
          </button>

          <button
            className="view-store-btn"
            onClick={() =>
              goTo("shop")
            }
          >
            VIEW STORE
          </button>

        </div>

      </header>

      {/* =================================
          MAIN
      ================================= */}

      <main className="orders-container">

        {/* TOP CARD */}

        <section className="orders-topbar">

          <div>

            <p className="orders-label">
              ORDERS
            </p>

            <h2>
              All Customer Orders
            </h2>

            <p className="orders-description">
              Track, search and update
              customer order status.
            </p>

          </div>

          <button
            className="orders-refresh"
            onClick={fetchOrders}
            disabled={loading}
          >
            â†» REFRESH
          </button>

        </section>

        {/* =================================
            SUMMARY
        ================================= */}

        <section className="orders-summary">

          <div className="orders-summary-card">

            <span className="summary-icon">
              ðŸ“¦
            </span>

            <div>
              <p>TOTAL ORDERS</p>
              <strong>
                {orders.length}
              </strong>
            </div>

          </div>

          <div className="orders-summary-card">

            <span className="summary-icon">
              â³
            </span>

            <div>
              <p>PENDING</p>
              <strong>
                {
                  orders.filter(
                    (order) =>
                      String(
                        order.status || ""
                      ).toLowerCase() ===
                      "pending"
                  ).length
                }
              </strong>
            </div>

          </div>

          <div className="orders-summary-card">

            <span className="summary-icon">
              ðŸšš
            </span>

            <div>
              <p>SHIPPED</p>
              <strong>
                {
                  orders.filter(
                    (order) =>
                      String(
                        order.status || ""
                      ).toLowerCase() ===
                      "shipped"
                  ).length
                }
              </strong>
            </div>

          </div>

          <div className="orders-summary-card">

            <span className="summary-icon">
              âœ“
            </span>

            <div>
              <p>DELIVERED</p>
              <strong>
                {
                  orders.filter(
                    (order) =>
                      String(
                        order.status || ""
                      ).toLowerCase() ===
                      "delivered"
                  ).length
                }
              </strong>
            </div>

          </div>

        </section>

        {/* =================================
            FILTERS
        ================================= */}

        <section className="orders-filters">

          <div className="search-box">

            <span>
              âŒ•
            </span>

            <input
              type="text"
              placeholder="Search order, customer or email..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="status-filter">

            <label>
              STATUS
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </section>

        {/* =================================
            COUNT
        ================================= */}

        <div className="order-count">

          Showing{" "}

          <strong>
            {filteredOrders.length}
          </strong>{" "}

          of{" "}

          <strong>
            {orders.length}
          </strong>{" "}

          orders

        </div>

        {/* =================================
            EMPTY
        ================================= */}

        {filteredOrders.length === 0 ? (

          <div className="orders-empty">

            <div className="empty-icon">
              ðŸ“¦
            </div>

            <h3>
              No Orders Found
            </h3>

            <p>
              No orders match your
              current search or filter.
            </p>

          </div>

        ) : (

          /* =================================
             TABLE
          ================================= */

          <section className="orders-table-card">

            <div className="table-header">

              <div>

                <p>
                  CUSTOMER ORDERS
                </p>

                <h3>
                  Order List
                </h3>

              </div>

              <span>
                {filteredOrders.length} RESULTS
              </span>

            </div>

            <div className="admin-orders-table-wrapper">

              <table className="admin-orders-table">

                <thead>

                  <tr>

                    <th>
                      ORDER
                    </th>

                    <th>
                      CUSTOMER
                    </th>

                    <th>
                      EMAIL
                    </th>

                    <th>
                      AMOUNT
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      DATE
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredOrders.map(
                    (order) => (

                      <tr
                        key={order.id}
                      >

                        {/* ORDER */}

                        <td>

                          <strong className="order-number">
                            {order.order_number}
                          </strong>

                          <small>
                            Order #{order.id}
                          </small>

                        </td>

                        {/* CUSTOMER */}

                        <td>

                          <strong>
                            {order.full_name}
                          </strong>

                        </td>

                        {/* EMAIL */}

                        <td>

                          <span className="customer-email">
                            {order.email}
                          </span>

                        </td>

                        {/* AMOUNT */}

                        <td>

                          <strong className="order-amount">
                            {formatPrice(
                              order.total_amount
                            )}
                          </strong>

                        </td>

                        {/* STATUS */}

                        <td>

                          <select
                            className={`admin-order-status ${getStatusClass(
                              order.status
                            )}`}
                            value={
                              order.status ||
                              "Pending"
                            }
                            disabled={
                              updatingId ===
                              order.id
                            }
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                e.target.value
                              )
                            }
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Shipped">
                              Shipped
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

                          {updatingId ===
                            order.id && (
                            <small className="updating-text">
                              Updating...
                            </small>
                          )}

                        </td>

                        {/* DATE */}

                        <td>

                          <span className="order-date">
                            {formatDate(
                              order.created_at
                            )}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminOrders;
