// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FiHome, FiBriefcase, FiUsers, FiUserCheck, FiSettings, FiLogOut } from "react-icons/fi";
// import { logout } from "../../utils/auth";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userId = localStorage.getItem("userId");

//   const menuItems = [
//     { name: "Dashboard", path: `/MainDashboard/${userId}`, icon: <FiHome /> },
//     { name: "Projects", path: `/projects/${userId}`, icon: <FiBriefcase /> },
//     { name: "Workers", path: `/workers/${userId}`, icon: <FiUsers /> },
//     { name: "Supervisors", path: `/supervisors/${userId}`, icon: <FiUserCheck /> },
//     { name: "Settings", path: `/settings/${userId}`, icon: <FiSettings /> },
//   ];

//   return (
//     <aside className="tt-sidebar">
//       <div className="tt-logo">TwinTrack</div>

//       <ul className="tt-menu">
//         {menuItems.map((item) => (
//           <li
//             key={item.path}
//             className={`tt-menu-item ${location.pathname === item.path ? "active" : ""}`}
//             onClick={() => navigate(item.path)}
//           >
//             {item.icon}
//             <span>{item.name}</span>
//           </li>
//         ))}
//       </ul>

//       <div className="tt-logout" onClick={logout}>
//         <FiLogOut />
//         <span>Logout</span>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiUserCheck,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { logout } from "../../utils/auth";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const menuItems = [
    { name: "Dashboard", path: `/MainDashboard/${userId}`, icon: <FiHome /> },
    { name: "Projects", path: `/projects/${userId}`, icon: <FiBriefcase /> },
    { name: "Workers", path: `/workers/${userId}`, icon: <FiUsers /> },
    { name: "Supervisors", path: `/supervisors/${userId}`, icon: <FiUserCheck /> },
    { name: "Settings", path: `/settings/${userId}`, icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Hamburger button */}
      <div className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </div>

      <aside className={`tt-sidebar ${isOpen ? "open" : ""}`}>
        <div className="tt-logo">TwinTrack</div>

        <ul className="tt-menu">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`tt-menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false); // auto-close on mobile
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </li>
          ))}
        </ul>

        <div className="tt-logout" onClick={logout}>
          <FiLogOut />
          <span>Logout</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
