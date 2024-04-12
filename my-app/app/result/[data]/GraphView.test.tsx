// GraphView.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GraphView from "./graph-view";
import { GraphData } from "./page";
import * as labellingModules from "./grounded-labelling";

vi.mock("react-vis-graph-wrapper", () => ({
  __esModule: true,
  default: ({ graph }: { graph: any }) => (
    <div data-testid="vis-graph">{JSON.stringify(graph)}</div>
  ),
}));

// Mocking labelling functions
vi.mock("./grounded-labelling", () => ({
  groundedLabelling: vi.fn(),
}));

vi.mock("./admissible-labelling", () => ({
  admissibleLabelling: vi.fn(),
}));

vi.mock("./preferred-labelling", () => ({
  preferredLabelling: vi.fn(),
}));

describe("GraphView Component", () => {
  it("renders correctly with no specific labelling", () => {
    const mockData: GraphData = {
      nodes: [{ id: "1", label: "a" }],
      edges: [],
    };

    render(<GraphView data={mockData} labelling="N" />);
    expect(screen.getByTestId("vis-graph"));
  });

  it("applies grounded labelling correctly", () => {
    const mockData: GraphData = {
      nodes: [{ id: "1", label: "a" }],
      edges: [],
    };

    const mockedGroundedNodes = [{ id: "1", label: "a", color: "green" }];
    vi.spyOn(labellingModules, "groundedLabelling").mockReturnValue(
      mockedGroundedNodes
    );

    render(<GraphView data={mockData} labelling="G" />);
    expect(labellingModules.groundedLabelling).toHaveBeenCalledWith(
      mockData.nodes,
      mockData.edges
    );
    //expect(screen.getByTestId("vis-graph")).toContain("green");
  });
});
