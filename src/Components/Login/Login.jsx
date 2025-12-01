import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!response.ok || !data.isSuccess) {
        setError(data.message || "Invalid email/phone or password");
        return;
      }

      const token = data.data.accessToken;

      if (!token) {
        console.error(" No accessToken returned");
        return;
      }

      localStorage.setItem("authToken", token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      console.log(" Logged in UserID:", userId);
      console.log(" Logged in Role:", role);

      if (role === "Supervisor") {
        navigate(`/MainDashboard/${userId}`);
      } else if (role === "Worker") {
      navigate(`/WorkerDashboard/${userId}`);
      } else {
        setError("Unknown role assigned.");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div
        className="login-bg"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/Images/Twin-track-img-1.jpg)`,
        }}
      ></div>

      <div className="login-container shadow-lg p-4">
        <div className="text-center mb-4">
          <img
            src={`${process.env.PUBLIC_URL}/Images/Twin-track-logo.jpg`}
            alt="TwinTrack Logo"
            className="login-logo mb-2"
            style={{ maxWidth: "120px" }}
          />
          <h4 className="fw-bold">TwinTrack</h4>
          <p className="text-muted mb-4">Welcome to TwinTrack</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="emailOrPhone"
              placeholder="Email or Phone Number"
              value={formData.emailOrPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 text-center small">
              {error}
            </div>
          )}

          <div className="text-end mb-3">
            <a href="#" className="text-decoration-none forgot-password">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted small mb-0">
            Don’t have an account?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register-worker")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;