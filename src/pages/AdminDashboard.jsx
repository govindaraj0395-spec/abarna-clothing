
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

import API_URL from "../config/api";

function AdminDashboard({ goTo }) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    totalCustomers: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin login required.");
        goTo("admin-login");
        return;
      }

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        alert(data.message || "Admin access denied.");
        goTo("admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load dashboard."
        );
      }

      setStats(
        data.stats || {
          totalOrders: 0,
          totalSales: 0,
          pendingOrders: 0,
          totalCustomers: 0,
        }
      );

      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      console.error("Dashboard error:", error);
      alert(error.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    alert("Admin logged out successfully.");

    goTo("home");
  };

  const formatPrice = (amount) => {
    return `â‚¹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>

        <h2>Loading Dashboard...</h2>

        <p>
          Please wait while we load your store data.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <header className="admin-header">

        <div>
          <p className="admin-brand">
            ABARNA CLOTHING
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p className="admin-subtitle">
            Manage your clothing store from one place.
          </p>
        </div>


        <div className="admin-header-right">

          <div className="admin-profile">

            <div className="admin-avatar">
              {adminUser?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {adminUser?.name || "Administrator"}
              </strong>

              <span>
                Administrator
              </span>
            </div>

          </div>


          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            LOGOUT
          </button>

        </div>

      </header>


      <div className="admin-container">

        {/* ================= CONTROL PANEL ================= */}

        <section className="admin-actions-section">

          <div>

            <p className="section-label">
              CONTROL PANEL
            </p>

            <h2>
              Store Overview
            </h2>

          </div>


          <div className="admin-action-buttons">

            <button
              onClick={() => goTo("shop")}
            >
              VIEW STORE
            </button>


            <button
              className="refresh-btn"
              onClick={fetchDashboard}
            >
              â†» REFRESH
            </button>

          </div>

        </section>


        {/* ================= STATISTICS ================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              ðŸ“¦
            </div>

            <div>

              <p>
                TOTAL ORDERS
              </p>

              <h3>
                {stats.totalOrders}
              </h3>

              <span>
                All customer orders
              </span>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              â‚¹
            </div>

            <div>

              <p>
                TOTAL SALES
              </p>

              <h3>
                {formatPrice(stats.totalSales)}
              </h3>

              <span>
                Overall store sales
              </span>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              â³
            </div>

            <div>

              <p>
                PENDING ORDERS
              </p>

              <h3>
                {stats.pendingOrders}
              </h3>

              <span>
                Orders awaiting processing
              </span>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ðŸ‘¥
            </div>

            <div>

              <p>
                CUSTOMERS
              </p>

              <h3>
                {stats.totalCustomers}
              </h3>

              <span>
                Registered customers
              </span>

            </div>

          </div>

        </section>


        {/* ================= MANAGEMENT ================= */}

        <section className="management-section">

          <div className="management-heading">

            <p className="section-label">
              MANAGEMENT
            </p>

            <h2>
              Manage Your Store
            </h2>

          </div>


          <div className="management-grid">


            {/* PRODUCTS */}

            <button
              className="management-card"
              onClick={() =>
                goTo("admin-products")
              }
            >

              <span className="management-icon">
                ðŸ‘—
              </span>

              <div>

                <h3>
                  Products
                </h3>

                <p>
                  Add, edit, delete products and manage stock.
                </p>

              </div>

              <span className="arrow">
                â†’
              </span>

            </button>


            {/* ORDERS */}

            <button
              className="management-card"
              onClick={() => goTo("admin-orders")}
              
            >

              <span className="management-icon">
                ðŸ“‹
              </span>

              <div>

                <h3>
                  Orders
                </h3>

                <p>
                  View customer orders and update order status.
                </p>

              </div>

              <span className="arrow">
                â†’
              </span>

            </button>


            {/* CUSTOMERS */}

            <button
              className="management-card"
              onClick={() =>
                alert("Customer Management coming next.")
              }
            >

              <span className="management-icon">
                ðŸ‘¤
              </span>

              <div>

                <h3>
                  Customers
                </h3>

                <p>
                  View registered customers and their details.
                </p>

              </div>

              <span className="arrow">
                â†’
              </span>

            </button>


            {/* SALES REPORTS */}

            <button
              className="management-card"
              onClick={() =>
                alert("Sales Reports coming next.")
              }
            >

              <span className="management-icon">
                ðŸ“Š
              </span>

              <div>

                <h3>
                  Sales Reports
                </h3>

                <p>
                  View sales performance and order statistics.
                </p>

              </div>

              <span className="arrow">
                â†’
              </span>

            </button>


          </div>

        </section>


        {/* ================= RECENT ORDERS ================= */}

        <section className="recent-orders-section">

          <div className="recent-heading">

            <div>

              <p className="section-label">
                ORDERS
              </p>

              <h2>
                Recent Orders
              </h2>

            </div>

            <span>
              Latest 5 orders
            </span>

          </div>


          {recentOrders.length === 0 ? (

            <div className="no-orders">

              <div>
                ðŸ“¦
              </div>

              <h3>
                No Orders Yet
              </h3>

              <p>
                Customer orders will appear here once they
                place an order.
              </p>

            </div>

          ) : (

            <div className="orders-table-wrapper">

              <table className="orders-table">

                <thead>

                  <tr>
                    <th>ORDER</th>
                    <th>CUSTOMER</th>
                    <th>EMAIL</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>

                </thead>


                <tbody>

                  {recentOrders.map((order) => (

                    <tr key={order.id}>

                      <td>
                        <strong>
                          {order.order_number}
                        </strong>
                      </td>


                      <td>
                        {order.full_name}
                      </td>


                      <td>
                        {order.email}
                      </td>


                      <td>

                        <strong>
                          {formatPrice(order.total_amount)}
                        </strong>

                      </td>


                      <td>

                        <span
                          className={`status-badge ${String(
                            order.status || ""
                          ).toLowerCase()}`}
                        >
                          {order.status}
                        </span>

                      </td>


                      <td>
                        {formatDate(order.created_at)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default AdminDashboard;
