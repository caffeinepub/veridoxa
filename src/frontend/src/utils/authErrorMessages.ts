/**
 * Utility for normalizing authorization errors into user-friendly messages
 * with actionable next steps
 */

interface AuthErrorResult {
  isAuthError: boolean;
  message: string;
}

/**
 * Detects if an error is authorization-related and returns a friendly message
 * with guidance on how to resolve it
 */
export function normalizeAuthError(error: Error): AuthErrorResult {
  const errorMessage = error.message.toLowerCase();
  
  // Check for common authorization error patterns
  const isAuthError = 
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('access denied') ||
    errorMessage.includes('only admins') ||
    errorMessage.includes('permission') ||
    errorMessage.includes('not authorized');

  if (!isAuthError) {
    return {
      isAuthError: false,
      message: error.message,
    };
  }

  // Return user-friendly message with next steps
  return {
    isAuthError: true,
    message: 'Access denied: Your account is not recognized as an admin. Please ensure you are logged in with the correct admin account and have provided the admin token if required.',
  };
}

/**
 * Gets a user-friendly error message for display in toasts/alerts
 */
export function getErrorMessage(error: Error, defaultPrefix: string): string {
  const normalized = normalizeAuthError(error);
  
  if (normalized.isAuthError) {
    return normalized.message;
  }
  
  return `${defaultPrefix}: ${error.message}`;
}
