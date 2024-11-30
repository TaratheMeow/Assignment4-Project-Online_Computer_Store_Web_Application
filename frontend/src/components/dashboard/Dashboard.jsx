// frontend/src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  const { user } = useAuth();
  const navigate = useNavigate();

  // 使用 useCallback 包装 fetchProducts
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [user?.token]); // 只依赖于 token

  const loadCartItems = () => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(savedCart);
  };

  useEffect(() => {
    // 检查认证状态
    if (!user?.token) {
      navigate("/");
      return;
    }

    // 检查用户角色
    if (user.role !== "user") {
      navigate("/");
      return;
    }

    // 加载产品数据
    fetchProducts();
    // 从 localStorage 加载购物车数据
    loadCartItems();
  }, [user, navigate, fetchProducts]); // 添加 fetchProducts 到依赖数组

  return (
    <div className="dashboard">
      <header>
        <div className="nav container">
          <span className="logo">Better Buy</span>
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
