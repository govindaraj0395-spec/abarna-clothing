import "./cart.css";

function Cart({
  cart = [],
  setCart,
  removeFromCart,
  updateQuantity,
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
    return `₹${getPrice(price).toLocaleString("en-IN")}`;
  };

  const getQuantity = (item) => {
    return Number(item.quantity) > 0
      ? Number(item.quantity)
      : 1;
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      getPrice(item.price) *
        getQuantity(item),
    0
  );

  const handleIncrease = (id) => {
    if (typeof updateQuantity === "function") {
      updateQuantity(id, 1);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                getQuantity(item) + 1,
            }
          : item
      )
    );
  };

  const handleDecrease = (id) => {
    if (typeof updateQuantity === "function") {
      updateQuantity(id, -1);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                getQuantity(item) - 1,
                1
              ),
            }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    if (typeof removeFromCart === "function") {
      removeFromCart(id);
      return;
    }

    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };

  /* ================= EMPTY CART ================= */

  if (cart.length === 0) {
    return (
      <section className="cart-page">

        <div className="cart-header">
          <p className="cart-eyebrow">
            ABARNA CLOTHING
          </p>

          <h1>Your Cart</h1>

          <div className="cart-line"></div>

          <p>
            Your selected pieces will appear here.
          </p>
        </div>

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛍
          </div>

          <p className="empty-label">
            YOUR SHOPPING BAG IS EMPTY
          </p>

          <h2>
            Nothing here yet
          </h2>

          <p>
            Discover our latest collection
            and find something made for you.
          </p>

          <button
            type="button"
            onClick={() => goTo("shop")}
          >
            CONTINUE SHOPPING →
          </button>

        </div>

      </section>
    );
  }

  return (
    <section className="cart-page">

      {/* ================= HEADER ================= */}

      <div className="cart-header">

        <p className="cart-eyebrow">
          ABARNA CLOTHING
        </p>

        <h1>Your Cart</h1>

        <div className="cart-line"></div>

        <p>
          Review your selected pieces
          before checkout.
        </p>

      </div>


      {/* ================= MAIN ================= */}

      <div className="cart-container">

        {/* ================= ITEMS ================= */}

        <div className="cart-products">

          <div className="cart-section-title">

            <div>
              <span>
                YOUR BAG
              </span>

              <h2>
                {cart.length}{" "}
                {cart.length === 1
                  ? "Item"
                  : "Items"}
              </h2>
            </div>

            <button
              type="button"
              className="continue-shopping"
              onClick={() => goTo("shop")}
            >
              ← CONTINUE SHOPPING
            </button>

          </div>


          {cart.map((item) => {

            const quantity =
              getQuantity(item);

            const itemTotal =
              getPrice(item.price) *
              quantity;

            return (
              <article
                className="cart-item"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="cart-item-image">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <div className="cart-no-image">
                      ABARNA
                    </div>
                  )}

                </div>


                {/* DETAILS */}

                <div className="cart-item-details">

                  <span className="cart-item-category">
                    {item.category ||
                      "FASHION"}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p className="cart-item-price">
                    {formatPrice(item.price)}
                  </p>

                  <button
                    type="button"
                    className="cart-remove"
                    onClick={() =>
                      handleRemove(item.id)
                    }
                  >
                    REMOVE
                  </button>

                </div>


                {/* QUANTITY */}

                <div className="cart-quantity">

                  <span>
                    QUANTITY
                  </span>

                  <div className="quantity-box">

                    <button
                      type="button"
                      onClick={() =>
                        handleDecrease(
                          item.id
                        )
                      }
                    >
                      −
                    </button>

                    <strong>
                      {quantity}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        handleIncrease(
                          item.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>


                {/* TOTAL */}

                <div className="cart-item-total">

                  <span>
                    ITEM TOTAL
                  </span>

                  <strong>
                    {formatPrice(
                      itemTotal
                    )}
                  </strong>

                </div>

              </article>
            );
          })}

        </div>


        {/* ================= SUMMARY ================= */}

        <aside className="cart-summary">

          <div className="summary-top">

            <span>
              ABARNA CLOTHING
            </span>

            <h2>
              Order Summary
            </h2>

          </div>


          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              {formatPrice(subtotal)}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Shipping
            </span>

            <strong className="free-shipping">
              FREE
            </strong>

          </div>


          <div className="summary-divider"></div>


          <div className="summary-total">

            <span>
              TOTAL
            </span>

            <strong>
              {formatPrice(subtotal)}
            </strong>

          </div>


          <p className="summary-note">
            Free shipping on your order.
            Cash on Delivery available.
          </p>


          <button
            type="button"
            className="checkout-btn"
            onClick={() =>
              goTo("checkout")
            }
          >
            PROCEED TO CHECKOUT →
          </button>


          <button
            type="button"
            className="summary-shop-btn"
            onClick={() =>
              goTo("shop")
            }
          >
            CONTINUE SHOPPING
          </button>

        </aside>

      </div>

    </section>
  );
}

export default Cart;