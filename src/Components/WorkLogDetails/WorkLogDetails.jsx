import React from "react";
import { FiSearch, FiBell, FiUser, FiPlay } from "react-icons/fi";
import "./WorkLogDetails.css";

const WorkLogDetails = () => {
  return (
    <div className="worklog-inner">
      <div className="topbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="topbar-icons">
          <FiBell className="icon" />
          <FiUser className="icon" />
        </div>
      </div>

      <div className="worklog-card">
        <div className="worklog-header">
          <div className="user-info">
            <img
              src="https://via.placeholder.com/50"
              alt="User"
              className="user-avatar"
            />
            <div>
              <h3 className="user-name">John D.</h3>
              <p className="user-id">ID: WL-2024-08-14-001</p>
              <p className="project-name">Eco-Park Build</p>
            </div>
          </div>
          <div className="status-date">
            <p className="date-text">August 14, 2024 at 3:30 PM</p>
            <span className="status-pill pending">Pending</span>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <p className="label">Task</p>
            <p className="value">Foundation Pour “Bridge Expansion”</p>
          </div>
          <div className="detail-item">
            <p className="label">Task Reported Duration</p>
            <p className="value">4.5 Hours</p>
          </div>
          <div className="detail-item">
            <p className="label">Reported Duration</p>
            <p className="value">1 Hour</p>
          </div>
          <div className="detail-item">
            <p className="label">Status</p>
            <p className="value status-text">In Progress / Pending Review</p>
          </div>
        </div>

        <div className="media-section">
          <p className="label">Media</p>
          <p className="media-text">
            Completed formwork and rebar installation for the platform slab.
            Ready for concrete pour tomorrow. Minor adjustments needed on the
            north-east corner as per plan update.
          </p>
          <div className="media-grid">
            <img
              src="https://via.placeholder.com/160x110?text=Photo+1"
              alt="Construction"
              className="media-img"
            />
            <img
              src="https://via.placeholder.com/160x110?text=Photo+2"
              alt="Construction"
              className="media-img"
            />
          </div>
        </div>

        <div className="voice-section">
          <p className="label">Voice Note</p>
          <div className="voice-box">
            <FiPlay className="play-icon" />
            <div className="voice-wave">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
            <p className="voice-time">0:15 / 0:45</p>
          </div>
        </div>

        <div className="comment-section">
          <p className="label">Supervisor Comments</p>
          <textarea
            placeholder="Add comment..."
            className="comment-box"
          ></textarea>
          <button className="comment-submit">Submit Comment</button>
        </div>

        <div className="worklog-actions">
          <button className="approve-btn">Approve Work Log</button>
          <button className="reject-btn">Reject Work Log</button>
        </div>
      </div>
    </div>
  );
};

export default WorkLogDetails;
