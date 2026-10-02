const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUser] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, phone, password)
       VALUES (?, ?, ?, ?)`,
      [
        name.trim(),
        normalizedEmail,
        phone?.trim() || null,
        hashedPassword,
      ]
    );

    const token = jwt.sign(
      {
        id: result.insertId,
        role: "customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      `SELECT id, name, email, phone, password, role
       FROM users
       WHERE email = ?`,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete user.password;

    res.json({
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      `SELECT id, name, email, phone, password, role
       FROM users
       WHERE email = ?`,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "This account does not have admin access.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete user.password;

    res.json({
      message: "Admin login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
};