import React, { useState } from "react";
import { FiUpload, FiX, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

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
    setUploadProgress(`Uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...`);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const url = await uploadSingleFile(selectedFiles[i]);
        uploadedUrls.push(url);
        setUploadProgress(`Uploading ${i + 1} of ${selectedFiles.length}...`);
      }
      setPhotos((prev) => [...prev, ...uploadedUrls]);
      setUploadProgress("");
    } catch (err) {
      console.error(err);
      setError("Couldn't upload images. Please try again.");
      setUploadProgress("");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please add a description of your work.");
      return;
    }
    if (photos.length === 0) {
      setError("Please upload at least one photo of your completed work.");
      return;
    }
    if (uploading) {
      setError("Please wait for images to finish uploading.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(taskId, {
        description: description.trim(),
        photoUrls: photos
      });

      setDescription("");
      setPhotos([]);
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Couldn't submit task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-modal-backdrop">
      <div className="task-modal">
        <div className="task-modal-header">
          <h2>Submit Task for Review</h2>
          <p className="task-modal-subtitle">Add details and photos of your completed work</p>
        </div>

        <div className="form-group">
          <label className="form-label">Work Description *</label>
          <textarea
            placeholder="Describe what you accomplished..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Photos *</label>
          <div className="file-upload-area">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="file-upload-input"
              id="photo-upload"
              disabled={uploading}
            />
            <label htmlFor="photo-upload" className="file-upload-label">
              <FiUpload className="upload-icon" />
              <span>Choose Photos</span>
              <small>Upload images of your work</small>
            </label>
          </div>
        </div>

        {uploading && (
          <div className="upload-progress">
            <FiLoader className="spinner" />
            <span>{uploadProgress}</span>
          </div>
        )}

        {error && (
          <div className="error-message-box">
            <FiAlertCircle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {photos.length > 0 && (
          <div className="previews">
            {photos.map((photo, i) => (
              <div key={i} className="preview-container">
                <img src={photo} className="preview-img" alt="uploaded" />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => removePhoto(i)}
                  disabled={submitting}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="task-modal-buttons">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn-success"
            onClick={handleSubmit}
            disabled={uploading || submitting}
          >
            {submitting ? (
              <>
                <FiLoader className="spinner" />
                Submitting...
              </>
            ) : (
              <>
                <FiCheckCircle />
                Submit Work
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
