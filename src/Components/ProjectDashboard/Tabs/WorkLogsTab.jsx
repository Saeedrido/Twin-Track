import React, { useState, useEffect } from "react";
import "./WorkLogsTab.css";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

const WorkLogsTab = ({ logs: initialLogs, loading }) => {
    const [logs, setLogs] = useState(initialLogs || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageModal, setImageModal] = useState({ open: false, images: [], index: 0 });
    const [processingId, setProcessingId] = useState(null); // Track which log is being processed

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        setLogs(initialLogs || []);
    }, [initialLogs]);

    if (loading) return <div className="muted">Loading logs...</div>;
    if (!logs || logs.length === 0) return <div className="muted">No logs available.</div>;

    const currentLog = logs[currentIndex];
    const images = Array.isArray(currentLog.photosUrls) ? currentLog.photosUrls : [];

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.split(" ");
        return parts.length < 2
            ? parts[0][0].toUpperCase()
            : (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const nextWorker = () => setCurrentIndex((i) => Math.min(i + 1, logs.length - 1));
    const prevWorker = () => setCurrentIndex((i) => Math.max(i - 1, 0));

    const nextImage = () =>
        setImageModal((m) => ({ ...m, index: (m.index + 1) % m.images.length }));
    const prevImage = () =>
        setImageModal((m) => ({ ...m, index: (m.index - 1 + m.images.length) % m.images.length }));

    // --- Approve / Reject Handler ---
    const handleReview = async (id, approved) => {
        if (!currentLog) return;

        setProcessingId(id); // Start processing

        const endpoint =
            currentLog.type === "task"
                ? `${API_BASE_URL}/api/v1/supervisors/tasks/${currentLog.submissionId}/review`
                : `${API_BASE_URL}/api/v1/supervisors/projects/${currentLog.submissionId}/review`;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ approved }),
            });

            const data = await res.json();
            if (res.ok && data.isSuccess) {
                toast.success(approved ? "Approved successfully!" : "Rejected successfully!");

                // Remove this log from the list
                const updatedLogs = logs.filter((log) => log.id !== id);
                setLogs(updatedLogs);

                // Adjust index if needed
                if (currentIndex >= updatedLogs.length) {
                    setCurrentIndex(Math.max(0, updatedLogs.length - 1));
                }
            } else {
                toast.error(data?.message || "Action failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error");
        } finally {
            setProcessingId(null); // Stop processing
        }
    };

    // --- Determine button state based on status ---
    const renderActionButtons = () => {
        if (!currentLog) return null;

        const status = currentLog.type === "task" ? currentLog.taskStatus : currentLog.projectStatus;

        if (status === "Completed") {
            return <button className="approved-disabled" disabled>✔ Already Approved</button>;
        }

        // If processing, show "Processing..." text
        if (processingId === currentLog.id) {
            return <button className="processing-btn" disabled>⏳ Processing...</button>;
        }

        // Otherwise, show normal Approve / Reject buttons
        return (
            <>
                <button className="reject-btn" onClick={() => handleReview(currentLog.id, false)}>❌ Reject</button>
                <button className="approve-btn" onClick={() => handleReview(currentLog.id, true)}>✅ Approve</button>
            </>
        );
    };

    return (
        <div className="log-container">
            {/* Worker Header */}
            <div className="log-header">
                <div className="avatar">{getInitials(currentLog.workerFullName)}</div>
                <div className="worker-info">
                    <h2>{currentLog.workerFullName}</h2>
                    <div className="sub-info">
                        <strong>Task:</strong> {currentLog.taskName || "-"} <br />
                        <strong>Project:</strong> {currentLog.projectName || "-"}
                    </div>
                </div>
                <div className="worker-nav">
                    <button disabled={currentIndex === 0} onClick={prevWorker}>⬅️</button>
                    <button disabled={currentIndex === logs.length - 1} onClick={nextWorker}>➡️</button>
                </div>
            </div>

            {/* Description */}
            <p className="description">{currentLog.description}</p>

            {/* Image Carousel */}
            <div className="image-section">
                {images.length === 0 ? (
                    <div className="muted">No Image Submitted</div>
                ) : (
                    <div className="image-carousel">
                        {images.length > 1 && (
                            <button
                                className="img-nav left"
                                onClick={() => setImageModal({ open: true, images, index: 0 })}
                            >⬅️</button>
                        )}
                        <img
                            src={images[0]}
                            alt="Proof"
                            className="main-image"
                            onClick={() => setImageModal({ open: true, images, index: 0 })}
                        />
                        {images.length > 1 && (
                            <button
                                className="img-nav right"
                                onClick={() => setImageModal({ open: true, images, index: 0 })}
                            >➡️</button>
                        )}
                    </div>
                )}
            </div>

            {/* Timestamp + Status */}
            <div className="details-footer">
                <div><strong>Time:</strong> {new Date(currentLog.timestamp).toLocaleString()}</div>
                <div><strong>Status:</strong> {currentLog.type === "task" ? currentLog.taskStatus : currentLog.projectStatus}</div>
            </div>

            {/* Approve / Reject */}
            <div className="action-buttons">
                {renderActionButtons()}
            </div>

            {/* Modal Viewer */}
            {imageModal.open &&
                ReactDOM.createPortal(
                    <div className="modal-backdrop" onClick={() => setImageModal({ ...imageModal, open: false })}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <img src={imageModal.images[imageModal.index]} className="modal-image" alt="full" />
                            {imageModal.images.length > 1 && (
                                <>
                                    <button className="modal-nav left" onClick={prevImage}>⬅️</button>
                                    <button className="modal-nav right" onClick={nextImage}>➡️</button>
                                </>
                            )}
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    );
};

export default WorkLogsTab;
