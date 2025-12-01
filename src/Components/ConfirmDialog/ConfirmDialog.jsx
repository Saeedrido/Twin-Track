import React from "react";
import "./ConfirmDialog.css";

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="tt-modal-overlay" onMouseDown={onCancel}>
      <div
        className="tt-modal-card confirm"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3>{title || "Confirm Action"}</h3>
        <p>{message}</p>

        <div className="tt-actions">
          <button className="tt-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="tt-delete" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
