import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import "./EnhancedModal.css";

/**
 * EnhancedModal Component
 * Beautiful modal with backdrop blur, smooth animations, and better visual hierarchy
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {ReactNode} props.icon - Optional icon for header
 * @param {ReactNode} props.children - Modal content
 * @param {string} props.size - 'small' | 'medium' | 'large' | 'fullscreen'
 * @param {boolean} props.showCloseButton - Show close button (default: true)
 * @param {Function} props.onPrimaryAction - Primary action handler
 * @param {string} props.primaryActionLabel - Primary button text
 * @param {Function} props.onSecondaryAction - Secondary action handler
 * @param {string} props.secondaryActionLabel - Secondary button text
 */
const EnhancedModal = ({
  isOpen = false,
  onClose = () => {},
  title = "",
  icon = null,
  children = null,
  size = "medium",
  showCloseButton = true,
  onPrimaryAction = null,
  primaryActionLabel = "Confirm",
  onSecondaryAction = null,
  secondaryActionLabel = "Cancel",
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="tt-enhanced-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <div className="tt-enhanced-modal-container">
            <motion.div
              className={`tt-enhanced-modal tt-enhanced-modal--${size}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header */}
              {(title || icon || showCloseButton) && (
                <div className="tt-enhanced-modal__header">
                  <div className="tt-enhanced-modal__header-left">
                    {icon && (
                      <div className="tt-enhanced-modal__icon">{icon}</div>
                    )}
                    {title && (
                      <h2 id="modal-title" className="tt-enhanced-modal__title">
                        {title}
                      </h2>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      className="tt-enhanced-modal__close"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              {children && (
                <div className="tt-enhanced-modal__body">{children}</div>
              )}

              {/* Footer with actions */}
              {(onPrimaryAction || onSecondaryAction) && (
                <div className="tt-enhanced-modal__footer">
                  {onSecondaryAction && (
                    <motion.button
                      className="tt-enhanced-modal__btn tt-enhanced-modal__btn--secondary"
                      onClick={onSecondaryAction}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {secondaryActionLabel}
                    </motion.button>
                  )}
                  {onPrimaryAction && (
                    <motion.button
                      className="tt-enhanced-modal__btn tt-enhanced-modal__btn--primary"
                      onClick={onPrimaryAction}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {primaryActionLabel}
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnhancedModal;
