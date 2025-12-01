// WorkerDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import WorkerLayout from "../WorkerLayout/WorkerLayout";
import { FiUsers, FiBriefcase, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./WorkerDashboard.css";
import ProjectSubmissionModal from "../ProjectSubmissionModal/ProjectSubmissionModal";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("authToken");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingSupervisors, setLoadingSupervisors] = useState(true);
  const [openProjectSubmissionModal, setOpenProjectSubmissionModal] = useState(false);
  const [currentProjectToSubmit, setCurrentProjectToSubmit] = useState(null);

  const [errorProjects, setErrorProjects] = useState(false);
  const [errorTasks, setErrorTasks] = useState(false);
  const [errorSupervisors, setErrorSupervisors] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submittingProject, setSubmittingProject] = useState(false);
  const currentWorkerId = localStorage.getItem("userId");
  const loadAll = () => {
    fetchWorkerProjects();      // reload projects
    // Optionally, reload tasks and supervisors as well if needed
    // fetchWorkerTasks(projects);
    // fetchWorkerSupervisors(projects);
  };

  // Fetch worker projects
  useEffect(() => {
    if (!token) return;
    fetchWorkerProjects();
  }, [token]);

  const fetchWorkerProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/my-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data?.isSuccess || !Array.isArray(data.data)) {
        setErrorProjects(true);
        toast.error("Failed to load projects.");
        return;
      }

      setProjects(data.data);
      setErrorProjects(false);

      // Fetch tasks and supervisors after projects
      fetchWorkerTasks(data.data);
      fetchWorkerSupervisors(data.data);
    } catch (err) {
      console.error(err);
      setErrorProjects(true);
      toast.error("Failed to load projects.");
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchWorkerTasks = async (projectList) => {
    setLoadingTasks(true);
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
      setErrorTasks(false);
    } catch (err) {
      console.error(err);
      setErrorTasks(true);
      toast.error("Failed to load tasks.");
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchWorkerSupervisors = async (projectList) => {
    setLoadingSupervisors(true);
    try {
      const supSet = new Set();
      for (const proj of projectList) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/projects/${proj.id}/assignments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data?.isSuccess && Array.isArray(data.data.supervisors)) {
            data.data.supervisors.forEach((s) => {
              supSet.add(String(s.supervisorId ?? s.id));
            });
          }
        } catch { }
      }
      setSupervisors(Array.from(supSet));
      setErrorSupervisors(false);
    } catch (err) {
      console.error(err);
      setErrorSupervisors(true);
      toast.error("Failed to load supervisors.");
    } finally {
      setLoadingSupervisors(false);
    }
  };

  const handleOpenProjectSubmission = (project) => {
    setCurrentProjectToSubmit(project);
    setOpenProjectSubmissionModal(true);
  };

  const handleSubmitProject = async (projectId, dto) => {
    setSubmittingProject(true);
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_BASE_URL}/api/v1/worker/projects/${projectId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto), // <-- send DTO directly, not { dto }
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.isSuccess) {
        toast.error(data?.message || "Failed to submit project");
        return;
      }

      toast.success("Project submitted successfully!");
      setOpenProjectSubmissionModal(false);
      loadAll(); // reload projects/tasks
    } catch (err) {
      console.error("Network error submitting project", err);
      toast.error("Network error submitting project");
    } finally {
      setSubmittingProject(false);
    }
  };

  const incompleteTasks = tasks.filter((t) => t.status.toLowerCase() !== "completed").length;

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesSearch = proj.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || proj.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchTerm, filterStatus]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const CardLoader = ({ label }) => (
    <div className="dash-card loading-card">
      <div className="loading-bar" />
      <p className="muted" style={{ marginTop: 10 }}>{label}</p>
    </div>
  );

  return (
    <WorkerLayout>
      <div className="worker-dashboard-container">

        {/* ===== SUMMARY CARDS ===== */}
        <div className="summary-cards">
          {loadingProjects ? (
            <CardLoader label="Loading Projects..." />
          ) : errorProjects ? (
            <CardLoader label="Failed to load projects." />
          ) : (
            <div className="dash-card">
              <FiBriefcase className="card-icon" />
              <div>
                <h2>{projects.length}</h2>
                <p>Total Projects</p>
              </div>
            </div>
          )}

          {loadingTasks ? (
            <CardLoader label="Loading Tasks..." />
          ) : errorTasks ? (
            <CardLoader label="Failed to load tasks." />
          ) : (
            <div className="dash-card">
              <FiCheckCircle className="card-icon" />
              <div>
                <h2>{tasks.length}</h2>
                <p>Total Tasks</p>
              </div>
            </div>
          )}

          <div className="dash-card">
            <FiCheckCircle className="card-icon" />
            <div>
              <h2>{tasks.length - incompleteTasks}</h2>
              <p>Completed</p>
            </div>
          </div>

          <div className="dash-card">
            <FiCheckCircle className="card-icon" />
            <div>
              <h2>{incompleteTasks}</h2>
              <p>Pending</p>
            </div>
          </div>

          {loadingSupervisors ? (
            <CardLoader label="Loading Supervisors..." />
          ) : errorSupervisors ? (
            <CardLoader label="Failed to load supervisors." />
          ) : (
            <div className="dash-card">
              <FiUsers className="card-icon" />
              <div>
                <h2>{supervisors.length}</h2>
                <p>Supervisors</p>
              </div>
            </div>
          )}
        </div>

        {/* ===== SEARCH & FILTER ===== */}
        <div className="projects-controls">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="NotStarted">Not Started</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="OnHold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* ===== SCROLLABLE PROJECT LIST ===== */}
        <div className="project-cards-scroll">
          {filteredProjects.length === 0 ? (
            <p>No projects found.</p>
          ) : filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>Total Tasks: {tasks.filter((t) => t.projectId === project.id).length}</p>
              <p>Completed: {tasks.filter((t) => t.projectId === project.id && t.status.toLowerCase() === "completed").length}</p>
              <p>Status: {project.status}</p>
              {/* <button
                className="btn"
                onClick={() => handleNavigate(`/worker/${currentWorkerId}/tasks`)}
              >
                View Tasks
              </button> */}
              <button
                className="btn"
                onClick={() =>
                  handleNavigate(`/worker/${currentWorkerId}/project/${project.id}/tasks`)
                }
              >
                View Tasks
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleOpenProjectSubmission(project)}
              >
                Submit Project
              </button>
            </div>
          ))}
        </div>

        <ProjectSubmissionModal
          isOpen={openProjectSubmissionModal}
          onClose={() => setOpenProjectSubmissionModal(false)}
          onSubmit={handleSubmitProject}
          projectId={currentProjectToSubmit?.id}
          workerId={currentWorkerId}
        />

        {/* ===== QUICK ACTIONS ROW ===== */}
        <div className="quick-actions-row">
          <div className="quick-big-card" onClick={() => handleNavigate("/projects")}>
            <FiBriefcase className="quick-big-icon" />
            <h3>View Projects</h3>
          </div>

          <div className="quick-big-card" onClick={() => handleNavigate("/tasks")}>
            <FiCheckCircle className="quick-big-icon" />
            <h3>View My Tasks</h3>
          </div>

          <div className="quick-big-card" onClick={() => handleNavigate("/supervisors")}>
            <FiUsers className="quick-big-icon" />
            <h3>View Supervisors</h3>
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}
