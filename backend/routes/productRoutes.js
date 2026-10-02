const express = require("express");

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/* Public - Shop can fetch products */
router.get("/", getProducts);

/* Admin only */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;