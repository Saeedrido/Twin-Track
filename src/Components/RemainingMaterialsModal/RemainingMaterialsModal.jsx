// src/components/RemainingMaterialsModal/RemainingMaterialsModal.jsx
import React from "react";
import "./RemainingMaterialsModal.css"; // We'll style the modal here

export default function RemainingMaterialsModal({ open, onClose, task, materials }) {
    if (!open) return null;

    return (
        <div className="rm-modal-overlay">
            <div className="rm-modal-container">
                <div className="rm-modal-header">
                    <h2>Remaining Materials for {task?.name}</h2>
                    <button className="rm-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="rm-modal-body">
                    {materials && materials.length > 0 ? (
                        <table className="rm-modal-table">
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Quantity Assigned</th>
                                    <th>Quantity Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((m, idx) => (
                                    <tr key={idx}>
                                        <td>{m.name}</td>
                                        <td>{m.quantityAssigned}</td>
                                        <td>{m.remaining}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="rm-muted">No remaining materials for this task.</p>
                    )}
                </div>

                <div className="rm-modal-footer">
                    <button className="rm-small-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
