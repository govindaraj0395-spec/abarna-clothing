import { useState } from "react";
import "./Auth.css";

function Auth({ user, setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!form.email || !form.password) {
        alert("Please enter email and password");
        return;
      }

      const savedUser = JSON.parse(
        localStorage.getItem("abarnaUser")
      );

      if (
        savedUser &&
        savedUser.email === form.email &&
        savedUser.password === form.password
      ) {
        setUser(savedUser);
        alert("Login successful!");
      } else {
        alert("Invalid email or password");
      }
    } else {
      if (!form.name || !form.email || !form.password) {
        alert("Please fill all fields");
        return;
      }

      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      localStorage.setItem(
        "abarnaUser",
        JSON.stringify(newUser)
      );

      setUser(newUser);

      alert("Registration successful!");
    }

    setForm({
      name: "",
      email: "",
      password: "",
    });
  };

  const logout = () => {
    setUser(null);
    alert("Logged out successfully!");
  };

  if (user) {
    return (
      <section className="auth-page" id="account">
        <div className="account-card">
          <p className="auth-small">
            ABARNA CLOTHING
          </p>

          <h1>Welcome, {user.name}</h1>

          <p className="account-email">
            {user.email}
          </p>

          <button
            className="auth-btn"
            onClick={logout}
          >
            LOGOUT
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page" id="account">

      <div className="auth-card">

        <div className="auth-heading">
          <p className="auth-small">
            ABARNA CLOTHING
          </p>

          <h1>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p>
            {isLogin
              ? "Login to continue shopping."
              : "Create your account and start shopping."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            {isLogin ? "LOGIN" : "REGISTER"}
          </button>

        </form>

        <div className="auth-switch">

          <span>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);

              setForm({
                name: "",
                email: "",
                password: "",
              });
            }}
          >
            {isLogin ? "REGISTER" : "LOGIN"}
          </button>

        </div>

      </div>

    </section>
  );
}

export default Auth;