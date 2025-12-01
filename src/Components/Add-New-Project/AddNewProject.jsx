import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddNewProject = ({ show, handleClose, onProjectCreated }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!token) {
      setError("You must be logged in to create a project.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,    // ✅ IMPORTANT!! SEND TOKEN
        },
        body: JSON.stringify({
          name,
          location,
          description,
        }),
      });

      if (response.status === 401) {
        setError("Your session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      let data = null;

      try {
        data = await response.json(); // ✅ safe JSON parse
      } catch {
        setError("Unexpected server error. Try again.");
        setLoading(false);
        return;
      }

      if (!response.ok || data.isSuccess === false) {
        setError(data.message || "Failed to create project.");
        setLoading(false);
        return;
      }

      // ✅ Project successfully created
      onProjectCreated(data.data);

      // ✅ Reset fields
      setName("");
      setLocation("");
      setDescription("");

      handleClose();
    } catch (err) {
      console.error("Create project error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Project</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewProject;
