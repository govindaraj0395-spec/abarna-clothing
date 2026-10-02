import { useState } from "react";
import "./Login.css";

const API_URL = "http://localhost:5000";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      // Save login
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert(`Welcome back, ${data.user.name}!`);

      // Send user to App.jsx
      if (onLogin) {
        onLogin(data.user);
      }

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Unable to connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-left">

          <h1>
            ABARNA
          </h1>

          <h2>
            Welcome Back
          </h2>

          <p>
            Login to your ABARNA CLOTHING account
            and continue your shopping journey.
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="login-card">

          <h2>
            Login
          </h2>

          <p className="login-subtitle">
            Enter your account details
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "LOGGING IN..."
                : "LOGIN"}
            </button>

          </form>

          {/* CREATE ACCOUNT */}

          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() => {
                if (onRegister) {
                  onRegister();
                }
              }}
            >
              Create Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;