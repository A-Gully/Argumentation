"use client";

import { useState } from "react";
import { createLogicGraphData } from "./actions";

type Props = {};

const LogicGraphInputForm = (props: Props) => {
  const [formData, setFormData] = useState({
    facts: "",
    rules: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form className="form-container" action={createLogicGraphData}>
      <label className="form-label">
        Facts:
        <input
          id="facts"
          type="text"
          name="facts"
          value={formData.facts}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <label className="form-label">
        Rules:
        <input
          id="rules"
          type="text"
          name="rules"
          value={formData.rules}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <button className="form-submit" type="submit">
        Create Graph
      </button>
      <label className="form-label">Facts: (x),(y) Rules: (!x,y,c),(c,d)</label>
    </form>
  );
};

export default LogicGraphInputForm;
