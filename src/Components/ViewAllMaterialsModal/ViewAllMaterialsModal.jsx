import React from "react";
import "./ViewAllMaterialsModal.css";

const ViewAllMaterialsModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="tt-modal-overlay" onMouseDown={onClose}>
      <div
        className="tt-modal-card medium"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="tt-close" onClick={onClose}>
          ×
        </button>

        <div className="tt-modal-head">
          <h3>All Materials for {project.name}</h3>
          <p className="muted">
            Below are all the materials currently assigned to this project.
          </p>
        </div>

        <div className="materials-list-full">
          {project.materials.length > 0 ? (
            <ul>
              {project.materials.map((mat, idx) => (
                <li key={idx}>
                  <strong>{mat.name}</strong> — {mat.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No materials assigned yet.</p>
          )}
        </div>

        <div className="tt-actions">
          <button className="tt-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllMaterialsModal;
