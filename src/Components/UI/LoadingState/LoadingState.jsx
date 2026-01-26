import React from "react";
import { motion } from "framer-motion";
import "./LoadingState.css";

/**
 * LoadingState Component
 * Displays loading states with skeleton screens, spinners, or progress indicators
 *
 * @param {Object} props
 * @param {string} props.variant - 'skeleton' | 'spinner' | 'dots' | 'bar'
 * @param {string} props.message - Optional loading message
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {number} props.count - Number of skeleton items (for skeleton variant)
 */
const LoadingState = ({
  variant = "skeleton",
  message = null,
  size = "medium",
  count = 3,
}) => {
  // Skeleton variant - for lists/cards
  if (variant === "skeleton") {
    return (
      <div className={`tt-loading-skeleton tt-loading-skeleton--${size}`}>
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="tt-skeleton-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="tt-skeleton-avatar" />
            <div className="tt-skeleton-content">
              <div className="tt-skeleton-title" />
              <div className="tt-skeleton-text" />
              <div className="tt-skeleton-text tt-skeleton-text--short" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Spinner variant - for full-page or card loading
  if (variant === "spinner") {
    return (
      <div className={`tt-loading-spinner tt-loading-spinner--${size}`}>
        <motion.div
          className="tt-spinner"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {message && <p className="tt-spinner-message">{message}</p>}
      </div>
    );
  }

  // Dots variant - for inline loading
  if (variant === "dots") {
    return (
      <div className="tt-loading-dots">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="tt-dot"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  // Bar variant - for progress-like loading
  if (variant === "bar") {
    return (
      <div className={`tt-loading-bar tt-loading-bar--${size}`}>
        <motion.div
          className="tt-bar-track"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  return null;
};

export default LoadingState;
