import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./ProjectSubmissionModal.css";

export default function ProjectSubmissionModal({ isOpen, onClose, onSubmit, projectId, workerId }) {
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  // Upload a single file to Cloudinary
  const handleUpload = async (file) => {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);

      const data = await res.json();
      setPhotos((prev) => [...prev, data.secure_url]);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change (single or multiple)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => handleUpload(file));
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (photos.length === 0) {
      setError("Please upload at least one photo.");
      return;
    }

    const dto = {
      Description: description.trim(),
      PhotoUrls: photos
    };

    onSubmit(projectId, dto);
    setDescription("");
    setPhotos([]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="project-modal-backdrop" onClick={onClose}>
      <div className="project-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Submit Project</h2>

        <textarea
          placeholder="Project description"
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

        {uploading && <p>Uploading image(s)...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="previews">
          {photos.map((photo, i) => (
            <img key={i} src={photo} className="preview-img" alt="uploaded" />
          ))}
        </div>

        <div className="project-modal-buttons">
          <button className="btn-success" onClick={handleSubmit} disabled={uploading}>
            Submit
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
