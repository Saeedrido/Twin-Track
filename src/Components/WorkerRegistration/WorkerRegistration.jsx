import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerRegistration.css";

const WorkerRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/Worker/CreateWorker`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Worker registered successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.message || "❌ Registration failed.");
      }
    } catch (error) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="registration-page d-flex align-items-center justify-content-center min-vh-100"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/Images/Twin-track-img-1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="registration-card shadow-lg p-4 bg-white rounded-4" style={{ width: "100%", maxWidth: "600px" }}>
        <div className="text-center mb-4">
          <img
            src={`${process.env.PUBLIC_URL}/Images/Twin-track-logo.jpg`}
            alt="TwinTrack Logo"
            className="mb-2"
            style={{ maxWidth: "100px" }}
          />
          <h3 className="fw-bold">Worker Registration</h3>
          <p className="text-muted small mb-0">Join TwinTrack to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input name="middleName" placeholder="Middle Name" onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input name="dateOfBirth" type="date" onChange={handleChange} required />
            <input name="address" placeholder="Address" onChange={handleChange} required />
            <input name="userName" placeholder="Username" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
          </div>

          {message && (
            <p
              className={`text-center mt-3 fw-semibold ${
                message.includes("✅") ? "text-success" : "text-danger"
              }`}
            >
              {message}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* ✅ Added Supervisor Link */}
        <div className="text-center mt-3">
          <p className="text-muted small mb-0">
            Already registered?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Go to Login
            </span>
          </p>
          <p className="text-muted small mb-0">
            Or are you a{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register-supervisor")}
            >
              Supervisor? Log in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerRegistration;
