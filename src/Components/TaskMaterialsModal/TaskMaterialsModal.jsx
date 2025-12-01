// import React from "react";
// import "./TaskMaterialsModal.css";

// const TaskMaterialsModal = ({ task, onClose }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <h2 className="modal-title">Materials used for {task.name}</h2>

//         <table className="modal-table">
//           <thead>
//             <tr>
//               <th>Material</th>
//               <th>Quantity Used</th>
//             </tr>
//           </thead>

//           <tbody>
//             {task.materials && task.materials.length > 0 ? (
//               task.materials.map((m, i) => (
//                 <tr key={i}>
//                   <td>{m.name}</td>
//                   <td>{m.quantity}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="2" className="muted">
//                   No materials assigned to this task yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         <div className="modal-actions">
//           <button className="tt-small-btn close" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskMaterialsModal;
import React, { useEffect, useState } from "react";
import "./TaskMaterialsModal.css";

const TaskMaterialsModal = ({ task, onClose }) => {
  const [materials, setMaterials] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!task?.id) return;
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
          console.warn("Failed to load task materials:", data.message);
        }
      } catch (err) {
        console.error("Error loading task materials:", err);
      }
    };

    fetchTaskDetails();
  }, [task]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Materials used for {task?.name}</h2>

        <table className="modal-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity Assigned</th>
              <th>Quantity Used</th>
              <th>Quantity Remaining</th>
            </tr>
          </thead>
          <tbody>
            {materials.length > 0 ? (
              materials.map((m, i) => {
                const assigned = m.Quantity ?? m.quantity ?? 0;
                const remaining = m.Remaining ?? m.remaining ?? 0;
                const used = assigned - remaining;
                return (
                  <tr key={i}>
                    <td>{m.Name ?? m.name ?? "Unknown"}</td>
                    <td>{assigned}</td>
                    <td>{used}</td>
                    <td>{remaining}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="muted">
                  No materials assigned to this task yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="modal-actions">
          <button className="tt-small-btn close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskMaterialsModal;
