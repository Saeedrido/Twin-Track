import "../ProjectDashboard.css";
import { FiPlusCircle } from "react-icons/fi";

export default function MaterialsTab({ projectMaterials, loadingProject, openIncreaseModal, confirmIncrease }) {
  if (loadingProject && (!projectMaterials || projectMaterials.length === 0))
    return <div className="muted">Loading materials...</div>;

  if (!projectMaterials || projectMaterials.length === 0) return <div className="muted">No materials yet.</div>;

  return (
    <div className="materials-grid">
      {projectMaterials.map((m) => (
        <div className="material-card" key={m.id}>
          <div className="material-card-top">
            <div className="material-name">{m.name}</div>
            <div className="material-unit">{m.unit || ""}</div>
          </div>

          <div className="material-qty">
            <div className="qty-label">Quantity</div>
            <div className="qty-value">{m.quantity ?? 0}</div>
          </div>

          <div className="material-available">
            <div className="small muted">Available</div>
            <div className="avail-value">{m.availableQuantity ?? m.quantity ?? 0}</div>
          </div>

          <div className="material-actions">
            <button className="tt-small-btn" onClick={() => openIncreaseModal(m)} title="Increase quantity">
              <FiPlusCircle /> Increase
            </button>

            <button
              className="tt-small-btn outline"
              onClick={() => confirmIncrease(m.name, 1)}
              title="Quick +1"
            >
              +1
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
