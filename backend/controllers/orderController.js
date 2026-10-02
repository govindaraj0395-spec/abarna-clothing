const pool = require("../config/db");

const createOrder = async (req, res) => {
  let connection;

  try {
    const userId = req.user.id;

    const {
      fullName,
      phone,
      address,
      city,
      pincode,
      paymentMethod,
      items,
      totalAmount,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !pincode
    ) {
      return res.status(400).json({
        message: "All delivery details are required.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    if (!totalAmount || Number(totalAmount) <= 0) {
      return res.status(400).json({
        message: "Invalid order total.",
      });
    }

    // =========================
    // CONNECTION
    // =========================

    connection = await pool.getConnection();

    await connection.beginTransaction();

    // =========================
    // ORDER NUMBER
    // =========================

    const orderNumber =
      "ABR" +
      Date.now().toString().slice(-10);

    // =========================
    // CREATE ORDER
    // =========================

    const [orderResult] = await connection.execute(
      `INSERT INTO orders
      (
        user_id,
        order_number,
        full_name,
        phone,
        address,
        city,
        pincode,
        payment_method,
        total_amount,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        orderNumber,
        fullName.trim(),
        phone.trim(),
        address.trim(),
        city.trim(),
        pincode.trim(),
        paymentMethod || "Cash on Delivery",
        Number(totalAmount),
        "Pending",
      ]
    );

    const orderId = orderResult.insertId;

    // =========================
    // CREATE ORDER ITEMS
    // =========================

    for (const item of items) {
      const price = Number(
        String(item.price).replace(/[₹,]/g, "")
      );

      const quantity =
        Number(item.quantity) || 1;

      await connection.execute(
        `INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          price,
          quantity,
          image
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          String(item.id || ""),
          item.name,
          price,
          quantity,
          item.image || null,
        ]
      );
    }

    // =========================
    // COMMIT
    // =========================

    await connection.commit();

    res.status(201).json({
      message: "Order placed successfully.",
      order: {
        id: orderId,
        orderNumber,
        totalAmount: Number(totalAmount),
        status: "Pending",
      },
    });
  } catch (error) {
    // =========================
    // ROLLBACK
    // =========================

    if (connection) {
      await connection.rollback();
    }

    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to place order.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};


// ==================================================
// GET MY ORDERS
// ==================================================

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await pool.execute(
      `SELECT
        id,
        order_number,
        full_name,
        phone,
        address,
        city,
        pincode,
        payment_method,
        total_amount,
        status,
        created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    for (const order of orders) {
      const [items] = await pool.execute(
        `SELECT
          id,
          product_id,
          product_name,
          price,
          quantity,
          image
         FROM order_items
         WHERE order_id = ?`,
        [order.id]
      );

      order.items = items;
    }

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders.",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};