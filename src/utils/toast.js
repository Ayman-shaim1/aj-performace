import { toaster } from "./toaster";

/**
 * Reusable toast function for showing notifications
 * @param {Object} options - Toast options
 * @param {string} options.title - Title of the toast
 * @param {string} [options.description] - Description of the toast
 * @param {'success'|'error'|'warning'|'info'} [options.type='info'] - Type of toast (determines color/icon)
 * @param {number} [options.duration=3000] - Duration in milliseconds
 * @param {'top'|'top-start'|'top-end'|'bottom'|'bottom-start'|'bottom-end'|'top-center'} [options.position='top-center'] - Position of the toast
 * @returns {Object} Toast instance with close method
 * 
 * @example
 * // Success toast (green) at top-center
 * showToast({ 
 *   title: "Success!", 
 *   description: "Operation completed", 
 *   type: "success" 
 * });
 * 
 * @example
 * // Error toast (red) at top
 * showToast({ 
 *   title: "Error!", 
 *   type: "error", 
 *   position: "top" 
 * });
 */
export const showToast = ({
  title,
  description,
  type = "info",
  duration = 3000,
  position = "top-center",
}) => {
  // Map custom position to Chakra UI placement
  const positionMap = {
    "top-center": "top",
    "top": "top",
    "top-start": "top-start",
    "top-end": "top-end",
    "bottom": "bottom",
    "bottom-start": "bottom-start",
    "bottom-end": "bottom-end",
  };

  // Update toaster placement if position changed
  const placement = positionMap[position] || "top";

  return toaster.create({
    title,
    description,
    type, // 'success' (green), 'error' (red), 'warning' (yellow), 'info' (blue)
    duration,
    placement,
  });
};

// Convenience methods for common toast types
export const showSuccessToast = (title, description, options = {}) =>
  showToast({ title, description, type: "success", ...options });

export const showErrorToast = (title, description, options = {}) => {
  // If title is empty, use description as the only content (no title)
  if (!title || title.trim() === "") {
    return showToast({ 
      title: description || "An error occurred", 
      description: undefined, 
      type: "error", 
      duration: 5000, // Longer duration for errors
      ...options 
    });
  }
  return showToast({ 
    title, 
    description, 
    type: "error", 
    duration: 5000, // Longer duration for errors
    ...options 
  });
};

export const showWarningToast = (title, description, options = {}) =>
  showToast({ title, description, type: "warning", ...options });

export const showInfoToast = (title, description, options = {}) =>
  showToast({ title, description, type: "info", ...options });

