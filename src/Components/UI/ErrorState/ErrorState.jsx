import React, { useState } from "react";
import { FiAlertCircle, FiRefreshCw, FiHelpCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import "./ErrorState.css";

/**
 * ErrorState Component
 * Displays friendly error messages with retry functionality
 *
 * @param {Object} props
 * @param {string} props.title - Error title
 * @param {string} props.message - Error description
 * @param {Function} props.onRetry - Retry callback function
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {boolean} props.showSupport - Show support contact option
 */
const ErrorState = ({
  title = "Something Went Wrong",
  message = "We couldn't load your data. Please try again.",
  onRetry = null,
  size = "medium",
  showSupport = true,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry && !isRetrying) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  return (
    <motion.div
      className={`tt-error-state tt-error-state--${size}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Error Icon */}
      <motion.div
        className="tt-error-state__icon"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 200,
        }}
      >
        <FiAlertCircle />
      </motion.div>

      {/* Title */}
      <h3 className="tt-error-state__title">{title}</h3>

      {/* Message */}
      <p className="tt-error-state__message">{message}</p>

      {/* Actions */}
      <div className="tt-error-state__actions">
        {onRetry && (
          <motion.button
            className="tt-error-state__retry"
            onClick={handleRetry}
            disabled={isRetrying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isRetrying ? (
              <>
                <FiRefreshCw className="tt-spinning" />
                Retrying...
              </>
            ) : (
              <>
                <FiRefreshCw />
                Try Again
              </>
            )}
          </motion.button>
        )}

        {showSupport && (
          <motion.button
            className="tt-error-state__support"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FiHelpCircle />
            Contact Support
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorState;
