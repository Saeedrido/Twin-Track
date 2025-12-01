import "../ProjectDashboard.css";
export default function TasksTab({ tasks, loadingTasks, openAssignWorker, openWorkersModal, setSelectedTaskMaterials }) {
  if (loadingTasks) return <div className="muted">Loading tasks...</div>;

  if (!tasks || tasks.length === 0) return <div className="muted">No tasks found.</div>;

  return (
    <div className="tt-tasks-table-wrap">
      <table className="tt-tasks-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Assigned</th>
            <th>Workers</th>
            <th>Materials</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="task-name-cell">
                <div className="task-name">{task.name}</div>
                <div className="task-sub muted">{task.description}</div>
              </td>

              <td>{task.assignedWorkers?.join(", ") || "—"}</td>

              <td className="clickable" onClick={() => openWorkersModal(task)}>
                {task.assignedWorkers.length === 0
                  ? "No workers"
                  : task.assignedWorkers.length <= 3
                  ? task.assignedWorkers.join(", ")
                  : `${task.assignedWorkers[0]}, ${task.assignedWorkers[1]} and ${task.assignedWorkers.length - 2} others`}
              </td>

              <td className="clickable" onClick={() => setSelectedTaskMaterials(task)}>
                {task.materials.length === 0
                  ? "No materials"
                  : task.materials.length <= 2
                  ? task.materials.map((m) => m.name).join(", ")
                  : `${task.materials[0].name}, ${task.materials[1].name} and ${task.materials.length - 2} more`}
              </td>

              <td>{task.due}</td>

              <td>
                <span
                  className={`status-pill ${task.status === "Completed" ? "completed" : task.status === "InProgress" ? "inprogress" : "pending"
                    }`}
                >
                  {task.status}
                </span>
              </td>

              <td>
                <button className="tt-small-btn" onClick={() => openAssignWorker(task)}>
                  Assign Worker
                </button>
                <button className="tt-small-btn outline" onClick={() => setSelectedTaskMaterials(task)}>
                  Assign Materials
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
