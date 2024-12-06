import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductList from "./ProductList";
import Cart from "./Cart";
import "boxicons/css/boxicons.min.css";
import "./Dashboard.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    loadCartItems();

    const handleClickOutside = (event) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        !event.target.closest(".add-cart") &&
        isCartOpen
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOrderHistoryClick = () => {
    navigate("/order-history");
    setIsUserMenuOpen(false); //close user menu
  };

  const handleAddToCart = (product) => {
    if (product.inventory > 0) {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="dashboard" ref={dashboardRef}>
      <header>
        <div className="nav container">
          <span className="logo">Better Buy</span>
          <div className="nav-right">
            <div className="user-menu-container">
              <div
                className="user-icon"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <i className="bx bx-user"></i>
              </div>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <i className="bx bx-user"></i>
                    Profile
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={handleOrderHistoryClick}
                  >
                    <i className="bx bx-history"></i>
                    Order History
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <i className="bx bx-log-out"></i>
                    Logout
                  </div>
                </div>
              )}
            </div>
            <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
              <i
                className="bx bx-shopping-bag"
                data-quantity={cartItems.length}
              ></i>
            </div>
          </div>
        </div>
      </header>

      <ProductList
        products={products}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onAddToCart={handleAddToCart}
      />

      <Cart
        isOpen={isCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        cartRef={cartRef}
      />
    </div>
  );
}

export default Dashboard;
