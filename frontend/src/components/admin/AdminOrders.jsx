import React, { useState, useEffect } from "react";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/orders/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Please enter a reason for cancellation (optional):");
    if (reason === null) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) => (order._id === orderId ? updatedOrder : order))
      );

      alert("Order cancelled successfully");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Order Management</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>{order.userId?.email || order.userId}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <span className={`status ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                {order.status === "cancelled" && order.cancelReason && (
                  <div className="cancel-reason">
                    Reason: {order.cancelReason}
                  </div>
                )}
              </td>
              <td>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    {item.name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                {order.status !== "cancelled" && (
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
