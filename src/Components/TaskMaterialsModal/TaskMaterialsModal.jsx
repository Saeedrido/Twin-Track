import React, { useEffect, useState } from "react";
import { FiBox, FiX, FiAlertCircle, FiPackage } from "react-icons/fi";
import "./TaskMaterialsModal.css";

const TaskMaterialsModal = ({ task, onClose }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!task?.id) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/task/${task.id}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.isSuccess) {
          setMaterials(data.data.materials || data.data.Materials || []);
        } else {
          setError("Couldn't load task materials. Please try again.");
        }
      } catch (err) {
        console.error("Error loading task materials:", err);
        setError("Couldn't connect to server. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [task]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">
              <FiPackage />
            </div>
            <div>
              <h2 className="modal-title">Task Materials</h2>
              <p className="modal-subtitle">{task?.name}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading materials...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <FiAlertCircle className="error-icon" />
              <p>{error}</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="empty-state">
              <FiBox className="empty-icon" />
              <h3>No Materials Yet</h3>
              <p>This task doesn't have any materials assigned yet.</p>
            </div>
          ) : (
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Assigned</th>
                  <th>Used</th>
                  <th>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m, i) => {
                  const assigned = m.Quantity ?? m.quantity ?? 0;
                  const remaining = m.Remaining ?? m.remaining ?? 0;
                  const used = assigned - remaining;
                  return (
                    <tr key={i}>
                      <td className="material-name">{m.Name ?? m.name ?? "Unknown"}</td>
                      <td className="qty-cell">{assigned}</td>
                      <td className="qty-cell">{used}</td>
                      <td className="qty-cell">
                        <span className={`qty-badge ${remaining > 0 ? 'has-remaining' : 'empty'}`}>
                          {remaining}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TaskMaterialsModal;
