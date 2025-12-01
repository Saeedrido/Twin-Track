import React, { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import { toast } from "react-toastify";

const AssignWorkerToProjectModal = ({
  onClose,
  onAssign,
  fetchAllWorkers,
  allWorkers,
}) => {
  const [search, setSearch] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false); // ✅ NEW

  useEffect(() => {
    if (!allWorkers || allWorkers.length === 0) fetchAllWorkers();
  }, []);

  const filtered = Array.isArray(allWorkers)
    ? allWorkers.filter((w) =>
        `${w.firstName ?? w.name ?? ""} ${w.lastName ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  const toggleWorker = (workerId) => {
    if (isAssigning) return;

    setSelectedWorkers((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    );
  };

  const selectAll = () => {
    if (isAssigning) return;

    const allIds = filtered.map((w) => w.id);
    setSelectedWorkers(allIds);
  };

  const clearAll = () => {
    if (isAssigning) return;

    setSelectedWorkers([]);
  };

  const submit = async () => {
    if (selectedWorkers.length === 0) {
      toast.warn("Please select at least one worker");
      return;
    }

    try {
      setIsAssigning(true);
      await onAssign(selectedWorkers);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <ModalShell title="Assign Worker(s) to Project" onClose={isAssigning ? undefined : onClose}>
      <div className="form-row">
        <label>Search Workers</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          disabled={isAssigning}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
        <button className="btn small" onClick={selectAll} disabled={isAssigning}>
          Select All
        </button>
        <button className="btn small btn-outline" onClick={clearAll} disabled={isAssigning}>
          Clear
        </button>
      </div>

      {/* ✅ Scrollable Worker List */}
      <ul className="pd-list assign-worker-list">
        {filtered.length === 0 ? (
          <li className="muted">No workers found</li>
        ) : (
          filtered.map((w) => {
            const isSelected = selectedWorkers.includes(w.id);
            const fullName = `${w.firstName ?? w.name ?? ""} ${w.lastName ?? ""}`.trim();

            return (
              <li
                key={w.id}
                className={isSelected ? "selected" : ""}
                style={{
                  cursor: isAssigning ? "not-allowed" : "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => toggleWorker(w.id)}
              >
                <span>{fullName}</span>

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleWorker(w.id);
                  }}
                  disabled={isAssigning}
                />
              </li>
            );
          })
        )}
      </ul>

      <div className="pd-modal-actions">
        <button
          className="btn"
          disabled={selectedWorkers.length === 0 || isAssigning}
          onClick={submit}
        >
          {isAssigning
            ? "Assigning..."
            : `Assign ${selectedWorkers.length} Worker(s)`}
        </button>

        <button className="btn btn-outline" onClick={onClose} disabled={isAssigning}>
          Cancel
        </button>
      </div>
    </ModalShell>
  );
};

export default AssignWorkerToProjectModal;
