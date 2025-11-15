/**
 * Get the application URL and normalize it (remove trailing slash)
 * @returns {string} Normalized app URL without trailing slash
 */
export const getAppUrl = () => {
  let baseUrl = "";

  // In browser environment, use current origin (works in production)
  if (typeof window !== "undefined" && window.location) {
    baseUrl = window.location.origin;
  } else {
    // Fallback to environment variable
    baseUrl = import.meta.env.VITE_APP_URL || "";
  }

  // Remove trailing slash to avoid double slashes
  return baseUrl.replace(/\/+$/, "");
};

/**
 * Build a URL path by appending to the base URL
 * @param {string} path - Path to append (should start with /)
 * @returns {string} Full URL
 */
export const buildUrl = (path) => {
  const baseUrl = getAppUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

