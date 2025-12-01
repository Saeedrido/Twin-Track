import React, { useState, useEffect } from "react";
import ModalShell from "./ModalShell";
import { toast } from "react-toastify";

const MaterialsModal = ({ onClose, materials = [], onAssign, task }) => {
  const [normalizedMaterials, setNormalizedMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [search, setSearch] = useState(""); // ✅ NEW: Search
  const [isAssigning, setIsAssigning] = useState(false); // ✅ NEW: Loading state

  // ✅ Normalize incoming materials
  useEffect(() => {
    const normalized = materials.map((m) => ({
      id: m.id ?? m.materialId,
      name: m.name ?? m.materialName ?? "Unnamed Material",
      availableQuantity: m.availableQuantity ?? m.quantity ?? m.totalQuantity ?? 0,
    }));

    setNormalizedMaterials(normalized);
    setSelectedMaterials([]);
  }, [materials]);

  // ✅ Toggle material selection
  const toggleMaterialSelection = (materialId) => {
    setSelectedMaterials((prev) => {
      const exists = prev.find((m) => m.id === materialId);

      if (exists) {
        return prev.filter((m) => m.id !== materialId);
      }

      const material = normalizedMaterials.find((m) => m.id === materialId);
      return [...prev, { id: material.id, quantity: 1 }];
    });
  };

  // ✅ Update quantity
  const updateQuantity = (materialId, quantity) => {
    setSelectedMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? {
            ...m,
            quantity: Math.min(
              Math.max(quantity, 1),
              normalizedMaterials.find((x) => x.id === materialId)
                ?.availableQuantity ?? 1
            ),
          }
          : m
      )
    );
  };

  // ✅ Submit
  const handleAssign = async () => {
    if (selectedMaterials.length === 0) {
      toast.error("Select at least one material.");
      return;
    }

    const invalidQty = selectedMaterials.some(
      (m) =>
        m.quantity < 1 ||
        m.quantity >
        (normalizedMaterials.find((x) => x.id === m.id)?.availableQuantity ??
          0)
    );

    if (invalidQty) {
      toast.error("Enter valid quantities.");
      return;
    }

    const payload = selectedMaterials.map((m) => ({
      materialId: m.id,
      quantity: m.quantity,
    }));

    try {
      setIsAssigning(true); // ✅ show assigning text
      await onAssign(task.id, payload);
      onClose();
    } finally {
      setIsAssigning(false);
    }
  };

  // ✅ Apply search filter
  const filtered = normalizedMaterials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalShell title={`Assign Materials — ${task.name}`} onClose={isAssigning ? undefined : onClose}>

      {/* ✅ Search Bar */}
      <div className="form-row">
        <label>Search Materials</label>
        <input
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isAssigning}
        />
      </div>

      {/* ✅ Scrollable List */}
      <ul className="materials-select-list">
        {filtered.length === 0 ? (
          <li className="muted">No materials match your search.</li>
        ) : (
          filtered.map((m) => {
            const isSelected = selectedMaterials.some((sm) => sm.id === m.id);
            const selectedMaterial = selectedMaterials.find((sm) => sm.id === m.id);

            return (
              <li
                key={m.id}
                className={`material-row ${isSelected ? "selected" : ""}`}
                onClick={() => !isAssigning && toggleMaterialSelection(m.id)}
              >
                <div className="material-left">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isAssigning}
                    onClick={(e) => e.stopPropagation()} // ✅ prevents row toggle
                    onChange={() => toggleMaterialSelection(m.id)}
                  />
                  <div className="material-info">
                    <span className="name">{m.name}</span>
                    <span className="available">
                      Available: <strong>{m.availableQuantity}</strong>
                    </span>
                  </div>
                </div>

                {/* ✅ Quantity input (only when selected) */}
                {isSelected && (
                  <input
                    type="number"
                    min={1}
                    max={m.availableQuantity}
                    value={selectedMaterial.quantity}
                    disabled={isAssigning}
                    onClick={(e) => e.stopPropagation()} // ✅ prevents deselect
                    onChange={(e) => updateQuantity(m.id, Number(e.target.value))}
                  />
                )}
              </li>
            );
          })
        )}
      </ul>

      {/* ✅ Modal footer */}
      <div className="pd-modal-actions">
        <button
          className="btn"
          disabled={selectedMaterials.length === 0 || isAssigning}
          onClick={handleAssign}
        >
          {isAssigning ? "Assigning..." : "Assign to Task"}
        </button>

        <button className="btn btn-outline" onClick={onClose} disabled={isAssigning}>
          Cancel
        </button>
      </div>
    </ModalShell>
  );
};

export default MaterialsModal;
