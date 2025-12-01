import React from "react";
import "./ServicesSection.css";
import { FaBuilding, FaHardHat, FaCoffee, FaTrophy } from "react-icons/fa";

const ServicesSection = () => {
  return (
    <section className="construction-stats-section">
      <div className="construction-stats-overlay">
        <div className="construction-stats-content container">
          <div className="construction-stat">
            <FaBuilding className="construction-stat-icon" />
            <h3>2000+</h3>
            <p>Projects Done</p>
          </div>

          <div className="construction-stat">
            <FaHardHat className="construction-stat-icon" />
            <h3>100+</h3>
            <p>Team Members</p>
          </div>

          <div className="construction-stat">
            <FaCoffee className="construction-stat-icon" />
            <h3>189+</h3>
            <p>Cups of Coffee</p>
          </div>

          <div className="construction-stat">
            <FaTrophy className="construction-stat-icon" />
            <h3>10+</h3>
            <p>Rewards Achieved</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
