// frontend/src/components/dashboard/ProductList.jsx
import React, { useState } from "react";

function ProductList({ products, cartItems, setCartItems }) {
  const [category, setCategory] = useState("all");
  const [manufacturer, setManufacturer] = useState("");

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity + 1 > product.inventory) {
        alert("Insufficient inventory.");
        return;
      }
      const updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
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
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="Search manufacturer"
          />
        </label>
      </div>

      <div className="shop-content">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-box">
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-inventory">In Stock: {product.inventory}</p>
            <span className="price">${product.price}</span>
            <button
              className="add-cart"
              onClick={() => addToCart(product)}
              disabled={product.inventory === 0}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductList;
