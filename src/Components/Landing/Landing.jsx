import React from "react";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="overlay"></div>
      <div className="landing-content text-center">
        <h1 className="brand-name animate-fade-in">TwinTrack</h1>
        <p className="tagline animate-slide-up">
          TRACK WHAT MATTERS BUILD WITH CONFIDENCE
        </p>
        <div className="loader animate-zoom"></div>
      </div>
    </div>
  );
};

export default Landing;
