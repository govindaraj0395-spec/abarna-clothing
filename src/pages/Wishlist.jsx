import "./Wishlist.css";

function Wishlist({
  wishlist = [],
  setWishlist,
  addToCart,
  goTo,
}) {
  const getPrice = (price) => {
    if (typeof price === "number") {
      return price;
    }

    return (
      Number(
        String(price || "")
          .replace("₹", "")
          .replace(/,/g, "")
          .trim()
      ) || 0
    );
  };

  const formatPrice = (price) => {
    return `₹${getPrice(price).toLocaleString(
      "en-IN"
    )}`;
  };

  const removeFromWishlist = (id) => {
    setWishlist((currentWishlist) =>
      currentWishlist.filter(
        (item) => item.id !== id
      )
    );
  };

  const moveToCart = (product) => {
    if (typeof addToCart === "function") {
      addToCart(product);
    }

    removeFromWishlist(product.id);
  };

  /* ================= EMPTY WISHLIST ================= */

  if (wishlist.length === 0) {
    return (
      <section className="wishlist-page">

        <div className="wishlist-header">

          <p className="wishlist-eyebrow">
            ABARNA CLOTHING
          </p>

          <h1>
            My Wishlist
          </h1>

          <div className="wishlist-line"></div>

          <p>
            Your favourite pieces will appear here.
          </p>

        </div>


        <div className="empty-wishlist">

          <div className="empty-wishlist-icon">
            ♡
          </div>

          <p className="wishlist-empty-label">
            YOUR WISHLIST IS EMPTY
          </p>

          <h2>
            Save what you love
          </h2>

          <p>
            Tap the heart on any product
            to save it for later.
          </p>

          <button
            type="button"
            onClick={() => goTo("shop")}
          >
            EXPLORE COLLECTION →
          </button>

        </div>

      </section>
    );
  }


  return (
    <section className="wishlist-page">

      {/* ================= HEADER ================= */}

      <div className="wishlist-header">

        <p className="wishlist-eyebrow">
          ABARNA CLOTHING
        </p>

        <h1>
          My Wishlist
        </h1>

        <div className="wishlist-line"></div>

        <p>
          Pieces you loved and saved for later.
        </p>

      </div>


      {/* ================= PRODUCTS ================= */}

      <div className="wishlist-container">

        <div className="wishlist-top">

          <div>
            <span>
              SAVED COLLECTION
            </span>

            <h2>
              {wishlist.length}{" "}
              {wishlist.length === 1
                ? "Item"
                : "Items"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => goTo("shop")}
          >
            CONTINUE SHOPPING →
          </button>

        </div>


        <div className="wishlist-grid">

          {wishlist.map((product) => (

            <article
              className="wishlist-card"
              key={product.id}
            >

              <div className="wishlist-image">

                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <div className="wishlist-no-image">
                    ABARNA
                  </div>
                )}

                <button
                  type="button"
                  className="wishlist-heart"
                  onClick={() =>
                    removeFromWishlist(
                      product.id
                    )
                  }
                  aria-label="Remove from wishlist"
                >
                  ♥
                </button>

              </div>


              <div className="wishlist-details">

                <span>
                  {product.category ||
                    "FASHION"}
                </span>

                <h3>
                  {product.name}
                </h3>

                <p>
                  {formatPrice(
                    product.price
                  )}
                </p>


                <div className="wishlist-actions">

                  <button
                    type="button"
                    className="wishlist-cart-btn"
                    onClick={() =>
                      moveToCart(product)
                    }
                  >
                    ADD TO CART
                  </button>

                  <button
                    type="button"
                    className="wishlist-remove-btn"
                    onClick={() =>
                      removeFromWishlist(
                        product.id
                      )
                    }
                  >
                    REMOVE
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Wishlist;