import React from "react";
import { motion } from "framer-motion";
import "./EmptyState.css";

/**
 * EmptyState Component
 * Displays a friendly empty state with optional action button
 *
 * @param {Object} props
 * @param {ReactNode} props.icon - Icon to display
 * @param {string} props.title - Main title text
 * @param {string} props.message - Descriptive message
 * @param {string} props.actionLabel - Button text (optional)
 * @param {Function} props.onAction - Button click handler (optional)
 * @param {string} props.size - 'small' | 'medium' | 'large' (default: 'medium')
 */
const EmptyState = ({
  icon = null,
  title = "Nothing Here",
  message = "No data available at the moment.",
  actionLabel = null,
  onAction = null,
  size = "medium",
}) => {
  return (
    <motion.div
      className={`tt-empty-state tt-empty-state--${size}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Icon/Illustration Area */}
      {icon && (
        <motion.div
          className="tt-empty-state__icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          {icon}
        </motion.div>
      )}

      {/* Title */}
      <h3 className="tt-empty-state__title">{title}</h3>

      {/* Message */}
      <p className="tt-empty-state__message">{message}</p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <motion.button
          className="tt-empty-state__action"
          onClick={onAction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
