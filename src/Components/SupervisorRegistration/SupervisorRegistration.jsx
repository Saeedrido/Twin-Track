import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SupervisorRegistration.css";

const SupervisorRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNumber: "",
    gender: "", // will store enum value as a number
    dateOfBirth: "",
    address: "",
    userName: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert gender string to integer for backend enum
    if (name === "gender") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("🚀 Sending form data:", formData); // <-- log what’s sent

    // 🧠 Frontend password match check
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/Supervisors/CreateSupervisor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      console.log("🧾 Response status:", res.status);
      const text = await res.text();
      console.log("🧾 Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (res.ok) {
        setMessage("✅ Supervisor registered successfully!");
        console.log("✅ Success response:", data);
        setTimeout(() => navigate("/"), 2000);
      } else {
        console.error("❌ Backend error:", data);
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("🔥 Fetch error:", error);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="supervisor-registration-page d-flex align-items-center justify-content-center min-vh-100"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/Images/Twin-track-img-1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="registration-card shadow-lg p-4 bg-white rounded-4"
        style={{ width: "100%", maxWidth: "650px" }}
      >
        <div className="text-center mb-4">
          <img
            src={`${process.env.PUBLIC_URL}/Images/Twin-track-logo.jpg`}
            alt="TwinTrack Logo"
            className="mb-2"
            style={{ maxWidth: "100px" }}
          />
          <h3 className="fw-bold">Supervisor Registration</h3>
          <p className="text-muted small mb-0">
            Manage your team with TwinTrack
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
            <input
              name="middleName"
              placeholder="Middle Name"
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />

            {/* ✅ Enum values sent as numbers */}
            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>

            <input
              name="dateOfBirth"
              type="date"
              onChange={handleChange}
              required
            />
            <input
              name="address"
              placeholder="Address"
              onChange={handleChange}
              required
            />
            <input
              name="userName"
              placeholder="Username"
              onChange={handleChange}
              required
            />
            <input
              name="department"
              placeholder="Department"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <p
              className={`text-center mt-3 fw-semibold ${message.includes("✅") ? "text-success" : "text-danger"
                }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

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
            Or want to register as a{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register-worker")}
            >
              Worker?
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupervisorRegistration;
