import React, { useState } from "react";
import "./TaskSubmissionModal.css";

export default function TaskSubmissionModal({
  isOpen,
  onClose,
  onSubmit,
  taskId,
  workerId
}) {
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // New state for submission
  const [error, setError] = useState("");

  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  // Upload a single file to Cloudinary
  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  // Handle selecting multiple files
  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls = [];
      for (let file of selectedFiles) {
        const url = await uploadSingleFile(file);
        uploadedUrls.push(url);
      }
      setPhotos((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      setError("Failed to upload one or more images.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (photos.length === 0) {
      setError("Please upload at least one photo.");
      return;
    }
    if (uploading) {
      setError("Please wait until images finish uploading.");
      return;
    }

    setSubmitting(true); // Start submission

    try {
      await onSubmit(taskId, {
        description: description.trim(),
        photoUrls: photos
      });

      // Reset modal state
      setDescription("");
      setPhotos([]);
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to submit task.");
    } finally {
      setSubmitting(false); // End submission
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-modal-backdrop">
      <div className="task-modal">
        <h2>Submit Task</h2>

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="file-upload-input"
        />

        {uploading && <p>Uploading images...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="previews">
          {photos.map((photo, i) => (
            <img key={i} src={photo} className="preview-img" alt="uploaded" />
          ))}
        </div>

        <div className="task-modal-buttons">
          <button
            className="btn-success"
            onClick={handleSubmit}
            disabled={uploading || submitting}
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>

          <button className="btn-cancel" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
