import React, { useState } from "react";
import "./UsedAllMaterialsModal.css";

const UsedAllMaterialsModal = ({ task, project, onUpdate, onClose }) => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const handleSelect = (name) => {
    setSelectedMaterials((prev) =>
      prev.includes(name)
        ? prev.filter((m) => m !== name)
        : [...prev, name]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const used = task.materials
      .filter((m) => selectedMaterials.includes(m.name))
      .map((m) => ({ ...m, quantityUsed: m.quantity }));

    onUpdate(used);
    onClose();
  };

  return (
    <div className="tt-modal-overlay" onMouseDown={onClose}>
      <div className="tt-modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="tt-close" onClick={onClose}>×</button>
        <h3>Used All Materials for {task.name}</h3>
        <p className="muted">Select the materials completely used up.</p>

        <form onSubmit={handleSubmit}>
          <ul className="material-list">
            {task.materials.map((mat, i) => (
              <li key={i}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(mat.name)}
                    onChange={() => handleSelect(mat.name)}
                  />
                  {mat.name} — {mat.quantity} units
                </label>
              </li>
            ))}
          </ul>

          <div className="tt-actions">
            <button type="button" className="tt-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="tt-create">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsedAllMaterialsModal;
