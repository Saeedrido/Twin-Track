export function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    window.location.href = "/login";
}
