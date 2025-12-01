import React, { useState } from "react";
import "./UpdateMaterialModal.css";

const UpdateMaterialModal = ({ material, project, onConfirm, onClose }) => {
  const [addQty, setAddQty] = useState("");

  const projectMaterial = project.materials.find(
    (m) => m.name.toLowerCase() === material.name.toLowerCase()
  );
  const availableQty = projectMaterial ? projectMaterial.quantity : 0;

  const handleConfirm = () => {
    const addAmount = parseFloat(addQty);

    if (isNaN(addAmount) || addAmount <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }

    if (addAmount > availableQty) {
      alert(`You cannot add more than ${availableQty} (available in project).`);
      return;
    }

    // Call parent callback
    onConfirm({
      name: material.name,
      addedQuantity: addAmount,
      newTotal: material.quantity + addAmount,
    });

    // Close modal
    setAddQty("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="update-material-modal">
        <h2 className="modal-title">Update Material</h2>

        <div className="modal-info">
          <p>
            <strong>Material:</strong> {material.name}
          </p>
          <p>
            <strong>Currently in task:</strong> {material.quantity}
          </p>
          <p>
            <strong>Available in project:</strong> {availableQty}
          </p>
        </div>

        <div className="modal-input-group">
          <label>Quantity to Add:</label>
          <input
            type="number"
            value={addQty}
            onChange={(e) => setAddQty(e.target.value)}
            placeholder="Enter amount to add"
          />
        </div>

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

export default UpdateMaterialModal;
