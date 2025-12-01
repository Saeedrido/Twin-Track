import React from "react";
import { motion } from "framer-motion";
import "./About.css";

const About = () => {
  return (
    <section className="about-section container py-5">
      <div className="row align-items-center">
        {/* Left side image animation */}
        <div className="col-md-6 text-center">
          <motion.img
            src="/Images/hero-worker.jpg"
            alt="Engineer"
            className="img-fluid about-img"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>

        {/* Right side text animation */}
        <motion.div
          className="col-md-6 mt-4 mt-md-0"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="about-subtitle">01---About Us</p>
          <h2 className="about-title">
            We Help People <br /> Elevate Happiness
          </h2>
          <p className="about-text">
            Vivamus suscipit tortor eget <strong>felis porttitor volutpat.</strong>{" "}
            Donec rutrum congue leo eget malesuada. Nulla porttitor accumsan
            tincidunt. Vestibulum ante ipsum primis.
          </p>
          <motion.button
            className="about-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read more
          </motion.button>
        </motion.div>
      </div>

      {/* Partner logos animation */}
      <motion.div
        className="partners d-flex flex-wrap justify-content-center align-items-center mt-5 gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        viewport={{ once: true }}
      >
        <img src="/Images/MCG.png" alt="MCG" />
        <img src="/Images/Orion.png" alt="Orion" />
        <img src="/Images/finetech.png" alt="Finetech" />
        <img src="/Images/Douglas.png" alt="Douglas" />
      </motion.div>
    </section>
  );
};

export default About;
