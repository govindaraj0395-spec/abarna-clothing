import { useEffect, useState } from "react";
import "./Address.css";

function Address({ goTo }) {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem("address");

    if (savedAddress) {
      try {
        setAddress(JSON.parse(savedAddress));
        setSaved(true);
      } catch (error) {
        localStorage.removeItem("address");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (
      !address.fullName ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please fill all address details.");
      return;
    }

    localStorage.setItem(
      "address",
      JSON.stringify(address)
    );

    setSaved(true);

    alert("Address saved successfully!");
  };

  const removeAddress = () => {
    localStorage.removeItem("address");

    setAddress({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });

    setSaved(false);

    alert("Address removed.");
  };

  return (
    <section className="address-page">

      <div className="address-header">
        <p className="address-label">
          ABARNA CLOTHING
        </p>

        <h1>My Address</h1>

        <p>
          Save your delivery address for a faster checkout.
        </p>
      </div>

      <div className="address-container">

        <div className="address-card">

          <div className="address-card-title">
            <div>
              <span>DELIVERY ADDRESS</span>
              <h2>
                {saved ? "Saved Address" : "Add Address"}
              </h2>
            </div>

            {saved && (
              <span className="saved-badge">
                SAVED
              </span>
            )}
          </div>

          <form onSubmit={handleSave}>

            <div className="address-row">

              <div className="address-field">
                <label>FULL NAME</label>

                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="address-field">
                <label>PHONE NUMBER</label>

                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

            </div>

            <div className="address-field">
              <label>FULL ADDRESS</label>

              <textarea
                name="address"
                value={address.address}
                onChange={handleChange}
                placeholder="House / Flat / Street / Area"
                rows="4"
              />
            </div>

            <div className="address-row">

              <div className="address-field">
                <label>CITY</label>

                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="address-field">
                <label>PINCODE</label>

                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>

            </div>

            <div className="address-actions">

              <button
                type="submit"
                className="save-address-btn"
              >
                SAVE ADDRESS
              </button>

              {saved && (
                <button
                  type="button"
                  className="remove-address-btn"
                  onClick={removeAddress}
                >
                  REMOVE ADDRESS
                </button>
              )}

            </div>

          </form>

        </div>

        <div className="address-side-card">

          <div className="address-icon">
            📍
          </div>

          <h3>
            Easy Checkout
          </h3>

          <p>
            Save your delivery address once and
            use it quickly when placing future orders.
          </p>

          <button
            className="back-shop-btn"
            onClick={() => goTo("shop")}
          >
            CONTINUE SHOPPING →
          </button>

        </div>

      </div>

    </section>
  );
}

export default Address;