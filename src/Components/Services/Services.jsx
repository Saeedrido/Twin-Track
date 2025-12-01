import React from "react";
import { motion } from "framer-motion";
import { FaHammer, FaHome, FaTools, FaBuilding } from "react-icons/fa";
import "./Services.css";

const servicesData = [
  {
    id: 1,
    icon: <FaBuilding />,
    title: "Interior Design",
    subtitle: "Make With Fiter",
  },
  {
    id: 2,
    icon: <FaHome />,
    title: "Exterior Design",
    subtitle: "Make With Fiter",
  },
  {
    id: 3,
    icon: <FaHammer />,
    title: "Home Design",
    subtitle: "Make With Fiter",
  },
  {
    id: 4,
    icon: <FaTools />,
    title: "Architect Design",
    subtitle: "Make With Fiter",
  },
];

const Services = () => {
  return (
    <section className="services-section container py-5">
      <p className="services-subtitle text-warning text-center mb-2">
        04 --- Services
      </p>
      <h2 className="services-title text-center mb-5">What We Do</h2>

      <div className="row g-4 justify-content-center">
        {servicesData.map((service, index) => (
          <motion.div
            key={service.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="service-card text-center p-4 shadow-sm">
              <div className="service-icon mb-3 text-warning fs-2">
                {service.icon}
              </div>
              <p className="service-subtitle mb-1">{service.subtitle}</p>
              <h5 className="service-title fw-bold">{service.title}</h5>
              <motion.button
                className="service-btn mt-3"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                +
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
