import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleInputChange = (id, field, value) => {
    // 添加输入验证
    if (field === "price" && value < 0) return;
    if (field === "inventory" && value < 0) return;

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const saveProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const product = products.find((p) => p._id === productId);

      if (!product) {
        throw new Error("Product not found");
      }

      const updates = {
        name: product.name,
        category: product.category,
        manufacturer: product.manufacturer,
        price: product.price,
        inventory: product.inventory,
      };

      console.log("Sending update request for product:", productId);
      console.log("Update data:", updates);

      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save product");
      }

      const updatedProduct = await response.json();
      console.log("Server response:", updatedProduct);

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? { ...p, ...updatedProduct } : p
        )
      );

      alert("Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      setError(`Failed to save product: ${error.message}`);
    }
  };

  const handleEdit = (productId) => {
    setEditingId(productId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Inventory Management</h2>
      {error && <div className="error-message">{error}</div>}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Manufacturer</th>
            <th>Price</th>
            <th>Inventory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="inventory-row">
              <td>
                <img
                  src={`http://localhost:5000/${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      handleInputChange(product._id, "name", e.target.value)
                    }
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    value={product.category}
                    onChange={(e) =>
                      handleInputChange(product._id, "category", e.target.value)
                    }
                  />
                ) : (
                  product.category
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    value={product.manufacturer}
                    onChange={(e) =>
                      handleInputChange(
                        product._id,
                        "manufacturer",
                        e.target.value
                      )
                    }
                  />
                ) : (
                  product.manufacturer
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      handleInputChange(
                        product._id,
                        "price",
                        parseFloat(e.target.value)
                      )
                    }
                    min="0"
                    step="0.01"
                  />
                ) : (
                  `$${product.price}`
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    type="number"
                    value={product.inventory}
                    onChange={(e) =>
                      handleInputChange(
                        product._id,
                        "inventory",
                        parseInt(e.target.value)
                      )
                    }
                    min="0"
                  />
                ) : (
                  product.inventory
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <button
                    className="save-button"
                    onClick={() => {
                      saveProduct(product._id);
                      setEditingId(null);
                    }}
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
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

export default Inventory;
