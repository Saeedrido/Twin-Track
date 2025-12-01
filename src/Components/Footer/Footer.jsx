import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-top container">
        <div className="footer-col footer-left">
          <div className="footer-logo">
            <img src="/Images/Twin-track-logo.jpg" alt="Boldixer Logo" />
            <h3>TWIN TRACK</h3>
          </div>
          <p>
            Learning with us is fun & addictive. Earn points for correct answers,
            race against the clock, and level up. Our bite-sized lessons are effective,
            and we are good
          </p>
        </div>

        {/* Middle: Main Pages */}
        <div className="footer-col footer-pages">
          <h4>Main Pages</h4>
          <ul>
            <li>About Us</li>
            <li>Services</li>
            <li>Team</li>
            <li>Portfolio</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Middle: Subscription */}
        <div className="footer-col footer-subscribe">
          <h4>Gets Updates</h4>
          <input type="text" placeholder="Enter Full Name" />
          <input type="email" placeholder="Enter Email" />
          <button>Subscribe Now</button>
        </div>

        {/* Right: Blog Insights */}
        <div className="footer-col footer-blog">
          <h4>Blog Insights</h4>
          <div className="blog-item">
            <p>As we've all discovered by now, the world can change</p>
            <span>November 28, 2020</span>
          </div>
          <div className="blog-item">
            <p>Houses are in the upcoming raft helper alone</p>
            <span>August 22, 2020</span>
          </div>
          <div className="blog-item">
            <p>Cranes, hammers and nails. This is the foundation</p>
            <span>May 20, 2020</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © Website - 2025</p>
        <div className="footer-links">
          <span>Terms of Use</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
