// frontend/src/components/dashboard/ProductList.jsx
import React, { useState } from "react";

function ProductList({ products, cartItems, setCartItems, onAddToCart }) {
  const [category, setCategory] = useState("all");
  const [manufacturer, setManufacturer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product) => {
    if (product.inventory > 0) {
      const existingItem = cartItems.find((item) => item.id === product._id);

      if (existingItem) {
        if (existingItem.quantity + 1 > product.inventory) {
          alert("Insufficient inventory.");
          return;
        }
        const updatedCart = cartItems.map((item) =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      } else {
        const newItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          inventory: product.inventory,
        };
        const updatedCart = [...cartItems, newItem];
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }

      onAddToCart(product);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesManufacturer =
      manufacturer === "" ||
      product.manufacturer.toLowerCase().includes(manufacturer.toLowerCase());
    return matchesCategory && matchesManufacturer;
  });

  return (
    <section className="shop container">
      <h2 className="section-title">Shop Products</h2>
      <div className="filter-container">
        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Desktops">Desktops</option>
            <option value="Laptops">Laptops</option>
            <option value="Monitors">Monitors</option>
            <option value="Accessories">Accessories</option>
          </select>
        </label>
        <label>
          Manufacturer:
          <input
            id="manufacturer-search"
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="Search manufacturer"
          />
        </label>
      </div>

      <div className="shop-content">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-box">
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              onClick={() => handleProductClick(product)}
              style={{ cursor: "pointer" }}
            />
            <h2
              className="product-name"
              onClick={() => handleProductClick(product)}
              style={{ cursor: "pointer" }}
            >
              {product.name}
            </h2>
            <p className="product-inventory">In Stock: {product.inventory}</p>
            <span className="price">${product.price}</span>
            <button
              className="add-cart"
              onClick={() => handleAddToCart(product)}
              disabled={product.inventory === 0}
            >
              <i className="bx bx-shopping-bag"></i>
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="details-modal">
          <div className="modal-content">
            <i className="bx bx-x close-modal" onClick={closeModal}></i>
            <h2>{selectedProduct.name}</h2>
            <img
              src={`http://localhost:5000/${selectedProduct.image}`}
              alt={selectedProduct.name}
            />
            <div className="product-details">
              <div className="product-rating">
                <span className="rating-stars">
                  {"★".repeat(Math.floor(selectedProduct.rating))}
                  {"☆".repeat(5 - Math.floor(selectedProduct.rating))}
                </span>
                <span className="rating-value">
                  {selectedProduct.rating.toFixed(1)} ★
                </span>
              </div>
              <p>
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p>
                <strong>Manufacturer:</strong> {selectedProduct.manufacturer}
              </p>
              <p>
                <strong>Price:</strong> ${selectedProduct.price}
              </p>
              <p>
                <strong>In Stock:</strong> {selectedProduct.inventory}
              </p>
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
            </div>
            <button
              className="btn-buy"
              onClick={() => {
                handleAddToCart(selectedProduct);
                closeModal();
              }}
              disabled={selectedProduct.inventory === 0}
            >
              <i className="bx bx-shopping-bag"></i>
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductList;
