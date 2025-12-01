import "../ProjectDashboard/ProjectDashboard.css";

const ModalShell = ({ children, title, onClose }) => (
  <div className="pd-modal-backdrop">
    <div className="pd-modal" role="dialog" aria-modal="true">
      <div className="pd-modal-header">
        <h3>{title}</h3>
        <button className="pd-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className="pd-modal-body">{children}</div>
    </div>
  </div>
);

export default ModalShell;
