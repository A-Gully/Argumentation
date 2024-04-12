// Example.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Example from "./about-grounded";

vi.mock("reactstrap", () => {
  const originalModule = vi.importActual("reactstrap");
  return {
    __esModule: true,
    ...originalModule,
    Modal: ({
      isOpen,
      children,
      toggle,
    }: {
      isOpen: boolean;
      children: React.ReactNode;
      toggle: () => void;
    }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
    ModalBody: (): {} => <></>,
    ModalFooter: (): {} => <></>,
    Button: (): {} => <></>,
  };
});

describe("Example Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the info button", () => {
    render(<Example title="Test Title" info="Test Info" />);
    expect(screen.getByRole("button", { name: "" })).toBeDefined(); // Checks if the button is rendered
  });
});
