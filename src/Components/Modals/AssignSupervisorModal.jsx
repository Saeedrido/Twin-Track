import React, { useEffect, useState } from "react";
import ModalShell from "./ModalShell";

const AssignSupervisorModal = ({
  onClose,
  onAssign,
  supervisors,
  fetchSupervisors,
  projectAssignments, // ✅ contains existing supervisors
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [level, setLevel] = useState(2); // ✅ Default: Standard
  const [isAssigning, setIsAssigning] = useState(false); // ✅ NEW

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const existing = projectAssignments?.supervisors ?? [];

  const lead = existing.find((s) => s.role === "Lead");
  const assistant = existing.find((s) => s.role === "Assistant");

  /* ✅ Build a list of all already-assigned supervisor IDs */
  const assignedIds = existing.map((x) => x.supervisorId);

  const filtered = (supervisors || []).filter((s) =>
    (s.fullName ?? `${s.firstName} ${s.lastName}`)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selected) return;

    try {
      setIsAssigning(true);
      await onAssign(selected, level);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <ModalShell title="Assign Supervisor" onClose={isAssigning ? undefined : onClose}>
      <div className="form-row">
        <label>Search Supervisors</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          disabled={isAssigning}
        />
      </div>

      {/* ✅ Scrollable Supervisor List */}
      <ul
        className="pd-list"
        style={{
          maxHeight: "180px",      // ✅ enough to show 2+ items
          overflowY: "auto",       // ✅ scrolls if more than 2
          paddingRight: "5px",
        }}
      >
        {filtered.length === 0 ? (
          <li className="muted">No supervisors found</li>
        ) : (
          filtered.map((s) => {
            const id = s.supervisorId ?? s.id;
            const fullName = s.fullName ?? `${s.firstName} ${s.lastName}`.trim();

            const isLead = lead && lead.supervisorId === id;
            const isAssistant = assistant && assistant.supervisorId === id;
            const alreadyAssigned = assignedIds.includes(id);

            const isSelected = selected === id;

            return (
              <li
                key={id}
                className={
                  alreadyAssigned ? "disabled-row" : isSelected ? "selected" : ""
                }
                style={{
                  cursor: alreadyAssigned ? "not-allowed" : "pointer",
                  opacity: alreadyAssigned ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={() =>
                  !alreadyAssigned &&
                  !isAssigning &&
                  setSelected(id)
                }
              >
                {/* ✅ Radio stays checked & disabled for already assigned supervisors */}
                <input
                  type="radio"
                  disabled={alreadyAssigned || isAssigning}
                  checked={alreadyAssigned ? true : isSelected}
                  onChange={() => setSelected(id)}
                />

                <span>{fullName}</span>

                {isLead && <span className="badge badge-lead">Lead</span>}
                {isAssistant && !isLead && (
                  <span className="badge badge-assistant">Assistant</span>
                )}
              </li>
            );
          })
        )}
      </ul>

      {/* ✅ Level select */}
      <div className="form-row">
        <label>Supervisor Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          disabled={isAssigning}
        >
          <option value={1} disabled={!!assistant}>
            Assistant {assistant ? "(Already assigned)" : ""}
          </option>

          <option value={2}>Standard</option>
        </select>
      </div>

      <div className="pd-modal-actions">
        <button
          className="btn"
          disabled={!selected || isAssigning}
          onClick={handleAssign}
        >
          {isAssigning ? "Assigning..." : "Assign Supervisor"}
        </button>

        <button
          className="btn btn-outline"
          onClick={onClose}
          disabled={isAssigning}
        >
          Cancel
        </button>
      </div>
    </ModalShell>
  );
};

export default AssignSupervisorModal;
