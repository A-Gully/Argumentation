"use client";

import React from "react";
import VisGraph, { Edge, Node } from "react-vis-graph-wrapper";
import { GraphData } from "./page";
import { groundedLabelling } from "./grounded-labelling";
import { admissibleLabelling } from "./admissible-labelling";
import { preferredLabelling } from "./preferred-labelling";

type Props = {
  data: GraphData;
  labelling: string;
};

const GraphView = (props: Props) => {
  let graph = [
    {
      nodes: props.data.nodes,
      edges: props.data.edges,
    },
  ];
  if (props.labelling == "G") {
    graph = [
      {
        nodes: groundedLabelling(props.data.nodes, props.data.edges),
        edges: props.data.edges,
      },
    ];
  } else if (props.labelling == "A") {
    graph = [
      {
        nodes: admissibleLabelling(props.data.nodes, props.data.edges),
        edges: props.data.edges,
      },
    ];
  } else if (props.labelling == "P") {
    const possibleNodes = preferredLabelling(
      props.data.nodes,
      props.data.edges
    );
    graph = [];
    for (const nodes of possibleNodes) {
      graph.push({
        nodes: nodes,
        edges: props.data.edges,
      });
    }
  } else {
    props.data.nodes.forEach((node) => {
      node.color = "white";
      node.borderWidth = 3;
    });
  }

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
      smooth: true,
    },
    height: "500px",
  };

  return (
    <ul className="graphs">
      {graph.map((graph, i) => (
        <li className="graphs" key={i}>
          <VisGraph key={i} className="graph" options={options} graph={graph} />
        </li>
      ))}
    </ul>
  );
};
export default GraphView;
