import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./ReturnMaterialsModal.css";

export default function ReturnMaterialsModal({ open, onClose, task, materials }) {
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [qty, setQty] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setQty("");
      setSelectedMaterialId(materials?.[0]?.id || "");
    }
  }, [open, materials]);

  if (!open) return null;

  const handleSubmit = async () => {
    const parsedQty = parseInt(qty, 10);

    if (!parsedQty || parsedQty <= 0) {
      toast.warn("Please enter a valid quantity to return.");
      return;
    }

    const material = materials.find((m) => String(m.id) === String(selectedMaterialId));

    if (!material) {
      toast.error("Please select a material to return.");
      return;
    }

    // ✅ FIX HERE — use real workerId
    const workerId = localStorage.getItem("userId");
    if (!workerId) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        materialId: material.id,
        supervisorId: material.supervisorId || null, // can be null
        quantity: parsedQty,
        workerId,
        projectId: task.projectId,
        taskId: task.id,
      };

      console.log("RETURN PAYLOAD:", payload);

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/worker/return`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      console.log("RETURN RESPONSE:", { ok: res.ok, status: res.status, data });

      if (!res.ok) {
        toast.error(data?.message || data?.Message || "Return failed");
        return;
      }

      toast.success(data?.Message || "Material returned successfully");
      onClose();
    } catch (err) {
      console.error("Return Error:", err);
      toast.error("Couldn't connect to server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wtm-overlay" onClick={onClose}>
      <div className="wtm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Return Materials</h3>

        <p className="muted">
          Task: <strong>{task?.name}</strong>
        </p>

        <label className="wtm-label">Choose Material to Return</label>
        <select
          className="wtm-input"
          value={selectedMaterialId}
          onChange={(e) => setSelectedMaterialId(e.target.value)}
          disabled={submitting}
        >
          {materials?.map((m) => (
            <option key={m.id} value={m.id}>
  {m.name} — {m.quantityAssigned} assigned
</option>
          ))}
        </select>

        <label className="wtm-label">Quantity to return</label>
        <input
          type="number"
          min="0"
          className="wtm-input"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          disabled={submitting}
        />

        <div className="wtm-actions">
          <button className="btn btn-outline" onClick={onClose} disabled={submitting}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Returning..." : "Return Material"}
          </button>
        </div>
      </div>
    </div>
  );
}
