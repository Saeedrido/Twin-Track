import React from "react";
import "./QuotePage.css";

const QuotePage = () => {
  return (
    <section className="qq-quote-section">
      <div className="qq-overlay" />
      <div className="qq-form-container">
        <div className="qq-form-box">
          <h3 className="qq-title">Get a Full Quote</h3>
          <form className="qq-form" onSubmit={(e) => e.preventDefault()}>
            <input className="qq-input" type="text" placeholder="Full Name" />
            <input className="qq-input" type="email" placeholder="Email id" />
            <input className="qq-input" type="text" placeholder="Subject" />
            <input className="qq-input" type="tel" placeholder="Phone No" />
            <button className="qq-btn" type="submit">Get a Quote</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default QuotePage;
