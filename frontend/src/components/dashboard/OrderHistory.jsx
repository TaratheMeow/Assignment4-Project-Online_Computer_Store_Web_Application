import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log("Orders response:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-history">
      <div className="header-with-back">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <i className="bx bx-arrow-back"></i>
          Back to Dashboard
        </button>
        <h2>Order History</h2>
      </div>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <div className="order-info">
                  <span>Order #{order._id.slice(-6)}</span>
                  <span>
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Status:{" "}
                    <span className={`status ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </span>
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-product">
                    <p>{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${(item.price || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="order-summary">
                <p>
                  Subtotal: $
                  {(
                    (order.total || 0) -
                    (order.tax || 0) -
                    (order.shipping || 0)
                  ).toFixed(2)}
                </p>
                <p>Tax: ${(order.tax || 0).toFixed(2)}</p>
                <p>Shipping: ${(order.shipping || 0).toFixed(2)}</p>
                <p className="total">Total: ${(order.total || 0).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
