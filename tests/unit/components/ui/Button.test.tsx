import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

/**
 * Example component test
 * 
 * In production, you would test your actual Button component.
 * This is a placeholder demonstrating the pattern.
 */

// Simple test component
function TestButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      {children}
    </button>
  );
}

describe("TestButton", () => {
  it("renders children correctly", () => {
    render(<TestButton>Click me</TestButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("has correct button role", () => {
    render(<TestButton>Click me</TestButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });
});
