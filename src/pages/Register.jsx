import { useState } from "react";
import "./Register.css";

const API_URL = "http://localhost:5000";

function Register({
  onRegisterSuccess,
  onLogin,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert(
        "Password and Confirm Password do not match."
      );
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Registration failed."
        );
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert(
        "CREATE ACCOUNT SUCCESS! 🎉"
      );

      if (onRegisterSuccess) {
        onRegisterSuccess(data.user);
      }

    } catch (error) {
      console.error(
        "Register error:",
        error
      );

      alert(
        "Backend connection failed. Please make sure the server is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* ================= LEFT ================= */}

        <div className="register-left">

          <div className="register-brand">
            ABARNA
          </div>

          <div className="register-left-content">

            <p className="register-label">
              ABARNA CLOTHING
            </p>

            <h1>
              Join ABARNA
            </h1>

            <p>
              Create your account and discover
              elegant fashion made for you.
            </p>

            <div className="register-line"></div>

            <span>
              Elegance in Every Thread
            </span>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="register-card">

          <div className="register-heading">

            <p>
              WELCOME TO ABARNA
            </p>

            <h2>
              Create Account
            </h2>

            <span>
              Join us and start your shopping journey
            </span>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="register-form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>

            {/* EMAIL */}

            <div className="register-form-group">

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

            {/* PHONE */}

            <div className="register-form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

            </div>

            {/* PASSWORD */}

            <div className="register-form-row">

              <div className="register-form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="register-form-group">

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading
                ? "CREATING ACCOUNT..."
                : "CREATE ACCOUNT →"}
            </button>

          </form>

          {/* LOGIN */}

          <div className="login-link">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => {
                if (onLogin) {
                  onLogin();
                }
              }}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;