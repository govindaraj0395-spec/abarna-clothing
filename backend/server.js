const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());



app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});


// ==================================================
// HOME API
// ==================================================

app.get("/", (req, res) => {
  res.json({
    message: "Abarna Clothing API is running",
  });
});


// ==================================================
// AUTH ROUTES
// ==================================================

app.use(
  "/api/auth",
  authRoutes
);


// ==================================================
// ORDER ROUTES
// ==================================================

app.use(
  "/api/orders",
  orderRoutes
);

// ==================================================
// ADMIN ROUTES
// ==================================================

app.use(
  "/api/admin",
  adminRoutes
);


// ==================================================
// PRODUCT ROUTES
// ==================================================

app.use(
  "/api/products",
  productRoutes
);


// ==================================================
// SERVER
// ==================================================

const PORT =
  process.env.PORT || 5000;


const startServer = async () => {
  try {
    const connection =
      await pool.getConnection();

    await connection.ping();

    connection.release();

    console.log(
      "MySQL connected successfully."
    );

    app.listen(PORT, () => {
      console.log(
        `Backend server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MySQL connection failed:",
      error
    );
  }
};


startServer();