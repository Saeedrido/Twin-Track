import { logout } from "./auth"; // adjust path if needed

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  // Check if token expired
  if (res.status === 401 || res.headers.get("Token-Expired") === "true") {
    alert("Your session has expired. Please log in again.");
    logout(); // removes auth token + userId
    window.location.href = "/login"; // redirect to login page
    return null;
  }

  const data = await res.json().catch(() => ({}));
  return data;
}