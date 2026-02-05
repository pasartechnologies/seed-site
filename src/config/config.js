// Development Configuration
// Toggle features for easier development and testing

export const DEV_CONFIG = {
  // Auto-fill and auto-verify OTP in development
  AUTO_VERIFY_OTP:
    import.meta.env.DEV || import.meta.env.VITE_AUTO_VERIFY_OTP === "true",

  // Show OTP in UI (yellow box)
  SHOW_OTP_IN_UI:
    import.meta.env.DEV || import.meta.env.VITE_SHOW_OTP === "true",

  // Auto-verify delay in milliseconds (1 second default)
  AUTO_VERIFY_DELAY: parseInt(import.meta.env.VITE_AUTO_VERIFY_DELAY || "1000"),

  // Log API responses to console
  LOG_API_RESPONSES: import.meta.env.DEV,
};

export const isDevelopment = () => {
  return import.meta.env.DEV;
};

export const isProduction = () => {
  return import.meta.env.PROD;
};
