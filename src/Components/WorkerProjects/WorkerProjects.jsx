import React, { useState, useEffect } from "react";
import WorkerLayout from "../WorkerLayout/WorkerLayout";
import { FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyState from "../UI/EmptyState/EmptyState";
import LoadingState from "../UI/LoadingState/LoadingState";
import "./WorkerProjects.css";

export default function WorkerProjects() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("authToken");
  const currentWorkerId = localStorage.getItem("userId");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!token) return;
    fetchWorkerProjects();
  }, [token]);

  const fetchWorkerProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/my-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data?.isSuccess || !Array.isArray(data.data)) {
        setError(true);
        toast.error("Couldn't load projects.");
        return;
      }

      setProjects(data.data);
      setError(false);

      // Fetch tasks for all projects
      fetchAllTasks(data.data);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Couldn't load projects.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async (projectList) => {
    try {
      let allTasks = [];
      for (const proj of projectList) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/projects/${proj.id}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data?.isSuccess && Array.isArray(data.data)) {
            allTasks = allTasks.concat(
              data.data.map((t) => ({ ...t, projectId: proj.id }))
            );
          }
        } catch { }
      }
      setTasks(allTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = proj.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || proj.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getProjectTasks = (projectId) => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getCompletedTasks = (projectId) => {
    return tasks.filter(
      (t) => t.projectId === projectId && t.status.toLowerCase() === "completed"
    ).length;
  };

  if (loading) {
    return (
      <WorkerLayout>
        <div className="worker-projects-container">
          <LoadingState variant="skeleton" message="Loading your projects..." size="medium" />
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="worker-projects-container">
        <header className="projects-header">
          <h2>My Projects</h2>
          <p className="muted">Projects assigned to you</p>
        </header>

        {/* Search & Filter */}
        <div className="projects-controls">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="NotStarted">Not Started</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="OnHold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={<FiBriefcase />}
            title="No Projects Found"
            message="You don't have any projects matching your search."
            size="medium"
          />
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const projectTasks = getProjectTasks(project.id);
              const completedTasks = getCompletedTasks(project.id);

              return (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <div className="project-meta">
                    <span className="meta-item">
                      <strong>{projectTasks.length}</strong> Tasks
                    </span>
                    <span className="meta-item">
                      <strong>{completedTasks}</strong> Completed
                    </span>
                  </div>
                  <p className="project-status">Status: {project.status}</p>
                  <p className="project-description">{project.description || "No description"}</p>
                  <div className="project-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/worker/${currentWorkerId}/project/${project.id}/tasks`)
                      }
                    >
                      View Tasks
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}
