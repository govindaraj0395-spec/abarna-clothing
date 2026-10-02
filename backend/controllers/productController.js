const pool = require("../config/db");

/* ================================
   GET ALL PRODUCTS
================================ */

const getProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(`
      SELECT
        id,
        name,
        category,
        price,
        stock,
        image,
        description,
        created_at,
        updated_at
      FROM products
      ORDER BY id DESC
    `);

    res.json({
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to fetch products.",
    });
  }
};

/* ================================
   ADD PRODUCT
================================ */

const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      image,
      description,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Product name, category and price are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative.",
      });
    }

    if (Number(stock || 0) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative.",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO products
      (name, category, price, stock, image, description)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category.trim(),
        Number(price),
        Number(stock || 0),
        image || null,
        description || null,
      ]
    );

    const [products] = await pool.execute(
      `SELECT *
       FROM products
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Product added successfully.",
      product: products[0],
    });
  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      message: "Failed to add product.",
    });
  }
};

/* ================================
   UPDATE PRODUCT
================================ */

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      price,
      stock,
      image,
      description,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Product name, category and price are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative.",
      });
    }

    if (Number(stock || 0) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative.",
      });
    }

    const [result] = await pool.execute(
      `UPDATE products
       SET
        name = ?,
        category = ?,
        price = ?,
        stock = ?,
        image = ?,
        description = ?
       WHERE id = ?`,
      [
        name.trim(),
        category.trim(),
        Number(price),
        Number(stock || 0),
        image || null,
        description || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const [products] = await pool.execute(
      `SELECT *
       FROM products
       WHERE id = ?`,
      [id]
    );

    res.json({
      message: "Product updated successfully.",
      product: products[0],
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product.",
    });
  }
};

/* ================================
   DELETE PRODUCT
================================ */

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      `DELETE FROM products
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product.",
    });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};