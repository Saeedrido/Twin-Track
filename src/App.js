import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Services from "./Components/Services/Services";
import ServicesSection from "./Components/Achivement/ServicesSection";
import Portfolio from "./Components/Portfolio/Portfolio";
import QuotePage from "./Components/QuoteSection/QuotePage";
import Footer from "./Components/Footer/Footer";
import Dashboard from "./Components/MainDashboard/MainDashboard";
import ProjectsList from "./Components/Projects/ProjectsList";
import ProjectDashboard from "./Components/ProjectDashboard/ProjectDashboard";
import WorkersList from "./Components/WorkersList/WorkersList";
import SupervisorsList from "./Components/SupervisorsList/SupervisorsList";
import Login from "./Components/Login/Login";
import Landing from "./Components/Landing/Landing";
import RegisterSupervisor from "./Components/SupervisorRegistration/SupervisorRegistration";
import RegisterWorker from "./Components/WorkerRegistration/WorkerRegistration";
import WorkerDashboard from "./Components/WorkerDashboard/WorkerDashboard";
import WorkerTasks from "./Components/WorkerTasks/WorkerTasks";

function App() {
  const [showHome] = useState(true);

  return (
    <Router>
      {/* ✅ Global Notification System */}
      <ToastContainer position="top-right" autoClose={3000} />

      {showHome && (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <About />
                <Services />
                <ServicesSection />
                <Portfolio />
                <QuotePage />
                <Footer />
              </>
            }
          />

          {/* ✅ Dashboard + App Routes */}
          <Route path="/MainDashboard/:userId" element={<Dashboard />} />
          <Route path="/WorkerDashboard/:userId" element={<WorkerDashboard />} />
          <Route path="/projects/:userId" element={<ProjectsList />} />
          <Route path="/project/:id/:userId" element={<ProjectDashboard />} />
          <Route path="/workers/:userId" element={<WorkersList />} />
          <Route path="/supervisors/:userId" element={<SupervisorsList />} />
          <Route path="/register-supervisor" element={<RegisterSupervisor />} />
          <Route path="/register-worker" element={<RegisterWorker />} />
          <Route path="/worker/:workerId/project/:projectId/tasks" element={<WorkerTasks />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Landing" element={<Landing />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
