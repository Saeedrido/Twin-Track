import React, { useState, useEffect, useCallback } from "react";
import WorkerLayout from "../WorkerLayout/WorkerLayout";
import { FiBriefcase, FiCheckCircle, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import EmptyState from "../UI/EmptyState/EmptyState";
import LoadingState from "../UI/LoadingState/LoadingState";
import "./WorkerHistory.css";

export default function WorkerHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const fetchWorkerHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/worker/${userId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok || !data?.isSuccess) {
        setError(true);
        toast.error(data?.message || "Couldn't load history");
        return;
      }

      setHistoryData(data.data || []);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Network error loading history");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token, userId]);

  useEffect(() => {
    if (!token || !userId) return;
    fetchWorkerHistory();
  }, [token, userId, fetchWorkerHistory]);

  if (loading) {
    return (
      <WorkerLayout>
        <div className="worker-history-container">
          <LoadingState variant="skeleton" message="Loading your history..." size="medium" />
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="worker-history-container">
        <header className="history-header">
          <h2>Work History</h2>
          <p className="muted">Your completed tasks and project submissions</p>
        </header>

        {error || historyData.length === 0 ? (
          <EmptyState
            icon={<FiClock />}
            title="No History Yet"
            message="Your work history will appear here once you complete tasks or submit projects."
            size="medium"
          />
        ) : (
          <div className="history-list">
            {historyData.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-icon">
                  {item.type === "task" ? <FiCheckCircle /> : <FiBriefcase />}
                </div>
                <div className="history-content">
                  <h3>{item.name || item.title}</h3>
                  <p className="history-project">{item.projectName || "Project"}</p>
                  <div className="history-meta">
                    <span className="history-date">
                      {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : "Recently"}
                    </span>
                    <span className={`status-badge ${item.status?.toLowerCase()}`}>
                      {item.status || "Completed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}
