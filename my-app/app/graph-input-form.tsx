"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { createGraphData } from "./actions";

type Props = {};

const GraphInputForm = (props: Props) => {
  // const router = useRouter();
  const [formData, setFormData] = useState({
    relations: "",
  });

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     const response = await fetch("/api/submit-form", {
  //       method: "POST",
  //       body: JSON.stringify(formData),
  //     });

  //     if (response.ok) {
  //       const body = await response.json();
  //       const graphData = JSON.stringify(body.data);
  //       console.log(graphData);
  //       router.push("/result/" + graphData);
  //     } else {
  //       // Handle error
  //       console.error("Failed to submit form data");
  //     }
  //   } catch (error) {
  //     // Handle network errors
  //     console.error("Network error occurred:", error);
  //   }
  // };

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
        Insert Relations:
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
        Submit
      </button>
      <label className="form-label">Example: (x),(y),(a,b),(b,c)</label>
    </form>
  );
};

export default GraphInputForm;
