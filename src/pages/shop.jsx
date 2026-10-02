import "./shop.css";
import { useState } from "react";

function Shop({
  wishlist = [],
  addToCart,
  toggleWishlist,
  openProductDetails,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const products = [
    {
      id: 1,
      name: "Elegant Floral Dress",
      price: "₹1,499",
      category: "Women",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
      description:
        "Elegant floral dress designed with a graceful silhouette and comfortable fabric.",
    },
    {
      id: 2,
      name: "Classic Black Dress",
      price: "₹1,799",
      category: "Women",
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
      description:
        "A timeless black dress with a premium look for evening occasions.",
    },
    {
      id: 3,
      name: "Premium Summer Dress",
      price: "₹1,299",
      category: "New Arrivals",
      image:
        "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=900&q=80",
      description:
        "Lightweight summer dress created for comfort and effortless elegance.",
    },
    {
      id: 4,
      name: "Traditional Ethnic Wear",
      price: "₹1,999",
      category: "Ethnic",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
      description:
        "Traditional ethnic wear with a modern premium finish.",
    },
    {
      id: 5,
      name: "Minimal White Dress",
      price: "₹1,599",
      category: "Women",
      image:
        "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=80",
      description:
        "Minimal white dress with clean styling and a sophisticated finish.",
    },
    {
      id: 6,
      name: "Luxury Party Wear",
      price: "₹2,499",
      category: "New Arrivals",
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
      description:
        "Luxury party wear designed to create an elegant statement.",
    },
    {
      id: 7,
      name: "Modern Casual Dress",
      price: "₹1,699",
      category: "Women",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      description:
        "Modern casual styling suitable for everyday fashion.",
    },
    {
      id: 8,
      name: "Designer Saree",
      price: "₹2,299",
      category: "Ethnic",
      image:
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
      description:
        "Premium designer saree with a graceful traditional appearance.",
    },
    {
      id: 9,
      name: "Evening Gown",
      price: "₹2,799",
      category: "New Arrivals",
      image:
        "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?auto=format&fit=crop&w=900&q=80",
      description:
        "Elegant evening gown designed for special occasions.",
    },
    {
      id: 10,
      name: "Floral Summer Dress",
      price: "₹1,399",
      category: "Women",
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      description:
        "Fresh floral styling with a comfortable summer silhouette.",
    },
    {
      id: 11,
      name: "Premium Kurti",
      price: "₹1,899",
      category: "Ethnic",
      image:
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
      description:
        "Premium kurti combining traditional design with modern elegance.",
    },
    {
      id: 12,
      name: "Festive Collection",
      price: "₹2,199",
      category: "Ethnic",
      image:
        "https://images.unsplash.com/photo-1585488430801-b7541017f2e6?auto=format&fit=crop&w=900&q=80",
      description:
        "Festive collection created for celebrations and special moments.",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      activeFilter === "All" ||
      product.category === activeFilter;

    const searchMatch =
      product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <section className="shop-page">

      {/* HEADER */}

      <div className="shop-header">

        <p className="shop-eyebrow">
          ABARNA CLOTHING
        </p>

        <h1>
          Shop Our Collection
        </h1>

        <div className="shop-line"></div>

        <p className="shop-description">
          Discover elegant styles designed for every occasion.
        </p>

      </div>

      {/* SEARCH */}

      <div className="premium-search">

        <span>
          ⌕
        </span>

        <input
          type="text"
          value={searchTerm}
          placeholder="Search dresses, sarees, kurtis..."
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => setSearchTerm("")}
          >
            ×
          </button>
        )}

      </div>

      {/* FILTER */}

      <div className="premium-filter">

        {[
          "All",
          "Women",
          "Ethnic",
          "New Arrivals",
        ].map((category) => (

          <button
            key={category}
            className={
              activeFilter === category
                ? "filter-active"
                : ""
            }
            onClick={() =>
              setActiveFilter(category)
            }
          >
            {category}
          </button>

        ))}

      </div>

      {/* PRODUCTS */}

      {filteredProducts.length === 0 ? (

        <div className="no-products">

          <div className="no-product-icon">
            ♡
          </div>

          <h2>
            No Products Found
          </h2>

          <p>
            Try another search or category.
          </p>

          <button
            onClick={() => {
              setSearchTerm("");
              setActiveFilter("All");
            }}
          >
            VIEW ALL PRODUCTS
          </button>

        </div>

      ) : (

        <div className="product-grid">

          {filteredProducts.map((product) => {

            const isLiked = wishlist.some(
              (item) => item.id === product.id
            );

            return (

              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button
                    className={
                      isLiked
                        ? "premium-heart liked"
                        : "premium-heart"
                    }
                    onClick={() =>
                      toggleWishlist(product)
                    }
                  >
                    {isLiked ? "♥" : "♡"}
                  </button>

                  <button
                    className="quick-view"
                    onClick={() =>
                      openProductDetails(product)
                    }
                  >
                    QUICK VIEW
                  </button>

                </div>

                <div className="product-info">

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-price">
                    {product.price}
                  </p>

                  <button
                    className="add-cart"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    ADD TO CART
                  </button>

                </div>

              </article>

            );
          })}

        </div>

      )}

    </section>
  );
}

export default Shop;