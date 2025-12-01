import React, { useState } from "react";
import "./IncreaseMaterialModal.css";

const IncreaseMaterialModal = ({ material, onClose, onIncrease }) => {
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }
    onIncrease(material.name, value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container small">
        <h2 className="modal-title">Increase Material</h2>
        <p>
          <strong>{material.name}</strong> currently has{" "}
          <span className="highlight">{material.quantity}</span> units.
        </p>

        <input
          type="number"
          placeholder="Enter quantity to add"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="modal-actions">
          <button className="tt-small-btn add" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="tt-small-btn close" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncreaseMaterialModal;
