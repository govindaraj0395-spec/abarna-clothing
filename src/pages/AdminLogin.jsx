import React, { useState } from "react";

import API_URL from "../config/api";

function AdminLogin({ goTo }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/admin-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Admin login failed."
        );
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );

      alert("Admin login successful!");

      goTo("admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      alert(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#faf8f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#ffffff",
          padding: "45px",
          borderRadius: "18px",
          boxShadow: "0 15px 45px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <p
            style={{
              letterSpacing: "4px",
              fontSize: "13px",
              marginBottom: "10px",
            }}
          >
            ABARNA CLOTHING
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
            }}
          >
            Admin Login
          </h1>

          <p
            style={{
              color: "#777",
              marginTop: "10px",
            }}
          >
            Access your admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              ADMIN EMAIL
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              PASSWORD
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "8px",
              background: "#111",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "LOGGING IN..." : "ADMIN LOGIN"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => goTo("home")}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "13px",
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          â† BACK TO WEBSITE
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
