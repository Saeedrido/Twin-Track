import React, { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import ModalShell from "./ModalShell";
import { toast } from "react-toastify";

const ProjectMaterialsModal = ({ onClose, projectId, materials = [], onAddMaterial }) => {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Normalize existing materials (for checking duplicates)
  const normalizedMaterials = materials.map((m) => ({
    id: m.id ?? m.materialId,
    name: m.name,
  }));

  // ✅ Add new project material
  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Enter material name.");
      return;
    }

    if (!qty || qty <= 0) {
      toast.error("Enter a valid quantity.");
      return;
    }

    // ✅ Prevent duplicate material creation
    const exists = normalizedMaterials.some(
      (m) => m.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
      toast.error(`"${name}" has already been added. 
To increase its quantity, go to the Materials tab.`);
      return;
    }

    try {
      setIsAdding(true);
      await onAddMaterial({ name, TotalQuantity: qty, projectId });
      toast.success("Material added.");

      setName("");
      setQty("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <ModalShell title="Add Material to Project" onClose={isAdding ? undefined : onClose}>

      {/* ✅ Material Name */}
      <div className="form-row">
        <label>Material Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Cement"
          disabled={isAdding}
        />
      </div>

      {/* ✅ Quantity */}
      <div className="form-row">
        <label>Quantity</label>
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          placeholder="e.g., 20"
          disabled={isAdding}
        />
      </div>

      {/* ✅ Buttons */}
      <div className="pd-modal-actions">
        <button
          className="btn mature-btn"
          disabled={isAdding}
          onClick={handleAdd}
        >
          {isAdding ? "Adding..." : (
            <>
              <FiPlusCircle size={18} /> Add Material
            </>
          )}
        </button>

        <button
          className="btn btn-outline"
          onClick={onClose}
          disabled={isAdding}
        >
          Close
        </button>
      </div>

    </ModalShell>
  );
};

export default ProjectMaterialsModal;
