import React, { useEffect, useState } from "react";
import {
  FiTrash2,
  FiSlash,
  FiCheck,
  FiUser,
  FiSearch,
  FiBell,
  FiFilter,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar";
import EmptyState from "../UI/EmptyState/EmptyState";
import ErrorState from "../UI/ErrorState/ErrorState";
import LoadingState from "../UI/LoadingState/LoadingState";
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

      if (!res.ok || !payload?.isSuccess) {
        toast.error(payload?.message || "Couldn't load workers. Please try again.");
        setFetchError(true);
        return;
      }

      if (!Array.isArray(payload.data)) {
        console.warn("payload.data is not an array", payload.data);
        setWorkers([]);
        return;
      }

      setWorkers(payload.data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load workers. Please check your connection.");
      setFetchError(true);
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          toast.error(failed.json?.message || "Couldn't remove worker from selected projects.");
        } else {
          toast.success("Worker removed from selected projects.");
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

        const res = await fetch(`${API_BASE_URL}/api/v1/worker/tasks/remove`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || (json && !json.isSuccess)) {
          toast.error(json?.message || "Couldn't remove worker from tasks.");
          return;
        }

        toast.success("Worker removed from selected tasks.");
        setSelected({});
        setShowConfirm(false);
        fetchWorkers();
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSuspend = async (worker) => {
    try {
      setSuspendingWorkerId(worker.workerId);
      const endpoint = worker.suspended ? "retain" : "suspend";

      const res = await fetch(`${API_BASE_URL}/api/v1/worker/${worker.workerId}/${endpoint}`, {
        method: "PUT",
        headers: authHeaders(),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.message || "Action failed. Please try again.");
        return;
      }

      toast.success(payload?.message ?? "Worker status updated.");
      fetchWorkers();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSuspendingWorkerId(null);
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

          {/* Loading State */}
          {loadingWorkers && (
            <LoadingState variant="skeleton" message="Loading your workers..." />
          )}

          {/* Error State */}
          {!loadingWorkers && fetchError && (
            <ErrorState
              title="Couldn't Load Workers"
              message="We had trouble loading your workers. Please check your connection and try again."
              onRetry={fetchWorkers}
              size="small"
            />
          )}

          {/* Empty State */}
          {!loadingWorkers && !fetchError && workers.length === 0 && (
            <EmptyState
              icon={<FiUsers />}
              title="No Workers Yet"
              message="You haven't assigned any workers yet. Add workers to your projects to get started."
              size="small"
            />
          )}

          {/* No Filter Results */}
          {!loadingWorkers && !fetchError && workers.length > 0 && filteredWorkers.length === 0 && (
            <EmptyState
              icon={<FiSearch />}
              title="No Matching Workers"
              message="Try adjusting your search or filters to find what you're looking for."
              size="small"
            />
          )}

          {/* Workers Table */}
          {!loadingWorkers && !fetchError && filteredWorkers.length > 0 && (
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
                {filteredWorkers.map((worker) => (
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
                        {isDeleting && currentWorker?.workerId === worker.workerId ? "Removing..." : <><FiTrash2 /> Remove</>}
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
                ))}
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
                  {isDeleting ? "Removing..." : "Yes, Remove"}
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
