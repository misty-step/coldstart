/**
 * Enhanced Error Handling
 * 
 * Categorized errors with retry logic following Misty Step patterns.
 * Categories: timeout, rate_limit, auth, network, api, validation, quota, unknown
 */

export type ErrorCategory =
  | "timeout"
  | "rate_limit"
  | "auth"
  | "network"
  | "api"
  | "validation"
  | "quota"
  | "unknown";

interface ErrorMetadata {
  category: ErrorCategory;
  retryable: boolean;
  statusCode?: number;
  originalError?: Error;
}

/**
 * EnhancedError class for structured error handling
 */
export class EnhancedError extends Error {
  public readonly category: ErrorCategory;
  public readonly retryable: boolean;
  public readonly statusCode?: number;
  public readonly originalError?: Error;
  public readonly timestamp: number;

  constructor(
    message: string,
    metadata: Omit<ErrorMetadata, "originalError"> & { originalError?: Error }
  ) {
    super(message);
    this.name = "EnhancedError";
    this.category = metadata.category;
    this.retryable = metadata.retryable;
    this.statusCode = metadata.statusCode;
    this.originalError = metadata.originalError;
    this.timestamp = Date.now();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnhancedError);
    }
  }

  /**
   * Convert to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      category: this.category,
      retryable: this.retryable,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      stack: this.stack,
      originalError: this.originalError
        ? {
            name: this.originalError.name,
            message: this.originalError.message,
            stack: this.originalError.stack,
          }
        : undefined,
    };
  }
}

/**
 * Categorize an error based on its properties
 */
export function categorizeError(error: unknown): ErrorMetadata {
  if (error instanceof EnhancedError) {
    return {
      category: error.category,
      retryable: error.retryable,
      statusCode: error.statusCode,
      originalError: error.originalError,
    };
  }

  const err = error instanceof Error ? error : new Error(String(error));
  const message = err.message.toLowerCase();

  // Timeout errors
  if (
    message.includes("timeout") ||
    message.includes("etimedout") ||
    message.includes("econnaborted")
  ) {
    return { category: "timeout", retryable: true, originalError: err };
  }

  // Rate limit errors
  if (
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("429")
  ) {
    return { category: "rate_limit", retryable: true, statusCode: 429, originalError: err };
  }

  // Auth errors
  if (
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("auth") ||
    message.includes("401") ||
    message.includes("403")
  ) {
    return {
      category: "auth",
      retryable: false,
      statusCode: message.includes("403") ? 403 : 401,
      originalError: err,
    };
  }

  // Network errors
  if (
    message.includes("network") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("network error")
  ) {
    return { category: "network", retryable: true, originalError: err };
  }

  // Validation errors
  if (
    message.includes("validation") ||
    message.includes("invalid") ||
    message.includes("bad request") ||
    message.includes("400")
  ) {
    return { category: "validation", retryable: false, statusCode: 400, originalError: err };
  }

  // Quota errors
  if (
    message.includes("quota") ||
    message.includes("limit exceeded") ||
    message.includes("insufficient")
  ) {
    return { category: "quota", retryable: false, statusCode: 429, originalError: err };
  }

  // API errors
  if (message.includes("api") || message.includes("internal server error") || message.includes("500")) {
    return { category: "api", retryable: true, statusCode: 500, originalError: err };
  }

  // Unknown errors
  return { category: "unknown", retryable: false, originalError: err };
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onRetry?: (error: EnhancedError, attempt: number) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000, onRetry } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const metadata = categorizeError(error);
      const enhancedError = new EnhancedError(
        metadata.originalError?.message || "Unknown error",
        metadata
      );

      // Don't retry non-retryable errors
      if (!metadata.retryable || attempt === maxRetries) {
        throw enhancedError;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );

      if (onRetry) {
        onRetry(enhancedError, attempt + 1);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never be reached
  throw new EnhancedError("Max retries exceeded", { category: "unknown", retryable: false });
}

/**
 * Log error with structured format
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const metadata = categorizeError(error);
  const enhancedError = new EnhancedError(
    metadata.originalError?.message || "Unknown error",
    { ...metadata, originalError: metadata.originalError }
  );

  const logEntry = {
    ...enhancedError.toJSON(),
    context,
    environment: process.env.NODE_ENV,
  };

  // In production, you might send this to a logging service
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to external logging service
    console.error("[ERROR]", JSON.stringify(logEntry));
  } else {
    console.error("[ERROR]", logEntry);
  }
}
