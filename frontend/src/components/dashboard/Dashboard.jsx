// frontend/src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import Cart from "./Cart";
import "boxicons/css/boxicons.min.css";
import "./Dashboard.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // 加载产品数据
    fetchProducts();
    // 从 localStorage 加载购物车数据
    loadCartItems();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const loadCartItems = () => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(savedCart);
  };

  return (
    <div className="dashboard">
      <header>
        <div className="nav container">
          <a href="#" className="logo">
            Better Buy
          </a>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            <i
              className="bx bx-shopping-bag"
              data-quantity={cartItems.length}
            ></i>
          </div>
        </div>
      </header>

      <ProductList
        products={products}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </div>
  );
}

export default Dashboard;
