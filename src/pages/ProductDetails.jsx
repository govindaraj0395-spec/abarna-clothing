import "./ProductDetails.css";

function ProductDetails({
  product,
  setSelectedProduct,
  addToCart,
  toggleWishlist,
  wishlist = [],
  goTo,
}) {
  if (!product) {
    return null;
  }

  const isLiked = wishlist.some(
    (item) => item.id === product.id
  );

  const handleBack = () => {
    if (goTo) {
      goTo("shop");
    } else {
      setSelectedProduct(null);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <section className="product-details-page">

      <div className="product-details-wrapper">

        {/* IMAGE */}

        <div className="product-details-image-box">

          <img
            src={product.image}
            alt={product.name}
          />

          <span className="details-image-label">
            ABARNA
          </span>

        </div>

        {/* INFORMATION */}

        <div className="product-details-content">

          <p className="details-brand">
            ABARNA CLOTHING
          </p>

          <p className="details-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          <div className="details-line"></div>

          <h2>
            {product.price}
          </h2>

          <p className="details-description">
            {product.description ||
              "Discover elegant fashion designed with comfort, quality and timeless style."}
          </p>

          {/* SIZE */}

          <div className="size-section">

            <div className="size-heading">
              <span>
                SELECT SIZE
              </span>

              <small>
                Required
              </small>
            </div>

            <div className="sizes">

              <button>S</button>
              <button>M</button>
              <button>L</button>
              <button>XL</button>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="details-actions">

            <button
              className="details-add-cart"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>

            <button
              className={
                isLiked
                  ? "details-wishlist active"
                  : "details-wishlist"
              }
              onClick={handleWishlist}
            >
              {isLiked ? "♥" : "♡"}
              &nbsp;
              {isLiked
                ? "IN WISHLIST"
                : "ADD TO WISHLIST"}
            </button>

          </div>

          {/* BACK */}

          <button
            className="back-collection"
            onClick={handleBack}
          >
            ← BACK TO COLLECTION
          </button>

          {/* INFO */}

          <div className="details-extra">

            <div>
              <span>✓</span>
              Premium quality fashion
            </div>

            <div>
              <span>✓</span>
              Elegant everyday styling
            </div>

            <div>
              <span>✓</span>
              Designed by ABARNA CLOTHING
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductDetails;