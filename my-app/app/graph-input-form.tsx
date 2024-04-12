"use client";

import { useState } from "react";
import { createGraphData } from "./actions";

type Props = {};
//Logic program input form
const GraphInputForm = (props: Props) => {
  const [formData, setFormData] = useState({
    relations: "",
  });
  //saves changes made in the form
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  return (
    <form className="form-container" action={createGraphData}>
      <label className="form-label">
        Relations:
        <input
          id="relations"
          type="text"
          name="relations"
          value={formData.relations}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <button className="form-submit" type="submit">
        Create Graph
      </button>
      <label className="form-label">Example: (x),(y),(a,b),(b,c)</label>
    </form>
  );
};

export default GraphInputForm;
