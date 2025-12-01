import React, { useEffect, useState } from "react";
import {
  FiTrash2,
  FiSlash,
  FiCheck,
  FiUser,
  FiSearch,
  FiBell,
  FiFilter,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar";
import "./WorkersList.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const WorkersList = () => {
  const token = localStorage.getItem("authToken");

  const [workers, setWorkers] = useState([]);
  const [selected, setSelected] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [suspendingWorkerId, setSuspendingWorkerId] = useState(null);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    setFetchError(false);

    try {
      const supervisorId = localStorage.getItem("userId");

      const res = await fetch(
        `${API_BASE_URL}/api/v1/worker/supervisor/${supervisorId}/assigned`,
        { headers: authHeaders() }
      );
   
      const payload = await res.json();
      console.log("🔥 RAW WORKERS RESPONSE:", payload);

      if (!res.ok || !payload?.isSuccess) {
        toast.error(payload?.message || "Failed to load workers.");
        setFetchError(true);
        return;
      }

      // payload.data is already the array of workers
      if (!Array.isArray(payload.data)) {
        console.warn("❌ payload.data is not an array", payload.data);
        setWorkers([]);
        return;
      }

      setWorkers(payload.data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load workers.");
      setFetchError(true);
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const makeKey = (workerId, projectId, taskId = null) =>
    taskId ? `${workerId}::${projectId}::${taskId}` : `${workerId}::${projectId}`;

  const toggleSelect = (workerId, projectId, taskId = null) => {
    const key = makeKey(workerId, projectId, taskId);
    setSelected((prev) => {
      const updated = { ...prev };
      updated[key] ? delete updated[key] : (updated[key] = true);
      return updated;
    });
  };

  const handleRemoveClick = (worker) => {
    const exists = Object.keys(selected).some((key) =>
      key.startsWith(worker.workerId)
    );

    if (!exists) {
      toast.warn("Select at least one project or task.");
      return;
    }

    setCurrentWorker(worker);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (!currentWorker) return;

    const workerId = currentWorker.workerId;
    const selectedKeys = Object.keys(selected).filter((k) =>
      k.startsWith(workerId)
    );

    const projectSelections = selectedKeys.filter((k) => k.split("::").length === 2);
    const taskSelections = selectedKeys.filter((k) => k.split("::").length === 3);

    if (projectSelections.length > 0 && taskSelections.length > 0) {
      toast.error("Select ONLY projects OR ONLY tasks (not both).");
      return;
    }

    try {
      setIsDeleting(true);

      if (projectSelections.length > 0) {
        const deletePromises = projectSelections.map(async (key) => {
          const [, pId] = key.split("::");
          const res = await fetch(`${API_BASE_URL}/api/v1/worker/${workerId}/project/${pId}`, {
            method: "DELETE",
            headers: authHeaders(),
          });
          if (res.status === 204 || res.status === 200) return { ok: true };
          let json = null;
          try { json = await res.json(); } catch { }
          return { ok: res.ok, json };
        });

        const results = await Promise.all(deletePromises);
        const failed = results.find((r) => !r.ok);

        if (failed) {
          toast.error(failed.json?.message || "Failed to remove worker from selected project(s).");
        } else {
          toast.success("Worker removed from selected project(s).");
          setSelected({});
          setShowConfirm(false);
          fetchWorkers();
        }
        return;
      }

      if (taskSelections.length > 0) {
        const projectId = taskSelections[0].split("::")[1];
        const taskIds = taskSelections.map((k) => k.split("::")[2]);

        const payload = { workerId, projectId, taskIds };
        console.log("✅ TASK REMOVE PAYLOAD:", payload);

        const res = await fetch(`${API_BASE_URL}/api/v1/worker/tasks/remove`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || (json && !json.isSuccess)) {
          toast.error(json?.message || "Failed to remove worker from tasks.");
          return;
        }

        toast.success("Worker removed from selected task(s).");
        setSelected({});
        setShowConfirm(false);
        fetchWorkers();
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while removing.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSuspend = async (worker) => {
    try {
      setSuspendingWorkerId(worker.workerId); // mark this worker as loading
      const endpoint = worker.suspended ? "retain" : "suspend";

      const res = await fetch(`${API_BASE_URL}/api/v1/worker/${worker.workerId}/${endpoint}`, {
        method: "PUT",
        headers: authHeaders(),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.message || "Failed action.");
        return;
      }

      toast.success(payload?.message ?? "Status updated.");
      fetchWorkers();
    } catch {
      toast.error("Error updating worker.");
    } finally {
      setSuspendingWorkerId(null); // reset after action
    }
  };

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch = w.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" && !w.suspended) ||
      (filterStatus === "Suspended" && w.suspended);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="workers-page">
      <Sidebar />
      <main className="workers-main">
        <header className="topbar">
          <div className="search-filter-row">
            <div className="search-bar">
              <FiSearch />
              <input
                type="text"
                placeholder="Search workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loadingWorkers}
              />
            </div>
            <div className="filter-box">
              <FiFilter />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={loadingWorkers}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="topbar-icons">
            <FiBell />
            <FiUser />
          </div>
        </header>

        <section className="content-area">
          <h2 className="page-title">Workers List</h2>

          {loadingWorkers && <p className="muted">Loading workers…</p>}
          {fetchError && !loadingWorkers && <p className="error-text">Failed to load workers.</p>}

          {!loadingWorkers && !fetchError && (
            <table className="workers-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Projects & Tasks</th>
                  <th>Supervisor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker) => (
                    <tr key={worker.workerId}>
                      <td>
                        <div className="worker-info"><FiUser /> {worker.fullName}</div>
                      </td>
                      <td>
                        {worker.projects.map((project) => {
                          const projectKey = makeKey(worker.workerId, project.projectId);
                          return (
                            <div className="project-block" key={project.projectId}>
                              <strong>
                                <input
                                  type="checkbox"
                                  checked={!!selected[projectKey]}
                                  onChange={() => toggleSelect(worker.workerId, project.projectId)}
                                />{" "}
                                {project.projectName}
                              </strong>
                              <ul>
                                {project.tasks.map((task) => {
                                  const tKey = makeKey(worker.workerId, project.projectId, task.taskId);
                                  return (
                                    <li key={task.taskId}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={!!selected[tKey]}
                                          onChange={() => toggleSelect(worker.workerId, project.projectId, task.taskId)}
                                        />{" "}
                                        {task.taskName}
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}
                      </td>
                      <td>
                        {worker.projects.map((p) => (
                          <div key={p.projectId}>{p.supervisorName || "No supervisor"}</div>
                        ))}
                      </td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveClick(worker)}
                          disabled={isDeleting}
                        >
                          {isDeleting && currentWorker?.workerId === worker.workerId ? "Deleting..." : <><FiTrash2 /> Remove</>}
                        </button>

                        <button
                          className={`suspend-btn ${worker.suspended ? "retain" : "suspend"}`}
                          onClick={() => toggleSuspend(worker)}
                          disabled={suspendingWorkerId === worker.workerId}
                        >
                          {suspendingWorkerId === worker.workerId
                            ? worker.suspended
                              ? "Retaining..."
                              : "Suspending..."
                            : worker.suspended
                              ? <><FiCheck /> Retain</>
                              : <><FiSlash /> Suspend</>
                          }
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="no-results">No workers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>

        {showConfirm && currentWorker && (
          <div className="confirm-modal">
            <div className="confirm-box">
              <h3>Confirm Removal</h3>
              <p>
                Are you sure you want to remove the selected assignment(s) for <strong>{currentWorker.fullName}</strong>?
              </p>
              <div className="confirm-actions">
                <button className="cancel" onClick={() => setShowConfirm(false)} disabled={isDeleting}>
                  Cancel
                </button>
                <button className="confirm" onClick={confirmRemove} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Yes, Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkersList;
