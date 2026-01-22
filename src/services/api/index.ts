/**
 * Central API client wrapper
 *
 * This is the centralized API wrapper that should be used for all API calls.
 * It handles:
 * - CSRF token management
 * - Error logging to Sentry
 * - Request/response interceptors
 * - snake_case ↔ camelCase transformations
 *
 * @see api-rules.mdc for usage guidelines
 */
export {
  httpClient,
  httpClientExternal,
  httpClientAuth,
  configureFormDataHeaders,
  HTTP_METHODS,
} from './api-client';

// Default export for backward compatibility
export { default } from './api-client';
