import React, { useState } from "react";
import "./AddProjectMaterialModal.css";

const AddProjectMaterialModal = ({ onClose, onAddMaterial, existingMaterials = [] }) => {
  const [formData, setFormData] = useState({
    materialName: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.materialName.trim();
    const quantity = parseInt(formData.quantity, 10);

    if (!name || isNaN(quantity) || quantity <= 0) return;

    onAddMaterial({ name, quantity });
    onClose();
  };

  return (
    <div className="tt-modal-overlay" onMouseDown={onClose}>
      <div className="tt-modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="tt-close" onClick={onClose}>
          ×
        </button>

        <div className="tt-modal-head">
          <h3>Add Material to Project</h3>
          <p className="muted">Add a new material or increase quantity for existing ones</p>
        </div>

        <form className="tt-form" onSubmit={handleSubmit}>
          <div className="tt-row">
            <label>Material Name</label>
            <input
              name="materialName"
              value={formData.materialName}
              onChange={handleChange}
              placeholder="e.g. Cement"
              list="existingMaterialsList"
              required
            />
            <datalist id="existingMaterialsList">
              {existingMaterials.map((m, idx) => (
                <option key={idx} value={m.name} />
              ))}
            </datalist>
          </div>

          <div className="tt-row">
            <label>Quantity</label>
            <input
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
            />
          </div>

          <div className="tt-actions">
            <button type="button" className="tt-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="tt-create">
              Add Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectMaterialModal;
