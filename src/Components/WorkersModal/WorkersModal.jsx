import React, { useState } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../ConfirmDialog/ConfirmDialog";
import "./WorkersModal.css";

const WorkersModal = ({ task, onClose, onRemoveWorker }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  if (!task) return null;

  const handleDeleteClick = (worker) => {
    setSelectedWorker(worker);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onRemoveWorker && selectedWorker) {
      onRemoveWorker(selectedWorker);
    }
    setConfirmOpen(false);
    setSelectedWorker(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedWorker(null);
  };

  return (
    <>
      <div className="workers-modal-overlay">
        <div className="workers-modal">
          <div className="workers-modal-header">
            <h3>Workers on {task.name}</h3>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <div className="workers-modal-body">
            {task.workers && task.workers.length > 0 ? (
              task.workers.map((worker, i) => (
                <div key={i} className="worker-item">
                  <span>{worker}</span>
                  <button
                    className="remove-worker-btn"
                    onClick={() => handleDeleteClick(worker)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ) : (
              <p className="no-workers">No workers assigned to this task.</p>
            )}
          </div>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Remove Worker"
          message={`Are you sure you want to remove ${selectedWorker} from this task?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default WorkersModal;
