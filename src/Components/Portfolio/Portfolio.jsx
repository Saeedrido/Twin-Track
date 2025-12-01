import React from "react";
import { motion } from "framer-motion";
import "./Portfolio.css";
import { FaArrowRight } from "react-icons/fa";

const projects = [
  {
    id: 1,
    title: "Core Footprint building",
    category: "Construction",
    image: "/Images/Portfolio-1.jpg",
  },
  {
    id: 2,
    title: "Core Footprint building",
    category: "Construction",
    image: "/Images/Portfolio-2.jpg",
  },
  {
    id: 3,
    title: "Core Footprint building",
    category: "Construction",
    image: "/Images/Portfolio-3.jpg",
  },
];

const Portfolio = () => {
  return (
    <section className="portfolio-section">
      <div className="portfolio-header container">
        <motion.p
          className="portfolio-subtitle"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          06 --- Portfolio
        </motion.p>

        <motion.h2
          className="portfolio-title"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Our Works
        </motion.h2>
      </div>

      <div className="portfolio-grid container">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="portfolio-card"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="portfolio-img">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="portfolio-info">
              <p className="portfolio-category">{project.category}</p>
              <h3 className="portfolio-name">{project.title}</h3>
              <FaArrowRight className="portfolio-arrow" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
