
import React, { useEffect, useState } from "react";
import "./AdminProducts.css";

import API_URL from "../config/api";

function AdminProducts({ goTo }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "Women",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  /* ================================
     FETCH PRODUCTS
  ================================= */

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products."
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);

      alert(
        error.message || "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     FORM CHANGE
  ================================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================================
     RESET FORM
  ================================= */

  const resetForm = () => {
    setForm({
      name: "",
      category: "Women",
      price: "",
      stock: "",
      image: "",
      description: "",
    });

    setEditingId(null);
  };

  /* ================================
     ADD / UPDATE PRODUCT
  ================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!form.category.trim()) {
      alert("Please select category.");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      alert("Please enter valid stock.");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin login required.");
      goTo("admin-login");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/products/${editingId}`
        : `${API_URL}/products`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image.trim(),
          description: form.description.trim(),
        }),
      });

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        alert(
          data.message ||
            "Admin access denied."
        );

        goTo("admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save product."
        );
      }

      alert(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      alert(
        error.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================
     EDIT PRODUCT
  ================================= */

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      category: product.category || "Women",
      price: product.price ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      description: product.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================================
     DELETE PRODUCT
  ================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin login required.");
      goTo("admin-login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );

        alert(
          data.message ||
            "Admin access denied."
        );

        goTo("admin-login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete product."
        );
      }

      alert(
        "Product deleted successfully!"
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchProducts();
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete product."
      );
    }
  };

  /* ================================
     SEARCH
  ================================= */

  const filteredProducts =
    products.filter((product) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        String(product.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(product.category || "")
          .toLowerCase()
          .includes(searchText)
      );
    });

  /* ================================
     PRICE FORMAT
  ================================= */

  const formatPrice = (price) => {
    return `â‚¹${Number(
      price || 0
    ).toLocaleString("en-IN")}`;
  };

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="products-loading">
        <div className="products-spinner"></div>

        <h2>
          Loading Products...
        </h2>

        <p>
          Please wait while we load your
          products.
        </p>
      </div>
    );
  }

  /* ================================
     PAGE
  ================================= */

  return (
    <div className="admin-products-page">

      {/* HEADER */}

      <header className="products-header">

        <div>
          <p className="products-brand">
            ABARNA CLOTHING
          </p>

          <h1>
            Product Management
          </h1>

          <p className="products-subtitle">
            Add, edit, delete and manage
            your store products.
          </p>
        </div>

        <div className="products-header-actions">

          <button
            className="back-dashboard-btn"
            onClick={() =>
              goTo("admin-dashboard")
            }
          >
            â† DASHBOARD
          </button>

          <button
            className="view-store-btn"
            onClick={() =>
              goTo("shop")
            }
          >
            VIEW STORE
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="products-container">

        {/* FORM */}

        <section className="product-form-section">

          <div className="product-form-heading">

            <div>
              <p className="section-label">
                {editingId
                  ? "EDIT PRODUCT"
                  : "ADD PRODUCT"}
              </p>

              <h2>
                {editingId
                  ? "Update Product"
                  : "Create New Product"}
              </h2>
            </div>

            {editingId && (
              <button
                className="cancel-edit-btn"
                type="button"
                onClick={resetForm}
              >
                CANCEL EDIT
              </button>
            )}

          </div>

          <form
            className="product-form"
            onSubmit={handleSubmit}
          >

            <div className="form-field">

              <label>
                PRODUCT NAME
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Elegant Floral Dress"
              />

            </div>

            <div className="form-field">

              <label>
                CATEGORY
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Women">
                  Women
                </option>

                <option value="Ethnic">
                  Ethnic
                </option>

                <option value="New Arrivals">
                  New Arrivals
                </option>

                <option value="Party Wear">
                  Party Wear
                </option>

                <option value="Casual">
                  Casual
                </option>
              </select>

            </div>

            <div className="form-row">

              <div className="form-field">

                <label>
                  PRICE
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="1499"
                  min="0"
                />

              </div>

              <div className="form-field">

                <label>
                  STOCK
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="20"
                  min="0"
                />

              </div>

            </div>

            <div className="form-field">

              <label>
                IMAGE URL
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

            </div>

            <div className="form-field">

              <label>
                DESCRIPTION
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description..."
                rows="4"
              />

            </div>

            <button
              type="submit"
              className="save-product-btn"
              disabled={saving}
            >
              {saving
                ? "SAVING..."
                : editingId
                ? "UPDATE PRODUCT"
                : "ADD PRODUCT"}
            </button>

          </form>

        </section>

        {/* PRODUCTS */}

        <section className="products-list-section">

          <div className="products-list-heading">

            <div>
              <p className="section-label">
                INVENTORY
              </p>

              <h2>
                Your Products
              </h2>
            </div>

            <span className="product-count">
              {products.length} PRODUCTS
            </span>

          </div>

          {/* SEARCH */}

          <div className="products-search">

            <span>âŒ•</span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
            />

          </div>

          {/* EMPTY */}

          {filteredProducts.length === 0 ? (
            <div className="products-empty">

              <div className="empty-product-icon">
                ðŸ‘—
              </div>

              <h3>
                No Products Found
              </h3>

              <p>
                Add your first product using
                the form above.
              </p>

            </div>
          ) : (

            <div className="products-grid">

              {filteredProducts.map(
                (product) => (

                  <article
                    className="admin-product-card"
                    key={product.id}
                  >

                    {/* IMAGE */}

                    <div className="admin-product-image">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="no-product-image">
                          ABARNA
                        </div>
                      )}

                      <span
                        className={`stock-badge ${
                          Number(
                            product.stock
                          ) === 0
                            ? "out"
                            : Number(
                                product.stock
                              ) <= 5
                            ? "low"
                            : "available"
                        }`}
                      >
                        {Number(
                          product.stock
                        ) === 0
                          ? "OUT OF STOCK"
                          : `${product.stock} IN STOCK`}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="admin-product-details">

                      <p className="product-category">
                        {product.category}
                      </p>

                      <h3>
                        {product.name}
                      </h3>

                      <p className="product-description">
                        {product.description ||
                          "No description added."}
                      </p>

                      <div className="product-price-stock">

                        <strong>
                          {formatPrice(
                            product.price
                          )}
                        </strong>

                        <span>
                          Stock:{" "}
                          {product.stock}
                        </span>

                      </div>

                      {/* ACTIONS */}

                      <div className="product-actions">

                        <button
                          className="edit-product-btn"
                          onClick={() =>
                            handleEdit(
                              product
                            )
                          }
                        >
                          EDIT
                        </button>

                        <button
                          className="delete-product-btn"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                        >
                          DELETE
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminProducts;


