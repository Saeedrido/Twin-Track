// import React from "react";
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaSearch,
//   FaShoppingCart,
//   FaBars,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import "./Home.css";
// import { Link } from "react-router-dom";

// const Home = () => {
//   return (<div className="home-page">
//     {/* --- Top Info Bar --- */} <div className="top-bar d-flex justify-content-between align-items-center px-3 py-2"> <div className="contact-info"> <FaPhoneAlt className="me-2" /> (+123) 123 4567 890    <FaEnvelope className="me-2" /> [info@domain.com](mailto:info@domain.com) </div> </div>

//     {/* --- Navbar --- */}
//     <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 px-3 shadow-sm">
//       <div className="container-fluid">
//         {/* --- Brand Logo --- */}
//         <div className="navbar-brand d-flex align-items-center">
//           <div className="logo bg-warning text-white fw-bold d-flex align-items-center justify-content-center me-2">
//             ⚙️
//           </div>
//           <div>
//             <span className="fw-bold text-dark">TWIN TRACK</span>
//             <p className="mb-0 text-muted small">CONSTRUCTION CO.</p>
//           </div>
//         </div>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#mainNavbar"
//         >
//           <FaBars />
//         </button>

//         <div className="collapse navbar-collapse" id="mainNavbar">
//           <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//             {/* Home Dropdown */}
//             <li className="nav-item dropdown">
//               <a
//                 className="nav-link dropdown-toggle"
//                 href="#"
//                 data-bs-toggle="dropdown"
//               >
//                 Home
//               </a>
//               <ul className="dropdown-menu">
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     Home 1
//                   </a>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     Home 2
//                   </a>
//                 </li>
//               </ul>
//             </li>

//             {/* Blog */}
//             <li className="nav-item">
//               <a className="nav-link" href="#">
//                 Blog
//               </a>
//             </li>

//             {/* Pages Dropdown */}
//             <li className="nav-item dropdown">
//               <a
//                 className="nav-link dropdown-toggle"
//                 href="#"
//                 data-bs-toggle="dropdown"
//               >
//                 Pages
//               </a>
//               <ul className="dropdown-menu">
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     About
//                   </a>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     Services
//                   </a>
//                 </li>
//               </ul>
//             </li>

//             {/* Shop Dropdown */}
//             <li className="nav-item dropdown">
//               <a
//                 className="nav-link dropdown-toggle"
//                 href="#"
//                 data-bs-toggle="dropdown"
//               >
//                 Shop
//               </a>
//               <ul className="dropdown-menu">
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     Shop 1
//                   </a>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="#">
//                     Shop 2
//                   </a>
//                 </li>
//               </ul>
//             </li>

//             {/* Contact */}
//             <li className="nav-item">
//               <a className="nav-link" href="#">
//                 Contact Us
//               </a>
//             </li>

//             {/* --- Dashboard Link Added Here --- */}
//             <li className="nav-item">
//               <Link className="nav-link fw-semibold text-warning" to="/MainDashboard">
//                 Dashboard
//               </Link>
//             </li>
//           </ul>

//           {/* --- Right Icons --- */}
//           <div className="nav-icons ms-3">
//             <FaSearch className="mx-2" />
//             <FaShoppingCart className="mx-2" />
//           </div>
//         </div>
//       </div>
//     </nav>

//     {/* --- Hero Section --- */}
//     <section className="hero-section d-flex align-items-center justify-content-between flex-wrap">
//       {/* Hero Text Animation */}
//       <motion.div
//         className="hero-text p-4"
//         initial={{ opacity: 0, x: 50 }}
//         whileInView={{ opacity: 1, x: 0 }}
//         transition={{ duration: 1, ease: "easeOut" }}
//         viewport={{ once: true }}
//       >
//         <h6 className="text-muted fw-semibold">We Provide Main Source In</h6>
//         <h1 className="fw-bold">
//           Twin Track Pro <br /> Construction
//         </h1>
//         <div className="mt-4 d-flex flex-wrap gap-3">
//           <motion.button
//             className="btn btn-warning me-3 text-white fw-semibold"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             About Company
//           </motion.button>
//           <motion.button
//             className="btn btn-dark fw-semibold"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Get a Quote
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Hero Image Animation */}
//       <motion.div
//         className="hero-image"
//         initial={{ opacity: 0, x: -50 }}
//         whileInView={{ opacity: 1, x: 0 }}
//         transition={{ duration: 1, ease: "easeOut" }}
//         viewport={{ once: true }}
//       >
//         <img
//           src="/Images/hero-worker.jpg"
//           alt="Construction Worker"
//           className="img-fluid"
//         />
//       </motion.div>
//     </section>
//   </div>


//   );
// };
// export default Home;
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container d-flex align-items-center justify-content-center">
      <motion.div
        className="home-card text-center p-5 rounded shadow"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* --- Logo / Branding --- */}
        <div className="logo-section mb-4">
          <div
            className="logo bg-warning text-white fw-bold d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "80px",
              height: "80px",
              fontSize: "2.2rem",
              boxShadow: "0 4px 10px rgba(255,193,7,0.4)",
            }}
          >
            ⚙️
          </div>
          <h2 className="fw-bold mt-3 text-dark">TWIN TRACK</h2>
          <p className="text-muted mb-1">CONSTRUCTION CO.</p>
          <small className="text-secondary">
            Building With Precision and Passion
          </small>
        </div>

        {/* --- Login Button --- */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/Login"
            className="btn btn-warning text-white fw-semibold px-5 py-2 fs-5"
          >
            Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
