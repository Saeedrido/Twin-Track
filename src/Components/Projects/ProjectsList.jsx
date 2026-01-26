import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiBell,
  FiUser,
  FiSearch,
  FiFilter,
  FiBriefcase,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import AddNewProject from "../Add-New-Project/AddNewProject";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import ViewAllMaterialsModal from "../ViewAllMaterialsModal/ViewAllMaterialsModal";
import EmptyState from "../UI/EmptyState/EmptyState";
import ErrorState from "../UI/ErrorState/ErrorState";
import LoadingState from "../UI/LoadingState/LoadingState";
import { toast } from "react-toastify";
import "./ProjectsList.css";

const ProjectsList = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showViewMaterialsModal, setShowViewMaterialsModal] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // ✅ FETCH PROJECTS WITH LOADING + ERROR HANDLING
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setFetchError(false);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/projects/my-projects`,
          { headers: authHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message || "Couldn't load projects. Please try again.");
          setFetchError(true);
          return;
        }

        if (data.data) {
          const formattedProjects = data.data.map((p) => ({
            id: p.id,
            name: p.name,
            location: p.location,
            supervisors: [],
            startDate: p.startDate || "Not set",
            materials: [],
            status:
              p.status === 0
                ? "Pending"
                : p.status === 1
                  ? "Active"
                  : p.status === 2
                    ? "Completed"
                    : "Pending",
          }));

          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Couldn't load projects. Please check your connection.");
        setFetchError(true);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [API_BASE_URL]);

  // ✅ Add newly created project to UI
  const handleCreateProject = (newProject) => {
    setProjects((prev) => [
      ...prev,
      {
        id: newProject.id,
        name: newProject.name,
        location: newProject.location,
        supervisors: [],
        startDate: newProject.startDate,
        materials: [],
        status:
          newProject.status === 0
            ? "Pending"
            : newProject.status === 1
              ? "Active"
              : newProject.status === 2
                ? "Completed"
                : "Pending",
      },
    ]);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      setDeletingProjectId(projectToDelete.id);

      const res = await fetch(`${API_BASE_URL}/api/v1/projects/${projectToDelete.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      const data = await res.json();

      // ✅ Check backend success status
      if (!data.isSuccess) {
        toast.error(data.message || "Couldn't delete project. Please try again.");
        setShowDeleteModal(false);
        setProjectToDelete(null);
        return;
      }

      toast.success(`Project "${projectToDelete.name}" deleted successfully.`);
      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      setShowDeleteModal(false);
      setProjectToDelete(null);

    } catch (err) {
      console.error(err);
      toast.error("Couldn't delete project. Please check your connection.");
    } finally {
      setDeletingProjectId(null);
    }
  };


  // ✅ NAVIGATE TO PROJECT DASHBOARD
  const handleCardClick = (project) => {
    navigate(`/project/${project.id}/${userId}`, { state: { project } });
  };

  // ✅ SEARCH + FILTER
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = proj.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || proj.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const refreshProjects = () => {
    setFetchError(false);
    setLoadingProjects(true);
    // Trigger the fetch again by re-running the useEffect logic
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/projects/my-projects`,
          { headers: authHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error("Couldn't load projects. Please try again.");
          setFetchError(true);
          return;
        }

        if (data.data) {
          const formattedProjects = data.data.map((p) => ({
            id: p.id,
            name: p.name,
            location: p.location,
            supervisors: [],
            startDate: p.startDate || "Not set",
            materials: [],
            status:
              p.status === 0
                ? "Pending"
                : p.status === 1
                  ? "Active"
                  : p.status === 2
                    ? "Completed"
                    : "Pending",
          }));

          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Couldn't load projects. Please check your connection.");
        setFetchError(true);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  };

  return (
    <div className="tt-dashboard">
      <Sidebar />

      <main className="tt-main">
        {/* ✅ Topbar */}
        <div className="tt-topbar">
          <div className="tt-topbar-left">
            <h1 className="tt-page-title">Projects</h1>
            <p className="muted">Manage and monitor all your active projects</p>
          </div>

          <div className="tt-topbar-right">
            <button className="icon-btn">
              <FiBell />
              <span className="notif-dot" />
            </button>
            <button className="icon-btn">
              <FiUser />
            </button>
          </div>
        </div>

        {/* ✅ Filters */}
        <div className="tt-filters">
          <div className="tt-search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loadingProjects}
            />
          </div>

          <div className="tt-filter-box">
            <FiFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={loadingProjects}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            className="tt-add-btn"
            onClick={() => setIsAddProjectOpen(true)}
            disabled={loadingProjects}
          >
            <FiPlus /> Add New Project
          </button>
        </div>

        {/* ✅ LOADING STATE */}
        {loadingProjects && (
          <LoadingState variant="skeleton" message="Loading your projects..." />
        )}

        {/* ✅ ERROR STATE */}
        {!loadingProjects && fetchError && (
          <ErrorState
            title="Couldn't Load Projects"
            message="We had trouble loading your projects. Please check your connection and try again."
            onRetry={refreshProjects}
          />
        )}

        {/* ✅ PROJECT LIST CARD */}
        {!loadingProjects && !fetchError && (
          <div className="tt-card">
            <div className="tt-card-top">
              <h2>All Projects</h2>
            </div>

            <div className="tt-card-body">
              {/* ✅ EMPTY STATE */}
              {filteredProjects.length === 0 && (
                <EmptyState
                  icon={<FiBriefcase />}
                  title={searchQuery || statusFilter !== "All" ? "No Matching Projects" : "No Projects Yet"}
                  message={
                    searchQuery || statusFilter !== "All"
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "Get started by creating your first project to track your work."
                  }
                  actionLabel={searchQuery || statusFilter !== "All" ? null : "Create Project"}
                  onAction={() => setIsAddProjectOpen(true)}
                />
              )}

              {/* ✅ PROJECT GRID */}
              {filteredProjects.length > 0 && (
                <div className="tt-projects-grid">
                  {filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="tt-project-card large"
                      onClick={() => handleCardClick(proj)}
                    >
                      <div className="tt-project-header">
                        <h3>{proj.name}</h3>
                        <span
                          className={`status-pill ${proj.status === "Active"
                            ? "completed"
                            : proj.status === "Pending"
                              ? "inprogress"
                              : "pending"
                            }`}
                        >
                          {proj.status}
                        </span>
                      </div>

                      <p className="muted">
                        <strong>Location:</strong> {proj.location}
                      </p>

                      <p className="muted start-date">
                        <FiCalendar /> Start: {proj.startDate || "Not set"}
                      </p>

                      <div className="project-actions">
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToDelete(proj);
                            setShowDeleteModal(true);
                          }}
                          disabled={deletingProjectId === proj.id}
                        >
                          {deletingProjectId === proj.id ? "Deleting..." : <><FiTrash2 /> Delete</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ✅ Add Project Modal */}
      {isAddProjectOpen && (
        <AddNewProject
          show={isAddProjectOpen}
          handleClose={() => setIsAddProjectOpen(false)}
          onProjectCreated={handleCreateProject}
        />
      )}

      {/* ✅ Delete Modal */}
      {showDeleteModal && projectToDelete && (
        <ConfirmDialog
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${projectToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* ✅ Materials Modal */}
      {showViewMaterialsModal && selectedProject && (
        <ViewAllMaterialsModal
          project={selectedProject}
          onClose={() => setShowViewMaterialsModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectsList;
