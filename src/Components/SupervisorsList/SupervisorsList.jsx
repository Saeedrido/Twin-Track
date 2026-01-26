import React, { useEffect, useState } from "react";
import {
  FiTrash2,
  FiSlash,
  FiCheck,
  FiUser,
  FiSearch,
  FiBell,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import EmptyState from "../UI/EmptyState/EmptyState";
import ErrorState from "../UI/ErrorState/ErrorState";
import LoadingState from "../UI/LoadingState/LoadingState";
import "./SupervisorsList.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SupervisorsList = () => {
  const token = localStorage.getItem("authToken");
  const loggedInUserId = localStorage.getItem("userId");

  const [supervisors, setSupervisors] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentSupervisor, setCurrentSupervisor] = useState(null);
  const [allowedProjects, setAllowedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchSupervisors = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/supervisors/assigned?userId=${loggedInUserId}`,
        {
          headers: authHeaders(),
        }
      );
      const payload = await res.json();
      if (!res.ok || !payload.isSuccess) {
        toast.error(payload.message || "Couldn't load supervisors. Please try again.");
        setFetchError(true);
        return;
      }
      setSupervisors(payload.data || []);
    } catch (err) {
      toast.error("Couldn't load supervisors. Please check your connection.");
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleProjectSelect = (supervisorId, projectId) => {
    const key = `${supervisorId}::${projectId}`;
    setSelectedProjects((prev) => {
      const updated = { ...prev };
      if (updated[key]) delete updated[key];
      else updated[key] = true;
      return updated;
    });
  };

  const handleRemoveClick = (supervisor) => {
    const projectsCanRemove = supervisor.projects.filter(
      (p) =>
        !p.isLead &&
        (String(p.createdBy) === loggedInUserId || String(supervisor.supervisorId) === loggedInUserId)
    );

    if (!projectsCanRemove.length) {
      toast.warn("You don't have permission to remove this supervisor from any projects.");
      return;
    }

    setCurrentSupervisor(supervisor);
    setAllowedProjects(projectsCanRemove);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (!currentSupervisor || !allowedProjects.length) {
      setShowConfirm(false);
      return;
    }

    const payload = { Assignments: [] };
    for (const project of allowedProjects) {
      payload.Assignments.push({
        SupervisorId: currentSupervisor.supervisorId,
        ProjectId: project.projectId,
      });
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/supervisors/projects/remove`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.isSuccess) {
        toast.error(json.message || "Couldn't remove supervisor. Please try again.");
        return;
      }

      toast.success("Supervisor removed from project(s).");
      setSelectedProjects({});
      setShowConfirm(false);
      fetchSupervisors();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleSuspend = async (supervisor) => {
    const affectedProjects = supervisor.projects.filter(
      (p) => !p.isLead && String(p.createdBy) === loggedInUserId
    );

    if (!affectedProjects.length) {
      toast.warn(
        `You don't have permission to ${supervisor.suspended ? "retain" : "suspend"} this supervisor.`
      );
      return;
    }

    const endpoint = supervisor.suspended ? "retain" : "suspend";

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/supervisors/${supervisor.supervisorId}/${endpoint}`,
        { method: "PUT", headers: authHeaders() }
      );
      const json = await res.json();
      if (!res.ok || !json.isSuccess) {
        toast.error(json.message || "Action failed. Please try again.");
        return;
      }

      toast.success(json.message || "Supervisor status updated.");
      fetchSupervisors();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const filteredSupervisors = supervisors.filter((s) => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" && !s.suspended) ||
      (filterStatus === "Suspended" && s.suspended);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="supervisors-page">
      <Sidebar />

      <main className="supervisors-main">
        <header className="topbar">
          <div className="search-bar">
            <FiSearch />
            <input
              type="text"
              placeholder="Search supervisors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="topbar-icons">
            <FiBell />
            <FiUser />
          </div>
        </header>

        <section className="content-area">
          <h2 className="page-title">Supervisors List</h2>

          {/* Loading State */}
          {loading && (
            <LoadingState variant="skeleton" message="Loading your supervisors..." />
          )}

          {/* Error State */}
          {!loading && fetchError && (
            <ErrorState
              title="Couldn't Load Supervisors"
              message="We had trouble loading your supervisors. Please check your connection and try again."
              onRetry={fetchSupervisors}
              size="small"
            />
          )}

          {/* Empty State */}
          {!loading && !fetchError && supervisors.length === 0 && (
            <EmptyState
              icon={<FiUsers />}
              title="No Supervisors Yet"
              message="You haven't assigned any supervisors yet. Add supervisors to help manage your projects."
              size="small"
            />
          )}

          {/* No Filter Results */}
          {!loading && !fetchError && supervisors.length > 0 && filteredSupervisors.length === 0 && (
            <EmptyState
              icon={<FiSearch />}
              title="No Matching Supervisors"
              message="Try adjusting your search to find what you're looking for."
              size="small"
            />
          )}

          {/* Supervisors Table */}
          {!loading && !fetchError && filteredSupervisors.length > 0 && (
            <div className="table-container">
              <table className="supervisors-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Projects & Tasks</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSupervisors.map((sup) => (
                    <tr key={sup.supervisorId}>
                      <td className={sup.suspended ? "suspended" : ""}>
                        <FiUser /> {sup.fullName}
                      </td>
                      <td>
                        {(sup.projects || []).map((project) => {
                          const key = `${sup.supervisorId}::${project.projectId}`;
                          const canRemove =
                            !project.isLead &&
                            (String(project.createdBy) === loggedInUserId ||
                              String(sup.supervisorId) === loggedInUserId);
                          return (
                            <div key={project.projectId} className="project-block">
                              <strong>
                                <input
                                  type="checkbox"
                                  checked={!!selectedProjects[key]}
                                  onChange={() =>
                                    toggleProjectSelect(sup.supervisorId, project.projectId)
                                  }
                                  disabled={!canRemove}
                                />{" "}
                                {project.projectName} {project.isLead && "(Lead)"}
                              </strong>
                              <ul>
                                {(project.tasks || []).map((task) => (
                                  <li key={task.id}>{task.name}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </td>
                      <td className="actions">
                        <button className="remove-btn" onClick={() => handleRemoveClick(sup)}>
                          <FiTrash2 /> Remove
                        </button>
                        <button
                          className={`suspend-btn ${sup.suspended ? "retain" : "suspend"}`}
                          onClick={() => toggleSuspend(sup)}
                        >
                          {sup.suspended ? <><FiCheck /> Retain</> : <><FiSlash /> Suspend</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showConfirm && currentSupervisor && allowedProjects.length > 0 && (
          <ConfirmDialog
            title="Confirm Removal"
            message={`Are you sure you want to remove the selected project assignments for ${currentSupervisor.fullName}?`}
            onConfirm={confirmRemove}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </main>
    </div>
  );
};

export default SupervisorsList;
