import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MainDashboard.css";

const MainDashboard = ({ supervisorName = "Supervisor" }) => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [projects, setProjects] = useState([]);

  // COUNTS
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [myAssignedSupervisors, setMyAssignedSupervisors] = useState(0);
  const [supervisorsAssignedToMe, setSupervisorsAssignedToMe] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [loadingMySupervisors, setLoadingMySupervisors] = useState(true);
  const [loadingSupervisorsToMe, setLoadingSupervisorsToMe] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [errorWorkers, setErrorWorkers] = useState(false);
  const [errorMySupervisors, setErrorMySupervisors] = useState(false);
  const [errorSupervisorsToMe, setErrorSupervisorsToMe] = useState(false);
  const [errorProjects, setErrorProjects] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState(false);

  const [analyticsData, setAnalyticsData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("last-month");
  const [groupBy, setGroupBy] = useState("day");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) return;

    fetchAllDashboardData();
  }, [timeFilter, groupBy, token]);

  const fetchAllDashboardData = () => {
    fetchWorkersCount();
    fetchSupervisorsAssignedByMe();
    fetchProjectsAndTaskStats();
    fetchAnalytics(timeFilter);
  };

  const fetchWorkersCount = async () => {
    setLoadingWorkers(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/worker/supervisor/${userId}/assigned`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = await res.json();

      if (!payload?.isSuccess || !Array.isArray(payload.data)) {
        setErrorWorkers(true);
        toast.error("Failed to load workers.");
        return;
      }

      const unique = new Set();
      payload.data.forEach((w) => {
        const id = w.workerId ?? w.id;
        if (id) unique.add(String(id));
      });

      setTotalWorkers(unique.size);
    } catch {
      setErrorWorkers(true);
      toast.error("Failed to load workers.");
    } finally {
      setLoadingWorkers(false);
    }
  };

  const fetchSupervisorsAssignedByMe = async () => {
    setLoadingMySupervisors(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/supervisors/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = await res.json();

      if (!payload?.isSuccess || !Array.isArray(payload.data)) {
        setErrorMySupervisors(true);
        toast.error("Failed to load supervisors you assigned.");
        return;
      }

      const setA = new Set();

      payload.data.forEach((sup) => {
        (sup.projects || []).forEach((proj) => {
          if (String(proj.createdBy) === String(userId) && !proj.isLead) {
            setA.add(String(sup.supervisorId));
          }
        });
      });

      setMyAssignedSupervisors(setA.size);
    } catch {
      setErrorMySupervisors(true);
      toast.error("Failed to load supervisors you assigned.");
    } finally {
      setLoadingMySupervisors(false);
    }
  };

  const fetchProjectsAndTaskStats = async () => {
    setLoadingProjects(true);
    setLoadingSupervisorsToMe(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/projects/my-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!data?.isSuccess) {
        setErrorProjects(true);
        toast.error("Failed to load projects.");
        return;
      }

      const list = data.data || [];
      setProjects(list);
      console.log("📦 PROJECTS LOADED:", list);
      const supSet = new Set();

      let tCount = 0;
      let cCount = 0;

      const assignmentPromises = list.map(async (proj) => {
        try {
          const res2 = await fetch(
            `${API_BASE_URL}/api/v1/projects/${proj.id}/assignments`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const payload = await res2.json();

          if (payload?.isSuccess) {
            (payload.data.supervisors || []).forEach((s) => {
              const id = s.id ?? s.supervisorId;
              if (id && !s.isLead) supSet.add(String(id));
            });
          }
        } catch { }
      });

      const taskPromises = list.map(async (proj) => {
        try {
          const res3 = await fetch(
            `${API_BASE_URL}/api/v1/projects/${proj.id}/tasks`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const tData = await res3.json();

          if (tData?.isSuccess) {
            tData.data.forEach((task) => {
              tCount++;
              if (String(task.status).toLowerCase() === "completed") cCount++;
            });
          }
        } catch { }
      });

      await Promise.all([...assignmentPromises, ...taskPromises]);

      setSupervisorsAssignedToMe(supSet.size);
      setTotalTasks(tCount);
      setCompletedTasks(cCount);
    } catch {
      setErrorProjects(true);
      setErrorSupervisorsToMe(true);
      toast.error("Failed to load projects.");
    } finally {
      setLoadingProjects(false);
      setLoadingSupervisorsToMe(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const filter = {
        StartDate: timeFilter === "last-week"
          ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          : timeFilter === "last-2-months"
            ? new Date(new Date().setMonth(new Date().getMonth() - 2))
            : new Date(new Date().setMonth(new Date().getMonth() - 1)),
        EndDate: new Date(),
        GroupBy: groupBy,
        //GroupBy: groupBy
      };
      console.log("📤 FILTER SENT TO BACKEND:", filter);
      const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/analytics`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
      });

      const data = await res.json();

      if (!data?.isSuccess) {
        setErrorAnalytics(true);
        toast.error("Failed to load analytics.");
        return;
      }
      console.log("RAW ANALYTICS RESPONSE:", data);
      console.log("📊 ANALYTICS DATA RECEIVED:", data.data);

      // Map your API data to chart-friendly format
      const chartData = data.data.map((d) => ({
        label: d.label,
        projectsCreated: d.projectsCreated,
        tasksCreated: d.tasksCreated,
        projectsSubmitted: d.projectsSubmitted,
        tasksSubmitted: d.tasksSubmitted,
        projectsApproved: d.projectsApproved,
        tasksApproved: d.tasksApproved,
        projectsRejected: d.projectsRejected,
        tasksRejected: d.tasksRejected,
        workerLogsCreated: d.workerLogsCreated,
        workerLogsSubmitted: d.workerLogsSubmitted,
        workerLogsApproved: d.workerLogsApproved,
        workerLogsRejected: d.workerLogsRejected,
      }))
      .sort((a, b) => new Date(a.label) - new Date(b.label));

      setAnalyticsData(chartData);
      setErrorAnalytics(false);
    } catch (err) {
      console.error(err);
      setErrorAnalytics(true);
      toast.error("Failed to load analytics.");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const incompleteTasks = totalTasks - completedTasks;

  // ✅ Skeleton Card Loader
  const CardLoader = ({ label }) => (
    <div className="dash-card loading-card">
      <div className="loading-bar" />
      <p className="muted" style={{ marginTop: "10px" }}>{label}</p>
    </div>
  );

  return (
    <div className="tt-dashboard">
      <Sidebar userId={userId} />

      <main className="tt-main">
        <div className="dashboard-header">
          <h1>Welcome, {supervisorName} 👋</h1>
          <p className="muted">Here’s what’s happening with your projects today.</p>
        </div>

        {/* ✅ SUMMARY CARDS */}
        <div className="dashboard-cards">

          {/* ✅ Workers Card */}
          {loadingWorkers ? (
            <CardLoader label="Loading Total Workers..." />
          ) : errorWorkers ? (
            <CardLoader label="Failed to load workers." />
          ) : (
            <div className="dash-card">
              <div className="card-icon workers"><FiUsers /></div>
              <div>
                <h2>{totalWorkers}</h2>
                <p>Total Workers</p>
              </div>
            </div>
          )}

          {/* ✅ My Assigned Supervisors */}
          {loadingMySupervisors ? (
            <CardLoader label="Loading Supervisors You Assigned..." />
          ) : errorMySupervisors ? (
            <CardLoader label="Failed to load supervisors you assigned." />
          ) : (
            <div className="dash-card">
              <div className="card-icon supervisors"><FiUsers /></div>
              <div>
                <h2>{myAssignedSupervisors}</h2>
                <p>Supervisors You Assigned</p>
              </div>
            </div>
          )}

          {/* ✅ Supervisors Assigned To Me */}
          {loadingSupervisorsToMe || loadingProjects ? (
            <CardLoader label="Loading Supervisors On Your Projects..." />
          ) : errorSupervisorsToMe ? (
            <CardLoader label="Failed to load supervisors on your projects." />
          ) : (
            <div className="dash-card">
              <div className="card-icon supervisors"><FiUsers /></div>
              <div>
                <h2>{supervisorsAssignedToMe}</h2>
                <p>Supervisors On Your Projects</p>
              </div>
            </div>
          )}

          {/* ✅ Projects Count */}
          {loadingProjects ? (
            <CardLoader label="Loading Projects..." />
          ) : errorProjects ? (
            <CardLoader label="Failed to load projects." />
          ) : (
            <div className="dash-card">
              <div className="card-icon projects"><FiBriefcase /></div>
              <div>
                <h2>{projects.length}</h2>
                <p>Projects</p>
              </div>
            </div>
          )}

          {/* ✅ Tasks Count */}
          {loadingProjects ? (
            <CardLoader label="Loading Tasks..." />
          ) : errorProjects ? (
            <CardLoader label="Failed to load tasks." />
          ) : (
            <div className="dash-card">
              <div className="card-icon tasks"><FiCheckCircle /></div>
              <div>
                <h2>{totalTasks}</h2>
                <p>Tasks ({completedTasks} complete, {incompleteTasks} incomplete)</p>
              </div>
            </div>
          )}
        </div>

        {/* ✅ FILTER */}
        <div className="filter-row">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="last-week">Last 7 Days</option>
            <option value="last-month">Last 30 Days</option>
            <option value="last-2-months">Last 2 Months</option>
          </select>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        {/* ✅ ANALYTICS SECTION */}
        <div className="analytics-section">
          <h3>Project & Task Overview</h3>

          {loadingAnalytics ? (
            <div className="analytics-loading">Loading analytics…</div>
          ) : errorAnalytics ? (
            <div className="analytics-error">Unable to load analytics.</div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="projectsCreated" stroke="#2563eb" name="Projects Created" />
                <Line type="monotone" dataKey="tasksCreated" stroke="#10b981" name="Tasks Created" />
                <Line type="monotone" dataKey="projectsSubmitted" stroke="#f59e0b" name="Projects Submitted" />
                <Line type="monotone" dataKey="tasksSubmitted" stroke="#84cc16" name="Tasks Submitted" />
                <Line type="monotone" dataKey="projectsApproved" stroke="#0ea5e9" name="Projects Approved" />
                <Line type="monotone" dataKey="tasksApproved" stroke="#14b8a6" name="Tasks Approved" />
                <Line type="monotone" dataKey="projectsRejected" stroke="#ef4444" name="Projects Rejected" />
                <Line type="monotone" dataKey="tasksRejected" stroke="#b91c1c" name="Tasks Rejected" />
                <Line type="monotone" dataKey="workerLogsCreated" stroke="#6366f1" name="Logs Created" />
                <Line type="monotone" dataKey="workerLogsSubmitted" stroke="#f59e0b" name="Logs Submitted" />
                <Line type="monotone" dataKey="workerLogsApproved" stroke="#10b981" name="Logs Approved" />
                <Line type="monotone" dataKey="workerLogsRejected" stroke="#ef4444" name="Logs Rejected" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ✅ QUICK ACTIONS */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>

          <div className="quick-grid">
            <div className="quick-card" onClick={() => navigate(`/projects/${userId}`)}>
              <FiBriefcase className="quick-icon" />
              <span>View Projects</span>
            </div>

            <div className="quick-card" onClick={() => navigate(`/workers/${userId}`)}>
              <FiUsers className="quick-icon" />
              <span>View Workers</span>
            </div>

            <div className="quick-card" onClick={() => navigate(`/supervisors/${userId}`)}>
              <FiUsers className="quick-icon" />
              <span>View Supervisors</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
