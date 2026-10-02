const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const [orderStats] = await pool.execute(`
      SELECT
        COUNT(*) AS totalOrders,
        COALESCE(SUM(total_amount), 0) AS totalSales,
        SUM(status = 'Pending') AS pendingOrders
      FROM orders
    `);

    const [customerStats] = await pool.execute(`
      SELECT COUNT(*) AS totalCustomers
      FROM users
      WHERE role = 'customer'
    `);

    const [recentOrders] = await pool.execute(`
      SELECT
        o.id,
        o.order_number,
        o.full_name,
        o.total_amount,
        o.status,
        o.created_at,
        u.email
      FROM orders o
      INNER JOIN users u
        ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    res.json({
      stats: {
        totalOrders: Number(orderStats[0].totalOrders || 0),
        totalSales: Number(orderStats[0].totalSales || 0),
        pendingOrders: Number(orderStats[0].pendingOrders || 0),
        totalCustomers: Number(
          customerStats[0].totalCustomers || 0
        ),
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      message: "Failed to load admin dashboard.",
    });
  }
};

module.exports = {
  getDashboardStats,
};