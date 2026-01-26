import "../ProjectDashboard/ProjectDashboard.css";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Enhanced ModalShell Component
 * Beautiful modal with backdrop blur, smooth animations, and better visual hierarchy
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title
 * @param {Function} props.onClose - Close handler
 * @param {ReactNode} props.icon - Optional icon for header
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {boolean} props.showCloseButton - Show close button (default: true)
 */
const ModalShell = ({
  children,
  title = "",
  onClose = () => {},
  icon = null,
  size = "medium",
  showCloseButton = true,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="pd-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className={`pd-modal pd-modal--${size}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          {(title || icon || showCloseButton) && (
            <div className="pd-modal-header">
              <div className="pd-modal-header-left">
                {icon && (
                  <div className="pd-modal-icon">{icon}</div>
                )}
                {title && (
                  <h3 id="modal-title" className="pd-modal-title">{title}</h3>
                )}
              </div>
              {showCloseButton && (
                <button
                  className="pd-modal-close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="pd-modal-body">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalShell;
