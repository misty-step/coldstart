import { describe, it, expect, vi } from "vitest";
import {
  EnhancedError,
  categorizeError,
  retryWithBackoff,
  logError,
} from "@/lib/error";

describe("EnhancedError", () => {
  it("should create an error with metadata", () => {
    const error = new EnhancedError("Test error", {
      category: "validation",
      retryable: false,
      statusCode: 400,
    });

    expect(error.message).toBe("Test error");
    expect(error.category).toBe("validation");
    expect(error.retryable).toBe(false);
    expect(error.statusCode).toBe(400);
    expect(error.timestamp).toBeDefined();
  });

  it("should convert to JSON", () => {
    const error = new EnhancedError("Test error", {
      category: "api",
      retryable: true,
      statusCode: 500,
    });

    const json = error.toJSON();
    expect(json.message).toBe("Test error");
    expect(json.category).toBe("api");
    expect(json.retryable).toBe(true);
  });
});

describe("categorizeError", () => {
  it("should categorize timeout errors", () => {
    const error = new Error("Request timeout");
    const metadata = categorizeError(error);

    expect(metadata.category).toBe("timeout");
    expect(metadata.retryable).toBe(true);
  });

  it("should categorize rate limit errors", () => {
    const error = new Error("Rate limit exceeded");
    const metadata = categorizeError(error);

    expect(metadata.category).toBe("rate_limit");
    expect(metadata.retryable).toBe(true);
    expect(metadata.statusCode).toBe(429);
  });

  it("should categorize auth errors", () => {
    const error = new Error("Unauthorized");
    const metadata = categorizeError(error);

    expect(metadata.category).toBe("auth");
    expect(metadata.retryable).toBe(false);
  });

  it("should categorize network errors", () => {
    const error = new Error("Network error");
    const metadata = categorizeError(error);

    expect(metadata.category).toBe("network");
    expect(metadata.retryable).toBe(true);
  });

  it("should handle EnhancedError instances", () => {
    const original = new EnhancedError("Original", {
      category: "validation",
      retryable: false,
    });
    const metadata = categorizeError(original);

    expect(metadata.category).toBe("validation");
    expect(metadata.retryable).toBe(false);
  });
});

describe("retryWithBackoff", () => {
  it("should return result on successful call", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await retryWithBackoff(fn);

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should retry on retryable errors", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValue("success");

    const result = await retryWithBackoff(fn, { maxRetries: 2, baseDelay: 10 });

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should not retry on non-retryable errors", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("validation failed"));

    await expect(retryWithBackoff(fn, { maxRetries: 2 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should call onRetry callback", async () => {
    const onRetry = vi.fn();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValue("success");

    await retryWithBackoff(fn, { maxRetries: 2, baseDelay: 10, onRetry });

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(expect.any(EnhancedError), 1);
  });
});

describe("logError", () => {
  it("should log error with structured format", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Test error");

    logError(error, { userId: "123" });

    expect(consoleSpy).toHaveBeenCalled();
    const logEntry = consoleSpy.mock.calls[0][1];
    expect(logEntry).toHaveProperty("message", "Test error");
    expect(logEntry).toHaveProperty("context", { userId: "123" });

    consoleSpy.mockRestore();
  });
});
