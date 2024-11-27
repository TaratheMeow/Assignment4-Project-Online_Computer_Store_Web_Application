// frontend/src/components/dashboard/Cart.jsx
import React from "react";

function Cart({ isOpen, onClose, cartItems, setCartItems }) {
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: parseInt(newQuantity) };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.13;
    const shipping = subtotal > 0 ? 20 : 0;
    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
    };
  };
  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/stripe-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const checkoutUrl = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process payment.");
    }
  };

  const totals = calculateTotal();

  return (
    <div className={`cart ${isOpen ? "active" : ""}`}>
      <h2 className="cart-title">Your Cart</h2>
      <i className="bx bx-x" id="close-cart" onClick={onClose}></i>

      <div className="cart-content">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-box">
            <img src={`http://localhost:5000/${item.image}`} alt={item.name} />
            <div className="detail-box">
              <div className="cart-product-title">{item.name}</div>
              <div className="cart-price">${item.price}</div>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, e.target.value)}
                min="1"
                max={item.inventory}
                className="cart-quantity"
              />
            </div>
            <i
              className="bx bx-trash-alt cart-remove"
              onClick={() => removeItem(item.id)}
            ></i>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-item">
          <span>Subtotal:</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Tax (13%):</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Shipping:</span>
          <span>${totals.shipping.toFixed(2)}</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>

      <button className="btn-buy" onClick={handleCheckout}>
        Pay Now
      </button>
    </div>
  );
}

export default Cart;
