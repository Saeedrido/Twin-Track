import React, { useEffect, useState } from "react";
import ModalShell from "./ModalShell";

const AssignWorkerToTaskModal = ({
  onClose,
  onAssign,
  task,
  projectWorkers,
  fetchProjectWorkers,
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false); // ✅ NEW

  useEffect(() => {
    fetchProjectWorkers();
  }, []);

  const filtered = (projectWorkers || []).filter((w) =>
    (w.fullName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selected) return;

    try {
      setIsAssigning(true);
      await onAssign(selected);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <ModalShell title={`Assign Worker — ${task?.name}`} onClose={isAssigning ? undefined : onClose}>
      <div className="form-row">
        <label>Search Workers</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          disabled={isAssigning}
        />
      </div>

      {/* ✅ Scrollable Worker List */}
      <ul className="pd-list assign-worker-list">
        {filtered.length === 0 ? (
          <li className="muted">No workers found</li>
        ) : (
          filtered.map((w) => {
            const isSelected = selected === w.workerId;

            return (
              <li
                key={w.workerId}
                className={isSelected ? "selected" : ""}
                onClick={() => !isAssigning && setSelected(w.workerId)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{w.fullName}</span>

                {/* ✅ Small badge for selection */}
                {isSelected && <span className="badge badge-selected">Selected</span>}
              </li>
            );
          })
        )}
      </ul>

      <div className="pd-modal-actions">
        <button
          className="btn"
          disabled={!selected || isAssigning}
          onClick={handleAssign}
        >
          {isAssigning ? "Assigning..." : "Assign Worker"}
        </button>

        <button className="btn btn-outline" onClick={onClose} disabled={isAssigning}>
          Close
        </button>
      </div>
    </ModalShell>
  );
};

export default AssignWorkerToTaskModal;
