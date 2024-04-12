// admissibleLabelling.test.ts
import { describe, it, expect } from "vitest";
import { Node, Edge } from "react-vis-graph-wrapper"; // Assuming these types are imported for consistency
import {
  admissibleLabelling,
  isLegallyIn,
  isLegallyOut,
  transitionStep,
} from "./admissible-labelling"; // Adjust the import path based on your project structure

// Define the Label type for clarity
type Label = "green" | "red" | "grey";

// Use the Labelling interface as specified
export interface Labelling {
  [id: string]: Label;
}

describe("Labelling Functions", () => {
  describe("isLegallyIn", () => {
    it("should determine if a node is legally in", () => {
      const labelling: Labelling = { "1": "green", "2": "red" };
      const edges: Edge[] = [{ from: "2", to: "1", label: "" }];
      expect(isLegallyIn(labelling, "1", edges)).toBe(true);
    });

    it("should determine if a node is not legally in", () => {
      const labelling: Labelling = { "1": "green", "2": "green" };
      const edges: Edge[] = [{ from: "2", to: "1", label: "" }];
      expect(isLegallyIn(labelling, "1", edges)).toBe(false);
    });
  });

  describe("isLegallyOut", () => {
    it("should determine if a node is legally out", () => {
      const labelling: Labelling = { "1": "red", "2": "green" };
      const edges: Edge[] = [{ from: "2", to: "1", label: "" }];
      expect(isLegallyOut(labelling, "1", edges)).toBe(true);
    });

    it("should determine if a node is not legally out", () => {
      const labelling: Labelling = { "1": "red", "2": "red" };
      const edges: Edge[] = [{ from: "2", to: "1", label: "" }];
      expect(isLegallyOut(labelling, "1", edges)).toBe(false);
    });
  });

  describe("transitionStep", () => {
    it("should transition a node to red and adjust connected nodes", () => {
      const labelling: Labelling = { "1": "green", "2": "green" };
      const edges: Edge[] = [{ from: "1", to: "2", label: "" }];
      const newLabelling = transitionStep(labelling, "1", edges);
      expect(newLabelling["1"]).toBe("grey");
      // Checking the side effect on the connected node
      expect(newLabelling["2"]).toBe("green");
    });
  });
});
